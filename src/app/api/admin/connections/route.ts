import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { execute, query, sqlString } from '@/lib/sqlite'

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'srihari-development-secret'

function isAuthenticated(req: Request) {
  const cookie =
    req.headers.get('cookie') || ''

  const match =
    cookie.match(/admin_token=([^;]+)/)

  if (!match) {
    return false
  }

  try {
    jwt.verify(
      match[1],
      JWT_SECRET
    )

    return true
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      {
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
        email,
        projectType,
        budget,
        message,
        status,
        createdAt
      FROM ContactMessage
      ORDER BY createdAt DESC
    `)

    return NextResponse.json({
      ok: true,
      data: rows,
    })
  } catch (error) {
    console.error(
      'ADMIN CONNECTIONS GET ERROR:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to load connections.',
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(
  req: Request
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

  try {
    const body = await req.json()

    const id = String(
      body.id || ''
    ).trim()

    const status = String(
      body.status || ''
    ).trim()

    const allowedStatuses = [
      'new',
      'read',
      'archived',
    ]

    if (!id) {
      return NextResponse.json(
        {
          error: 'Connection ID is required.',
        },
        {
          status: 400,
        }
      )
    }

    if (
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid connection status.',
        },
        {
          status: 400,
        }
      )
    }

    const existing = await query<{
      id: string
    }>(`
      SELECT id
      FROM ContactMessage
      WHERE id = ${sqlString(id)}
      LIMIT 1
    `)

    if (!existing.length) {
      return NextResponse.json(
        {
          error:
            'Connection not found.',
        },
        {
          status: 404,
        }
      )
    }

    await execute(`
      UPDATE ContactMessage
      SET status = ${sqlString(status)}
      WHERE id = ${sqlString(id)}
    `)

    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    console.error(
      'ADMIN CONNECTION UPDATE ERROR:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to update connection.',
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  req: Request
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

  try {
    const url = new URL(req.url)

    const id = String(
      url.searchParams.get('id') || ''
    ).trim()

    if (!id) {
      return NextResponse.json(
        {
          error:
            'Connection ID is required.',
        },
        {
          status: 400,
        }
      )
    }

    await execute(`
      DELETE FROM ContactMessage
      WHERE id = ${sqlString(id)}
    `)

    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    console.error(
      'ADMIN CONNECTION DELETE ERROR:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to delete connection.',
      },
      {
        status: 500,
      }
    )
  }
}