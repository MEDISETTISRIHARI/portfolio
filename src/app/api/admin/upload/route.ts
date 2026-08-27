import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

function authenticated(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)

  if (!match) {
    return false
  }

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

  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'video/x-m4v': '.m4v',
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    if (!authenticated(req)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        'BLOB_READ_WRITE_TOKEN is not configured'
      )

      return NextResponse.json(
        {
          error:
            'File storage is not configured on the server',
        },
        { status: 500 }
      )
    }

    const form = await req.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file selected' },
        { status: 400 }
      )
    }

    const extension = extensions[file.type]

    if (!extension) {
      return NextResponse.json(
        {
          error:
            'Only JPG, PNG, WEBP, GIF, MP4, WebM, MOV and M4V files are allowed',
        },
        { status: 400 }
      )
    }

    const isVideo = file.type.startsWith('video/')

    /*
     * This route receives the file through a Vercel Function.
     * Vercel limits server-upload request bodies to 4.5 MB.
     *
     * Images are therefore limited to 4 MB here.
     * Larger files should use a client-upload flow later.
     */
    const maxSize = isVideo
      ? 4 * 1024 * 1024
      : 4 * 1024 * 1024

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            'File is too large for this upload method. Maximum size is 4MB.',
        },
        { status: 413 }
      )
    }

    const filename =
      `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`

    const blob = await put(
      `portfolio/${filename}`,
      file,
      {
        access: 'public',
        addRandomSuffix: false,
        contentType: file.type,
      }
    )

    return NextResponse.json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error(
      'VERCEL BLOB FILE UPLOAD ERROR:',
      error
    )

    return NextResponse.json(
      {
        ok: false,
        error: 'File upload failed',
      },
      { status: 500 }
    )
  }
}