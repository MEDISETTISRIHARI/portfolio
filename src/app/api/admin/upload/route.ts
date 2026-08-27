import { NextResponse } from 'next/server'
import {
  handleUpload,
  type HandleUploadBody,
} from '@vercel/blob/client'
import jwt from 'jsonwebtoken'

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

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request: req,

      onBeforeGenerateToken: async () => {
        if (!authenticated(req)) {
          throw new Error('Unauthorized')
        }

        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-m4v',
          ],

          maximumSizeInBytes:
            100 * 1024 * 1024,

          addRandomSuffix: true,
        }
      },

      onUploadCompleted: async ({ blob }) => {
        console.log(
          'VIDEO UPLOAD COMPLETED:',
          blob.url
        )
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error(
      'VERCEL BLOB CLIENT UPLOAD ERROR:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Video upload failed',
      },
      { status: 500 }
    )
  }
}