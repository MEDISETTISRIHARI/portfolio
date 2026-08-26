import { NextResponse } from 'next/server'
import { query } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        id,
        category,
        title,
        items,
        "order",
        visible,
        createdAt,
        updatedAt
      FROM Skill
      WHERE visible = TRUE
      ORDER BY "order" ASC, createdAt ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('SKILLS GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}
