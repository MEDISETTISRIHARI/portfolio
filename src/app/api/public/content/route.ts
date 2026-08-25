import { NextResponse } from 'next/server'
import { getPublicContent } from '@/lib/publicContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const content = await getPublicContent()

    return NextResponse.json(
      {
        ok: true,
        data: content,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('PUBLIC CONTENT ERROR:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to load portfolio content',
      },
      {
        status: 500,
      }
    )
  }
}
