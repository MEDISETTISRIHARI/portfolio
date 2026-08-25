import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'srihari-development-secret'

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)

  if (!match) {
    return NextResponse.json({ authenticated: false })
  }

  try {
    const admin = jwt.verify(match[1], JWT_SECRET)
    return NextResponse.json({ authenticated: true, admin })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
