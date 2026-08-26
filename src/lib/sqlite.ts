import { prisma } from '@/lib/prisma'

export function sqlString(value: unknown) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`
}

export async function query<T = any>(sql: string): Promise<T[]> {
  return (await prisma.$queryRawUnsafe(sql)) as T[]
}

export async function execute(sql: string) {
  await prisma.$executeRawUnsafe(sql)
}
