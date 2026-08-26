import { prisma } from '@/lib/prisma'

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
    .map((x) => x.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'))
    .join('|')})\\b`,
  'g'
)

function postgresSql(sql: string) {
  let result = sql

  result = result.replace(identifierPattern, (_, identifier) => {
    return `"${identifier}"`
  })

  result = result
    .replace(/"TRUE"/g, 'TRUE')
    .replace(/"FALSE"/g, 'FALSE')
    .replace(/"CURRENT_TIMESTAMP"/g, 'CURRENT_TIMESTAMP')

  result = result.replace(/"1"/g, '1')
  result = result.replace(/"0"/g, '0')

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

  return result
}

export function sqlString(value: unknown) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`
}

export async function query<T = any>(sql: string): Promise<T[]> {
  return (await prisma.$queryRawUnsafe(
    postgresSql(sql)
  )) as T[]
}

export async function execute(sql: string) {
  await prisma.$executeRawUnsafe(
    postgresSql(sql)
  )
}
