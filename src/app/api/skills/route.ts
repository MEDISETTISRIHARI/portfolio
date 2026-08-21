import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    const data = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}
