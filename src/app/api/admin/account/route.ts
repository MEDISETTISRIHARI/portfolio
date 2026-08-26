import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { execFileSync } from 'child_process'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db')

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

function sqlString(value: string) {
  return `'${String(value).replace(/'/g, "''")}'`
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

    const existingEmailResult = execFileSync(
      'sqlite3',
      [
        '-json',
        DB_PATH,
        `SELECT id FROM Admin WHERE email=${sqlString(email)} AND id != ${sqlString(currentAdmin.id)} LIMIT 1;`,
      ],
      { encoding: 'utf8' }
    ).trim()

    const existingEmailRows = existingEmailResult
      ? JSON.parse(existingEmailResult)
      : []

    if (existingEmailRows.length > 0) {
      return NextResponse.json(
        { error: 'That email is already being used.' },
        { status: 409 }
      )
    }

    let sql = ''

    if (password) {
      const passwordHash = bcrypt.hashSync(password, 10)

      sql = `
        UPDATE Admin
        SET
          email = ${sqlString(email)},
          password = ${sqlString(passwordHash)}
        WHERE id = ${sqlString(currentAdmin.id)};
      `
    } else {
      sql = `
        UPDATE Admin
        SET
          email = ${sqlString(email)}
        WHERE id = ${sqlString(currentAdmin.id)};
      `
    }

    execFileSync(
      'sqlite3',
      [DB_PATH, sql],
      { encoding: 'utf8' }
    )

    const result = execFileSync(
      'sqlite3',
      [
        '-json',
        DB_PATH,
        `SELECT id,email FROM Admin WHERE id=${sqlString(currentAdmin.id)} LIMIT 1;`,
      ],
      { encoding: 'utf8' }
    ).trim()

    const rows = result ? JSON.parse(result) : []
    const admin = rows[0]

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
      admin: {
        id: admin.id,
        email: admin.email,
      },
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
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