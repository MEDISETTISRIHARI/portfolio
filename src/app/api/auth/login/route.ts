import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email: String(email).trim(),
      },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(
      String(password),
      admin.password
    )

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
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

    const response = NextResponse.json({ ok: true })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error)

    return NextResponse.json(
      { error: 'Login server error' },
      { status: 500 }
    )
  }
}
