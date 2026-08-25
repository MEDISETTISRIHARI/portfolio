import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const message = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        projectType: body.projectType,
        budget: body.budget,
        message: body.message,
      },
    })
    return Response.json(message, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
