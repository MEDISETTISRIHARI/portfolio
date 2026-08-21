import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })
    return Response.json(projects)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const project = await prisma.project.create({ data: body })
    return Response.json(project, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
