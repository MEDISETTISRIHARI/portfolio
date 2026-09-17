import { NextResponse } from 'next/server'
import {
  handleUpload,
  put,
  type HandleUploadBody,
} from '@vercel/blob'
import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function authenticated(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/)

  if (!match) return false

  try {
    jwt.verify(decodeURIComponent(match[1]), JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * This endpoint supports both upload formats used by the admin panel:
 *
 * 1. multipart/form-data  -> image uploads from ImageUpload
 * 2. application/json      -> Vercel Blob client uploads for videos
 */
export async function POST(req: Request) {
  if (!authenticated(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const contentType = req.headers.get('content-type') || ''

  try {
    // ImageUpload sends FormData directly to this route.
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const entry = formData.get('file')

      if (!(entry instanceof File)) {
        return NextResponse.json(
          { error: 'No image file was provided' },
          { status: 400 }
        )
      }

      if (!ALLOWED_IMAGE_TYPES.has(entry.type)) {
        return NextResponse.json(
          { error: 'Only JPG, PNG, WEBP or GIF images are allowed' },
          { status: 400 }
        )
      }

      if (entry.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Image must be smaller than 10MB' },
          { status: 400 }
        )
      }

      const blob = await put(entry.name, entry, {
        access: 'public',
        addRandomSuffix: true,
        contentType: entry.type,
      })

      return NextResponse.json({
        ok: true,
        url: blob.url,
      })
    }

    // VideoUpload uses the Vercel Blob client upload protocol.
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as HandleUploadBody

      const jsonResponse = await handleUpload({
        body,
        request: req,

        onBeforeGenerateToken: async () => ({
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-m4v',
          ],
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
        }),

        onUploadCompleted: async ({ blob }) => {
          console.log('VIDEO UPLOAD COMPLETED:', blob.url)
        },
      })

      return NextResponse.json(jsonResponse)
    }

    return NextResponse.json(
      { error: 'Unsupported upload content type' },
      { status: 415 }
    )
  } catch (error) {
    console.error('ADMIN UPLOAD ERROR:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Upload failed',
      },
      { status: 500 }
    )
  }
}
