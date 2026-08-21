import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
    })
    if (!project) return Response.json({ error: 'Project not found' }, { status: 404 })
    return Response.json(project)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export const PUT = async (request: Request, { params }: { params: { slug: string } }) => {
  try {
    const body = await request.json()
    const project = await prisma.project.update({
      where: { slug: params.slug },
      data: body,
    })
    return Response.json(project)
  } catch (error) {
    return Response.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export const DELETE = async (request: Request, { params }: { params: { slug: string } }) => {
  try {
    await prisma.project.delete({
      where: { slug: params.slug },
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
