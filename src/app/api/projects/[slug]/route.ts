import { NextResponse } from 'next/server'
import { execute, query, sqlString } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    const rows = await query(`
      SELECT *
      FROM Project
      WHERE slug = ${sqlString(slug)}
      LIMIT 1
    `)

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('PROJECT GET ERROR:', error)

    return NextResponse.json(
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

    const existing = await query<{ id: string }>(`
      SELECT id
      FROM Project
      WHERE slug = ${sqlString(slug)}
      LIMIT 1
    `)

    if (!existing.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const allowed = [
      'title',
      'slug',
      'category',
      'year',
      'shortDesc',
      'fullDesc',
      'thumbnail',
      'heroImage',
      'gallery',
      'video',
      'technologies',
      'liveUrl',
      'caseStudy',
      'featured',
      'published',
      'order',
    ]

    const updates: string[] = []

    for (const key of allowed) {
      if (!(key in body)) continue

      let value = body[key]

      if (
        (key === 'gallery' || key === 'technologies') &&
        Array.isArray(value)
      ) {
        value = JSON.stringify(value)
      }

      if (
        key === 'featured' ||
        key === 'published' ||
        key === 'order'
      ) {
        const numberValue =
          key === 'order'
            ? Number(value || 0)
            : value ? 1 : 0

        updates.push(
          `"${key}" = ${numberValue}`
        )
      } else {
        updates.push(
          `"${key}" = ${sqlString(value)}`
        )
      }
    }

    if (updates.length) {
      updates.push(
        `updatedAt = CURRENT_TIMESTAMP`
      )

      await execute(`
        UPDATE Project
        SET ${updates.join(', ')}
        WHERE id = ${sqlString(existing[0].id)}
      `)
    }

    const rows = await query(`
      SELECT *
      FROM Project
      WHERE id = ${sqlString(existing[0].id)}
      LIMIT 1
    `)

    return NextResponse.json(rows[0] || null)
  } catch (error) {
    console.error('PROJECT PUT ERROR:', error)

    return NextResponse.json(
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

    const existing = await query<{ id: string }>(`
      SELECT id
      FROM Project
      WHERE slug = ${sqlString(slug)}
      LIMIT 1
    `)

    if (!existing.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await execute(`
      DELETE FROM Project
      WHERE id = ${sqlString(existing[0].id)}
    `)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('PROJECT DELETE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
