import { NextResponse } from 'next/server'
import { execute, query, sqlString } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function clean(value: unknown) {
  return String(value ?? '').trim()
}

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        id,
        headline,
        subtitle,
        description,
        image,
        video,
        visualMode,
        ctaText,
        ctaLink,
        secondaryCta,
        secondaryLink,
        createdAt,
        updatedAt
      FROM Hero
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    return NextResponse.json(
      rows[0] || null,
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('HERO GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to fetch hero' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const headline = clean(body.headline)
    const subtitle = clean(body.subtitle)
    const description = clean(body.description)

    if (!headline || !subtitle || !description) {
      return NextResponse.json(
        {
          error:
            'headline, subtitle and description are required',
        },
        { status: 400 }
      )
    }

    const image = clean(body.image)
    const video = clean(body.video)
    const visualMode = clean(body.visualMode) || 'image'
    const ctaText = clean(body.ctaText)
    const ctaLink = clean(body.ctaLink)
    const secondaryCta = clean(body.secondaryCta)
    const secondaryLink = clean(body.secondaryLink)

    const existing = await query(
      `SELECT id FROM Hero ORDER BY createdAt ASC LIMIT 1`
    )

    if (existing.length > 0) {
      await execute(`
        UPDATE Hero SET
          headline = ${sqlString(headline)},
          subtitle = ${sqlString(subtitle)},
          description = ${sqlString(description)},
          image = ${sqlString(image)},
          video = ${sqlString(video)},
          visualMode = ${sqlString(visualMode)},
          ctaText = ${sqlString(ctaText)},
          ctaLink = ${sqlString(ctaLink)},
          secondaryCta = ${sqlString(secondaryCta)},
          secondaryLink = ${sqlString(secondaryLink)},
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ${sqlString(existing[0].id)}
      `)
    } else {
      await execute(`
        INSERT INTO Hero (
          id,
          headline,
          subtitle,
          description,
          image,
          video,
          visualMode,
          ctaText,
          ctaLink,
          secondaryCta,
          secondaryLink
        ) VALUES (
          'hero-main',
          ${sqlString(headline)},
          ${sqlString(subtitle)},
          ${sqlString(description)},
          ${sqlString(image)},
          ${sqlString(video)},
          ${sqlString(visualMode)},
          ${sqlString(ctaText)},
          ${sqlString(ctaLink)},
          ${sqlString(secondaryCta)},
          ${sqlString(secondaryLink)}
        )
      `)
    }

    const rows = await query(`
      SELECT
        id,
        headline,
        subtitle,
        description,
        image,
        video,
        visualMode,
        ctaText,
        ctaLink,
        secondaryCta,
        secondaryLink,
        createdAt,
        updatedAt
      FROM Hero
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    return NextResponse.json(rows[0] || null)
  } catch (error) {
    console.error('HERO PUT ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update hero' },
      { status: 500 }
    )
  }
}
