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
        tagline,
        bio,
        location,
        email,
        availability,
        image,
        createdAt,
        updatedAt
      FROM Profile
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
    console.error('PROFILE GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const values = {
      name: String(body.name || ''),
      role: String(body.role || ''),
      tagline: String(body.tagline || ''),
      bio: String(body.bio || ''),
      location: String(body.location || ''),
      email: String(body.email || ''),
      availability: String(body.availability || ''),
      image: String(body.image || ''),
    }

    const existing = await query<{ id: string }>(`
      SELECT id
      FROM Profile
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    if (existing.length) {
      await execute(`
        UPDATE Profile SET
          name = ${sqlString(values.name)},
          role = ${sqlString(values.role)},
          tagline = ${sqlString(values.tagline)},
          bio = ${sqlString(values.bio)},
          location = ${sqlString(values.location)},
          email = ${sqlString(values.email)},
          availability = ${sqlString(values.availability)},
          image = ${sqlString(values.image)},
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
          ${sqlString(values.name)},
          ${sqlString(values.role)},
          ${sqlString(values.tagline)},
          ${sqlString(values.bio)},
          ${sqlString(values.location)},
          ${sqlString(values.email)},
          ${sqlString(values.availability)},
          ${sqlString(values.image)}
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
        image,
        createdAt,
        updatedAt
      FROM Profile
      ORDER BY createdAt ASC
      LIMIT 1
    `)

    return NextResponse.json(rows[0] || null)
  } catch (error) {
    console.error('PROFILE PUT ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
