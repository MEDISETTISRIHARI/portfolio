import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function text(value: unknown) {
  return String(value ?? '').trim()
}

export async function GET() {
  try {
    const rows = await prisma.testimonial.findMany({
      where: {
        visible: true,
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    })

    return NextResponse.json(rows)
  } catch (error) {
    console.error('REVIEWS GET ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch reviews',
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = text(body.name)
    const role = text(body.role)
    const company = text(body.company)
    const quote = text(body.quote)

    if (!name || !quote) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Name and review are required',
        },
        {
          status: 400,
        }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Name is too long',
        },
        {
          status: 400,
        }
      )
    }

    if (quote.length > 2000) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Review is too long',
        },
        {
          status: 400,
        }
      )
    }

    const id =
      `review-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`

    const review =
      await prisma.testimonial.create({
        data: {
          id,
          name,
          role: role || null,
          company: company || null,
          quote,
          image: null,
          visible: true,
          order: 0,
        },
      })

    return NextResponse.json({
      ok: true,
      id: review.id,
    })
  } catch (error) {
    console.error('REVIEW POST ERROR:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to submit review',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    )
  }
}