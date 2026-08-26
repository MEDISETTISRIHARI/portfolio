import { NextResponse } from 'next/server'
import { execute, query, sqlString } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        id,
        name,
        role,
        company,
        quote,
        image,
        visible,
        "order",
        createdAt,
        updatedAt
      FROM Testimonial
      WHERE visible = 1
      ORDER BY "order" ASC, createdAt ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('REVIEWS GET ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch reviews',
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = String(body.name || '').trim()
    const role = String(body.role || '').trim()
    const company = String(body.company || '').trim()
    const quote = String(body.quote || '').trim()

    if (!name || !quote) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Name and review are required',
        },
        {
          status: 400,
        }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Name is too long',
        },
        {
          status: 400,
        }
      )
    }

    if (quote.length > 2000) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Review is too long',
        },
        {
          status: 400,
        }
      )
    }

    const id = `review-${Date.now()}`

    await execute(`
      INSERT INTO Testimonial (
        id,
        name,
        role,
        company,
        quote,
        image,
        visible,
        "order",
        createdAt,
        updatedAt
      )
      VALUES (
        ${sqlString(id)},
        ${sqlString(name)},
        ${sqlString(role)},
        ${sqlString(company)},
        ${sqlString(quote)},
        '',
        1,
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `)

    return NextResponse.json({
      ok: true,
      id,
    })
  } catch (error) {
    console.error('REVIEW POST ERROR:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to submit review',
      },
      {
        status: 500,
      }
    )
  }
}
