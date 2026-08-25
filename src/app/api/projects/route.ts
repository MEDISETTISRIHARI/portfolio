import { NextResponse } from 'next/server'
import { execute, query, sqlString } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        id,
        title,
        slug,
        category,
        year,
        shortDesc,
        fullDesc,
        thumbnail,
        heroImage,
        gallery,
        video,
        technologies,
        liveUrl,
        caseStudy,
        featured,
        published,
        "order",
        createdAt,
        updatedAt
      FROM Project
      WHERE published = 1
      ORDER BY "order" ASC, createdAt ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('PROJECTS GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const id =
      String(body.id || '').trim() ||
      `project-${Date.now()}`

    const title = String(body.title || '').trim()
    const slug = String(body.slug || '').trim()
    const category = String(body.category || '').trim()
    const year = String(body.year || '').trim()
    const shortDesc = String(body.shortDesc || '').trim()
    const fullDesc = String(body.fullDesc || '').trim()
    const thumbnail = String(body.thumbnail || '').trim()
    const heroImage = String(body.heroImage || '').trim()
    const gallery = Array.isArray(body.gallery)
      ? JSON.stringify(body.gallery)
      : String(body.gallery || '')
    const video = String(body.video || '').trim()
    const technologies = Array.isArray(body.technologies)
      ? JSON.stringify(body.technologies)
      : String(body.technologies || '')
    const liveUrl = String(body.liveUrl || '').trim()
    const caseStudy = String(body.caseStudy || '').trim()
    const featured = body.featured ? 1 : 0
    const published = body.published === false ? 0 : 1
    const order = Number(body.order || 0)

    if (
      !title ||
      !slug ||
      !category ||
      !shortDesc ||
      !thumbnail
    ) {
      return NextResponse.json(
        {
          error:
            'Title, slug, category, short description and thumbnail are required',
        },
        { status: 400 }
      )
    }

    await execute(`
      INSERT INTO Project (
        id,
        title,
        slug,
        category,
        year,
        shortDesc,
        fullDesc,
        thumbnail,
        heroImage,
        gallery,
        video,
        technologies,
        liveUrl,
        caseStudy,
        featured,
        published,
        "order"
      )
      VALUES (
        ${sqlString(id)},
        ${sqlString(title)},
        ${sqlString(slug)},
        ${sqlString(category)},
        ${sqlString(year)},
        ${sqlString(shortDesc)},
        ${sqlString(fullDesc)},
        ${sqlString(thumbnail)},
        ${sqlString(heroImage)},
        ${sqlString(gallery)},
        ${sqlString(video)},
        ${sqlString(technologies)},
        ${sqlString(liveUrl)},
        ${sqlString(caseStudy)},
        ${featured},
        ${published},
        ${order}
      )
    `)

    const rows = await query(`
      SELECT *
      FROM Project
      WHERE id = ${sqlString(id)}
      LIMIT 1
    `)

    return NextResponse.json(
      rows[0] || null,
      { status: 201 }
    )
  } catch (error) {
    console.error('PROJECT POST ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
