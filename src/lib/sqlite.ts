import { prisma } from '@/lib/prisma'

export function sqlString(value: unknown) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`
}

function postgresSql(sql: string) {
  let result = sql

  const tables = [
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
  ]

  for (const table of tables) {
    result = result.replace(
      new RegExp(`\\b${table}\\b`, 'g'),
      `"${table}"`
    )
  }

  result = result.replace(/\b(published|visible|featured)\s*=\s*1\b/g, '$1 = true')
  result = result.replace(/\b(published|visible|featured)\s*=\s*0\b/g, '$1 = false')

  return result
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
