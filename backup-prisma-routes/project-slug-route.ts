import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type RouteContext = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = await params

    const project = await prisma.project.findUnique({
      where: { slug },
    })

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return Response.json(project)
  } catch (error) {
    console.error('PROJECT GET ERROR:', error)

    return Response.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const project = await prisma.project.update({
      where: { slug },
      data: body,
    })

    return Response.json(project)
  } catch (error) {
    console.error('PROJECT PUT ERROR:', error)

    return Response.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = await params

    await prisma.project.delete({
      where: { slug },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('PROJECT DELETE ERROR:', error)

    return Response.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
