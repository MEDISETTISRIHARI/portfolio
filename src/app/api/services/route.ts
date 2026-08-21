import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const data = await prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}
