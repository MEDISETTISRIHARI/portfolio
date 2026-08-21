import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    const data = await prisma.testimonial.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
