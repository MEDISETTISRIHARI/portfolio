import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

function getAdminFromCookie(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)

  if (!match) {
    return null
  }

  try {
    return jwt.verify(match[1], JWT_SECRET) as {
      id: string
      email: string
    }
  } catch {
    return null
  }
}

export async function PUT(req: Request) {
  try {
    const currentAdmin = getAdminFromCookie(req)

    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const email = String(body.email || '').trim()
    const password =
      body.password === undefined
        ? ''
        : String(body.password)

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email,
        NOT: {
          id: currentAdmin.id,
        },
      },
      select: {
        id: true,
      },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'That email is already being used.' },
        { status: 409 }
      )
    }

    const data: {
      email: string
      password?: string
    } = {
      email,
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10)
    }

    await prisma.admin.update({
      where: {
        id: currentAdmin.id,
      },
      data,
    })

    const admin = await prisma.admin.findUnique({
      where: {
        id: currentAdmin.id,
      },
      select: {
        id: true,
        email: true,
      },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin account could not be found after update.' },
        { status: 404 }
      )
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      ok: true,
      admin,
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('ADMIN ACCOUNT UPDATE ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to update admin account' },
      { status: 500 }
    )
  }
}
