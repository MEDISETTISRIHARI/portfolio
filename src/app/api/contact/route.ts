import { NextResponse } from 'next/server'
import { execute, query, sqlString } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const projectType = String(body.projectType || '').trim()
    const budget = String(body.budget || '').trim()
    const message = String(body.message || '').trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error: 'Name, email and message are required',
        },
        { status: 400 }
      )
    }

    const id = `contact-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    await execute(`
      INSERT INTO ContactMessage (
        id,
        name,
        email,
        projectType,
        budget,
        message
      )
      VALUES (
        ${sqlString(id)},
        ${sqlString(name)},
        ${sqlString(email)},
        ${sqlString(projectType)},
        ${sqlString(budget)},
        ${sqlString(message)}
      )
    `)

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
      WHERE id = ${sqlString(id)}
      LIMIT 1
    `)

    return NextResponse.json(
      rows[0] || null,
      { status: 201 }
    )
  } catch (error) {
    console.error('CONTACT POST ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
