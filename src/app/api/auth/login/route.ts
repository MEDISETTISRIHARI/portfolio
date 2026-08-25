import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { execFileSync } from 'child_process'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db')
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

    const safeEmail = String(email).replace(/'/g, "''")

    const sql =
      `SELECT id,email,password FROM Admin WHERE email='${safeEmail}';`

    const result = execFileSync(
      'sqlite3',
      ['-json', DB_PATH, sql],
      { encoding: 'utf8' }
    ).trim()

    const rows = result ? JSON.parse(result) : []
    const admin = rows[0]

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const validPassword = bcrypt.compareSync(
      password,
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
      secure: false,
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
