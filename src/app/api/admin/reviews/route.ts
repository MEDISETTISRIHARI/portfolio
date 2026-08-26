import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { execute, query, sqlString } from '@/lib/sqlite'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

function isAuthenticated(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)

  if (!match) {
    return false
  }

  try {
    jwt.verify(match[1], JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

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
      ORDER BY createdAt DESC
    `)

    return NextResponse.json({
      ok: true,
      data: rows,
    })
  } catch (error) {
    console.error('ADMIN REVIEWS GET ERROR:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to load reviews',
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

  try {
    const body = await req.json()

    const id = String(body.id || '').trim()

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Review ID is required',
        },
        {
          status: 400,
        }
      )
    }

    const existing = await query(
      `
        SELECT id
        FROM Testimonial
        WHERE id = ${sqlString(id)}
        LIMIT 1
      `
    )

    if (!existing.length) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Review not found',
        },
        {
          status: 404,
        }
      )
    }

    await execute(`
      DELETE FROM Testimonial
      WHERE id = ${sqlString(id)}
    `)

    return NextResponse.json({
      ok: true,
      message: 'Review deleted successfully',
      id,
    })
  } catch (error) {
    console.error('ADMIN REVIEW DELETE ERROR:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to delete review',
      },
      {
        status: 500,
      }
    )
  }
}
