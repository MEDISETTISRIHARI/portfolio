import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

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
    const profile = await prisma.profile.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json({
      profile: profile || null,
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

    const existing = await prisma.profile.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
      },
    })

    let profile

    if (existing) {
      profile = await prisma.profile.update({
        where: {
          id: existing.id,
        },
        data: {
          name,
          role,
          tagline,
          bio,
          location: location || null,
          email,
          availability: availability || null,
          image: image || null,
        },
      })
    } else {
      profile = await prisma.profile.create({
        data: {
          name,
          role,
          tagline,
          bio,
          location: location || null,
          email,
          availability: availability || null,
          image: image || null,
        },
      })
    }

    return NextResponse.json({
      ok: true,
      profile,
    })
  } catch (error) {
    console.error('PROFILE SAVE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
