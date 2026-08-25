import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { execute, query, sqlString } from '@/lib/sqlite'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

function authenticated(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)

  if (!match) return false

  try {
    jwt.verify(match[1], JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  if (!authenticated(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const rows = await query(`
      SELECT
        id,
        name,
        role,
        tagline,
        bio,
        location,
        email,
        availability,
        image
      FROM Profile
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    return NextResponse.json({
      profile: rows[0] || null,
    })
  } catch (error) {
    console.error('PROFILE GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  if (!authenticated(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    const name = String(body.name || '').trim()
    const role = String(body.role || '').trim()
    const tagline = String(body.tagline || '').trim()
    const bio = String(body.bio || '').trim()
    const location = String(body.location || '').trim()
    const email = String(body.email || '').trim()
    const availability = String(body.availability || '').trim()
    const image = String(body.image || '').trim()

    if (!name || !role || !tagline || !bio || !email) {
      return NextResponse.json(
        {
          error:
            'Name, role, tagline, bio and email are required',
        },
        { status: 400 }
      )
    }

    const existing = await query<{ id: string }>(`
      SELECT id
      FROM Profile
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    if (existing.length > 0) {
      await execute(`
        UPDATE Profile
        SET
          name = ${sqlString(name)},
          role = ${sqlString(role)},
          tagline = ${sqlString(tagline)},
          bio = ${sqlString(bio)},
          location = ${sqlString(location)},
          email = ${sqlString(email)},
          availability = ${sqlString(availability)},
          image = ${sqlString(image)},
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ${sqlString(existing[0].id)}
      `)
    } else {
      await execute(`
        INSERT INTO Profile (
          id,
          name,
          role,
          tagline,
          bio,
          location,
          email,
          availability,
          image
        )
        VALUES (
          ${sqlString('profile-main')},
          ${sqlString(name)},
          ${sqlString(role)},
          ${sqlString(tagline)},
          ${sqlString(bio)},
          ${sqlString(location)},
          ${sqlString(email)},
          ${sqlString(availability)},
          ${sqlString(image)}
        )
      `)
    }

    const rows = await query(`
      SELECT
        id,
        name,
        role,
        tagline,
        bio,
        location,
        email,
        availability,
        image
      FROM Profile
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    return NextResponse.json({
      ok: true,
      profile: rows[0] || null,
    })
  } catch (error) {
    console.error('PROFILE SAVE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
