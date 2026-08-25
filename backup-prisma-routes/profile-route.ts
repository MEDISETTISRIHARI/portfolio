import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    const data = await prisma.profile.findFirst()
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export const PUT = async (request: Request) => {
  try {
    const body = await request.json()
    const data = await prisma.profile.upsert({
      where: { id: 'profile-main' },
      update: body,
      create: { ...body, id: 'profile-main' },
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
