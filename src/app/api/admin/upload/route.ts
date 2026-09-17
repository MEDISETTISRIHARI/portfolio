import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { put } from '@vercel/blob'
import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

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

export async function POST(req: Request) {
  try {
    if (!authenticated(req)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const contentType = req.headers.get('content-type') || ''

    // Image uploads send multipart/form-data.
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file')

      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: 'No image file provided' },
          { status: 400 }
        )
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image must be smaller than 10MB' },
          { status: 400 }
        )
      }

      const blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
      })

      return NextResponse.json({
        ok: true,
        url: blob.url,
      })
    }

    // Video uploads use the Vercel Blob client-upload protocol.
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
  } catch (error) {
    console.error('VERCEL BLOB UPLOAD ERROR:', error)

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
