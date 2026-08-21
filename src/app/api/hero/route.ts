import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    const data = await prisma.hero.findFirst()
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch hero' }, { status: 500 })
  }
}

export const PUT = async (request: Request) => {
  try {
    const body = await request.json()
    const data = await prisma.hero.upsert({
      where: { id: 'hero-main' },
      update: body,
      create: { ...body, id: 'hero-main' },
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to update hero' }, { status: 500 })
  }
}
