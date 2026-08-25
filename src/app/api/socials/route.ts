import { NextResponse } from 'next/server'
import { query } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        id,
        platform,
        username,
        url,
        icon,
        visible,
        "order",
        createdAt,
        updatedAt
      FROM SocialLink
      WHERE visible = 1
      ORDER BY "order" ASC, createdAt ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('SOCIALS GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to fetch social links' },
      { status: 500 }
    )
  }
}
