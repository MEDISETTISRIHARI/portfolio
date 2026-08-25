import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

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

const extensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export async function POST(req: Request) {
  try {
    if (!authenticated(req)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const form = await req.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No image selected' },
        { status: 400 }
      )
    }

    const extension = extensions[file.type]

    if (!extension) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, WEBP and GIF are allowed' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Maximum image size is 10MB' },
        { status: 400 }
      )
    }

    const filename =
      `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`

    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads'
    )

    await fs.mkdir(uploadDir, { recursive: true })

    const filepath = path.join(uploadDir, filename)

    const buffer = Buffer.from(
      await file.arrayBuffer()
    )

    await fs.writeFile(filepath, buffer)

    return NextResponse.json({
      ok: true,
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error('IMAGE UPLOAD ERROR:', error)

    return NextResponse.json(
      { error: 'Image upload failed' },
      { status: 500 }
    )
  }
}
