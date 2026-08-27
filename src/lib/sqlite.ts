import { prisma } from '@/lib/prisma'

/*
 * This file keeps the old helper name (`sqlite.ts`) so that
 * the existing API routes do not all need to be rewritten.
 *
 * IMPORTANT:
 * The application is now using PostgreSQL through Prisma.
 */

const identifiers = [
  'Admin',
  'Profile',
  'Hero',
  'Project',
  'Skill',
  'Service',
  'Testimonial',
  'SocialLink',
  'ContactMessage',
  'SiteSetting',

  'id',
  'email',
  'password',
  'createdAt',
  'updatedAt',

  'name',
  'role',
  'tagline',
  'bio',
  'location',
  'availability',
  'image',

  'headline',
  'subtitle',
  'description',
  'video',
  'visualMode',
  'ctaText',
  'ctaLink',
  'secondaryCta',
  'secondaryLink',

  'title',
  'slug',
  'category',
  'year',
  'shortDesc',
  'fullDesc',
  'thumbnail',
  'heroImage',
  'gallery',
  'technologies',
  'liveUrl',
  'caseStudy',

  'featured',
  'published',
  'order',

  'items',
  'visible',

  'desc',
  'company',
  'quote',

  'platform',
  'username',
  'url',
  'icon',

  'projectType',
  'budget',
  'message',
  'status',

  'key',
  'value',
]

const identifierPattern = new RegExp(
  `\\b(${identifiers
    .sort((a, b) => b.length - a.length)
    .map((value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    .join('|')})\\b`,
  'g'
)

/*
 * Convert the SQL written by the existing application
 * into PostgreSQL-compatible SQL.
 */
function postgresSql(sql: string) {
  const protectedParts: string[] = []

  function protect(value: string) {
    const token = `__SQL_PROTECTED_${protectedParts.length}__`

    protectedParts.push(value)

    return token
  }

  let result = sql

  /*
   * Protect string literals.
   *
   * Example:
   * 'Srihari'
   *
   * must never have its contents modified.
   */
  result = result.replace(
    /'(?:''|[^'])*'/g,
    (value) => protect(value)
  )

  /*
   * Protect identifiers that are already quoted.
   *
   * Example:
   * "order"
   */
  result = result.replace(
    /"(?:[^"]|"")*"/g,
    (value) => protect(value)
  )

  /*
   * Quote known Prisma/PostgreSQL identifiers.
   *
   * Example:
   *
   * Project
   * becomes
   * "Project"
   *
   * createdAt
   * becomes
   * "createdAt"
   */
  result = result.replace(
    identifierPattern,
    (_match, identifier) => `"${identifier}"`
  )

  /*
   * PostgreSQL constants must NOT be quoted.
   */
  result = result
    .replace(/"TRUE"/g, 'TRUE')
    .replace(/"FALSE"/g, 'FALSE')
    .replace(
      /"CURRENT_TIMESTAMP"/g,
      'CURRENT_TIMESTAMP'
    )

  /*
   * Convert numeric booleans to PostgreSQL booleans.
   *
   * SQLite:
   * featured = 1
   *
   * PostgreSQL:
   * "featured" = TRUE
   */
  result = result.replace(
    /"featured"\s*=\s*1/g,
    '"featured" = TRUE'
  )

  result = result.replace(
    /"featured"\s*=\s*0/g,
    '"featured" = FALSE'
  )

  result = result.replace(
    /"published"\s*=\s*1/g,
    '"published" = TRUE'
  )

  result = result.replace(
    /"published"\s*=\s*0/g,
    '"published" = FALSE'
  )

  result = result.replace(
    /"visible"\s*=\s*1/g,
    '"visible" = TRUE'
  )

  result = result.replace(
    /"visible"\s*=\s*0/g,
    '"visible" = FALSE'
  )

  /*
   * Convert numeric boolean values used in INSERT/UPDATE
   * statements.
   *
   * We intentionally only handle the common generated forms.
   */
  result = result.replace(
    /"featured"\s*=\s*1\b/g,
    '"featured" = TRUE'
  )

  result = result.replace(
    /"featured"\s*=\s*0\b/g,
    '"featured" = FALSE'
  )

  result = result.replace(
    /"published"\s*=\s*1\b/g,
    '"published" = TRUE'
  )

  result = result.replace(
    /"published"\s*=\s*0\b/g,
    '"published" = FALSE'
  )

  result = result.replace(
    /"visible"\s*=\s*1\b/g,
    '"visible" = TRUE'
  )

  result = result.replace(
    /"visible"\s*=\s*0\b/g,
    '"visible" = FALSE'
  )

  /*
   * Restore protected strings and already-quoted identifiers.
   */
  result = result.replace(
    /__SQL_PROTECTED_(\d+)__/g,
    (_match, index) =>
      protectedParts[Number(index)]
  )

  return result
}

/*
 * Safely create a SQL string literal for the existing
 * raw-SQL API code.
 */
export function sqlString(value: unknown) {
  return `'${String(value ?? '').replace(
    /'/g,
    "''"
  )}'`
}

/*
 * Execute SELECT queries using PostgreSQL through Prisma.
 */
export async function query<T = any>(
  sql: string
): Promise<T[]> {
  const convertedSql = postgresSql(sql)

  try {
    const result =
      await prisma.$queryRawUnsafe(convertedSql)

    return result as T[]
  } catch (error) {
    console.error('POSTGRES QUERY ERROR:', error)
    console.error('ORIGINAL SQL:', sql)
    console.error('CONVERTED SQL:', convertedSql)

    throw error
  }
}

/*
 * Execute INSERT / UPDATE / DELETE statements
 * using PostgreSQL through Prisma.
 */
export async function execute(sql: string) {
  const convertedSql = postgresSql(sql)

  try {
    await prisma.$executeRawUnsafe(convertedSql)
  } catch (error) {
    console.error('POSTGRES EXECUTE ERROR:', error)
    console.error('ORIGINAL SQL:', sql)
    console.error('CONVERTED SQL:', convertedSql)

    throw error
  }
}