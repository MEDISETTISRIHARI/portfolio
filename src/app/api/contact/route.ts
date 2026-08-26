import { NextResponse } from 'next/server'
import { execute, query, sqlString } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function clean(value: unknown) {
  return String(value ?? '').trim()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = clean(body.name)
    const email = clean(body.email)
    const projectType = clean(body.projectType)
    const budget = clean(body.budget)
    const message = clean(body.message)

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Name, email and message are required.',
        },
        { status: 400 }
      )
    }

    if (name.length > 120) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Name is too long.',
        },
        { status: 400 }
      )
    }

    if (email.length > 200) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Email is too long.',
        },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Message is too long.',
        },
        { status: 400 }
      )
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Please enter a valid email address.',
        },
        { status: 400 }
      )
    }

    const id = `connection-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    await execute(`
      INSERT INTO ContactMessage (
        id,
        name,
        email,
        projectType,
        budget,
        message,
        status,
        createdAt
      )
      VALUES (
        ${sqlString(id)},
        ${sqlString(name)},
        ${sqlString(email)},
        ${sqlString(projectType)},
        ${sqlString(budget)},
        ${sqlString(message)},
        'new',
        CURRENT_TIMESTAMP
      )
    `)

    return NextResponse.json({
      ok: true,
      id,
      message:
        'Your message has been sent successfully.',
    })
  } catch (error) {
    console.error(
      'CONTACT SUBMISSION ERROR:',
      error
    )

    return NextResponse.json(
      {
        ok: false,
        error:
          'Unable to send your message right now.',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
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
      'CONTACT GET ERROR:',
      error
    )

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to fetch connections.',
      },
      { status: 500 }
    )
  }
}