import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function text(value: unknown) {
  return String(value ?? '').trim()
}

function arrayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)

      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      return []
    }
  }

  return []
}

function projectData(body: any) {
  return {
    title: text(body.title),
    slug: text(body.slug),
    category: text(body.category),
    year: text(body.year) || null,
    shortDesc: text(body.shortDesc),
    fullDesc: text(body.fullDesc) || null,
    thumbnail: text(body.thumbnail),
    heroImage: text(body.heroImage) || null,
    gallery: JSON.stringify(arrayValue(body.gallery)),
    video: text(body.video) || null,
    technologies: JSON.stringify(
      arrayValue(body.technologies)
    ),
    liveUrl: text(body.liveUrl) || null,
    caseStudy: text(body.caseStudy) || null,
    featured: Boolean(body.featured),
    published:
      body.published === false
        ? false
        : Boolean(body.published ?? true),
    order: Number(body.order ?? 0),
  }
}

function validate(data: ReturnType<typeof projectData>) {
  if (
    !data.title ||
    !data.slug ||
    !data.category ||
    !data.shortDesc ||
    !data.thumbnail
  ) {
    return (
      'Title, slug, category, short description and thumbnail are required'
    )
  }

  return null
}

export async function GET() {
  try {
    const rows = await prisma.project.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    })

    return NextResponse.json(rows)
  } catch (error) {
    console.error('PROJECTS GET ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = projectData(body)

    const validationError = validate(data)

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        {
          status: 400,
        }
      )
    }

    const requestedId = text(body.id)

    // If an ID is supplied and already exists,
    // treat POST as an update. This keeps compatibility
    // with an existing admin UI that may use POST for save.
    if (requestedId) {
      const existing = await prisma.project.findUnique({
        where: {
          id: requestedId,
        },
      })

      if (existing) {
        const updated = await prisma.project.update({
          where: {
            id: requestedId,
          },
          data,
        })

        return NextResponse.json(updated)
      }
    }

    const existingSlug = await prisma.project.findUnique({
      where: {
        slug: data.slug,
      },
    })

    if (existingSlug) {
      return NextResponse.json(
        {
          error:
            'A project with this slug already exists',
        },
        {
          status: 409,
        }
      )
    }

    const created = await prisma.project.create({
      data,
    })

    return NextResponse.json(
      created,
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error('PROJECT POST ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to create or update project',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const id = text(body.id)

    if (!id) {
      return NextResponse.json(
        {
          error: 'Project ID is required',
        },
        {
          status: 400,
        }
      )
    }

    const data = projectData(body)

    const validationError = validate(data)

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        {
          status: 400,
        }
      )
    }

    const existing = await prisma.project.findUnique({
      where: {
        id,
      },
    })

    if (!existing) {
      return NextResponse.json(
        {
          error: 'Project not found',
        },
        {
          status: 404,
        }
      )
    }

    const duplicateSlug = await prisma.project.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id,
        },
      },
    })

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error:
            'Another project already uses this slug',
        },
        {
          status: 409,
        }
      )
    }

    const updated = await prisma.project.update({
      where: {
        id,
      },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PROJECT PUT ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to update project',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()

    const id = text(body.id)

    if (!id) {
      return NextResponse.json(
        {
          error: 'Project ID is required',
        },
        {
          status: 400,
        }
      )
    }

    const existing = await prisma.project.findUnique({
      where: {
        id,
      },
    })

    if (!existing) {
      return NextResponse.json(
        {
          error: 'Project not found',
        },
        {
          status: 404,
        }
      )
    }

    await prisma.project.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      ok: true,
      id,
    })
  } catch (error) {
    console.error('PROJECT DELETE ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to delete project',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    )
  }
}