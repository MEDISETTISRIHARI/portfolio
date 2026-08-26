import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { execute, query, sqlString } from '@/lib/sqlite'

const JWT_SECRET =
  process.env.JWT_SECRET || 'srihari-development-secret'

type Resource =
  | 'profile'
  | 'hero'
  | 'projects'
  | 'skills'
  | 'services'
  | 'socials'
  | 'reviews'

function isAuthenticated(req: Request) {
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

function getResource(req: Request): Resource | null {
  const url = new URL(req.url)
  const resource = url.searchParams.get('resource')

  const allowed: Resource[] = [
    'profile',
    'hero',
    'projects',
    'skills',
    'services',
    'socials',
    'reviews',
  ]

  if (
    !resource ||
    !allowed.includes(resource as Resource)
  ) {
    return null
  }

  return resource as Resource
}

function jsonArray(value: unknown) {
  if (Array.isArray(value)) {
    return JSON.stringify(value)
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)

      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed)
      }
    } catch {
      return JSON.stringify([])
    }
  }

  return JSON.stringify([])
}

function clean(value: unknown) {
  return String(value ?? '').trim()
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const resource = getResource(req)

  if (!resource) {
    return NextResponse.json(
      { error: 'Invalid resource' },
      { status: 400 }
    )
  }

  try {
    if (resource === 'profile') {
      const rows = await query(`
        SELECT
          id,
          name,
          role,
          tagline,
          bio,
          location,
          email,
          availability,
          image
        FROM Profile
        ORDER BY createdAt ASC
        LIMIT 1
      `)

      return NextResponse.json({
        data: rows[0] || null,
      })
    }

    if (resource === 'hero') {
      const rows = await query(`
        SELECT
          id,
          headline,
          subtitle,
          description,
          image,
          video,
          visualMode,
          ctaText,
          ctaLink,
          secondaryCta,
          secondaryLink
        FROM Hero
        ORDER BY createdAt ASC
        LIMIT 1
      `)

      return NextResponse.json({
        data: rows[0] || null,
      })
    }

    if (resource === 'projects') {
      const rows = await query(`
        SELECT
          id,
          title,
          slug,
          category,
          year,
          shortDesc,
          fullDesc,
          thumbnail,
          heroImage,
          gallery,
          video,
          technologies,
          liveUrl,
          caseStudy,
          featured,
          published,
          "order"
        FROM Project
        ORDER BY "order" ASC, createdAt ASC
      `)

      return NextResponse.json({
        data: rows,
      })
    }

    if (resource === 'skills') {
      const rows = await query(`
        SELECT
          id,
          category,
          title,
          items,
          "order",
          visible
        FROM Skill
        ORDER BY "order" ASC, createdAt ASC
      `)

      return NextResponse.json({
        data: rows,
      })
    }

    if (resource === 'services') {
      const rows = await query(`
        SELECT
          id,
          title,
          desc,
          "order",
          visible
        FROM Service
        ORDER BY "order" ASC, createdAt ASC
      `)

      return NextResponse.json({
        data: rows,
      })
    }

    if (resource === 'socials') {
      const rows = await query(`
        SELECT
          id,
          platform,
          username,
          url,
          icon,
          visible,
          "order"
        FROM SocialLink
        ORDER BY "order" ASC, createdAt ASC
      `)

      return NextResponse.json({
        data: rows,
      })
    }

    if (resource === 'reviews') {
      const rows = await query(`
        SELECT
          id,
          name,
          role,
          company,
          quote,
          image,
          visible,
          "order",
          createdAt,
          updatedAt
        FROM Testimonial
        ORDER BY "order" ASC, createdAt ASC
      `)

      return NextResponse.json({
        data: rows,
      })
    }

    return NextResponse.json(
      { error: 'Unsupported resource' },
      { status: 400 }
    )
  } catch (error) {
    console.error('ADMIN GET ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const resource = getResource(req)

  if (!resource) {
    return NextResponse.json(
      { error: 'Invalid resource' },
      { status: 400 }
    )
  }

  try {
    const body = await req.json()

    /*
     * PROFILE
     */
    if (resource === 'profile') {
      const existing = await query<{ id: string }>(`
        SELECT id
        FROM Profile
        ORDER BY createdAt ASC
        LIMIT 1
      `)

      const name = clean(body.name)
      const role = clean(body.role)
      const tagline = clean(body.tagline)
      const bio = clean(body.bio)
      const location = clean(body.location)
      const email = clean(body.email)
      const availability = clean(body.availability)
      const image = clean(body.image)

      if (!name || !role || !email) {
        return NextResponse.json(
          {
            error:
              'Name, role and email are required',
          },
          { status: 400 }
        )
      }

      if (existing.length) {
        await execute(`
          UPDATE Profile SET
            name = ${sqlString(name)},
            role = ${sqlString(role)},
            tagline = ${sqlString(tagline)},
            bio = ${sqlString(bio)},
            location = ${sqlString(location)},
            email = ${sqlString(email)},
            availability = ${sqlString(availability)},
            image = ${sqlString(image)},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(existing[0].id)}
        `)
      } else {
        await execute(`
          INSERT INTO Profile (
            id,
            name,
            role,
            tagline,
            bio,
            location,
            email,
            availability,
            image,
            updatedAt
          )
          VALUES (
            ${sqlString('profile-main')},
            ${sqlString(name)},
            ${sqlString(role)},
            ${sqlString(tagline)},
            ${sqlString(bio)},
            ${sqlString(location)},
            ${sqlString(email)},
            ${sqlString(availability)},
            ${sqlString(image)},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
      })
    }

    /*
     * HERO
     */
    if (resource === 'hero') {
      const existing = await query<{ id: string }>(`
        SELECT id
        FROM Hero
        ORDER BY createdAt ASC
        LIMIT 1
      `)

      const headline = clean(body.headline)
      const subtitle = clean(body.subtitle)
      const description = clean(body.description)
      const image = clean(body.image)
      const video = clean(body.video)

      const visualMode =
        clean(body.visualMode) || 'image'

      const ctaText = clean(body.ctaText)
      const ctaLink = clean(body.ctaLink)
      const secondaryCta =
        clean(body.secondaryCta)
      const secondaryLink =
        clean(body.secondaryLink)

      if (
        !headline ||
        !subtitle ||
        !description
      ) {
        return NextResponse.json(
          {
            error:
              'Headline, subtitle and description are required',
          },
          { status: 400 }
        )
      }

      if (existing.length) {
        await execute(`
          UPDATE Hero SET
            headline = ${sqlString(headline)},
            subtitle = ${sqlString(subtitle)},
            description = ${sqlString(description)},
            image = ${sqlString(image)},
            video = ${sqlString(video)},
            visualMode = ${sqlString(visualMode)},
            ctaText = ${sqlString(ctaText)},
            ctaLink = ${sqlString(ctaLink)},
            secondaryCta = ${sqlString(secondaryCta)},
            secondaryLink = ${sqlString(secondaryLink)},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(existing[0].id)}
        `)
      } else {
        await execute(`
          INSERT INTO Hero (
            id,
            headline,
            subtitle,
            description,
            image,
            video,
            visualMode,
            ctaText,
            ctaLink,
            secondaryCta,
            secondaryLink,
            updatedAt
          )
          VALUES (
            ${sqlString('hero-main')},
            ${sqlString(headline)},
            ${sqlString(subtitle)},
            ${sqlString(description)},
            ${sqlString(image)},
            ${sqlString(video)},
            ${sqlString(visualMode)},
            ${sqlString(ctaText)},
            ${sqlString(ctaLink)},
            ${sqlString(secondaryCta)},
            ${sqlString(secondaryLink)},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
      })
    }

    /*
     * PROJECTS
     */
    if (resource === 'projects') {
      const id =
        clean(body.id) ||
        `project-${Date.now()}`

      const title = clean(body.title)
      const slug = clean(body.slug)
      const category = clean(body.category)
      const year = clean(body.year)
      const shortDesc = clean(body.shortDesc)
      const fullDesc = clean(body.fullDesc)
      const thumbnail = clean(body.thumbnail)
      const heroImage = clean(body.heroImage)
      const gallery = jsonArray(body.gallery)
      const video = clean(body.video)
      const technologies =
        jsonArray(body.technologies)
      const liveUrl = clean(body.liveUrl)
      const caseStudy = clean(body.caseStudy)

      const featured =
        body.featured ? 1 : 0

      const published =
        body.published === false ? 0 : 1

      const order =
        Number.isFinite(Number(body.order))
          ? Number(body.order)
          : 0

      if (
        !title ||
        !slug ||
        !category ||
        !shortDesc ||
        !thumbnail
      ) {
        return NextResponse.json(
          {
            error:
              'Title, slug, category, short description and thumbnail are required',
          },
          { status: 400 }
        )
      }

      /*
       * Prevent duplicate slugs.
       *
       * This check is separate from the ID check because
       * slug is UNIQUE in the database.
       */
      const duplicateSlug =
        await query<{ id: string }>(`
          SELECT id
          FROM Project
          WHERE slug = ${sqlString(slug)}
          AND id != ${sqlString(id)}
          LIMIT 1
        `)

      if (duplicateSlug.length) {
        return NextResponse.json(
          {
            error:
              'That project slug is already in use. Please choose another slug.',
          },
          { status: 409 }
        )
      }

      const existing =
        await query<{ id: string }>(`
          SELECT id
          FROM Project
          WHERE id = ${sqlString(id)}
          LIMIT 1
        `)

      if (existing.length) {
        await execute(`
          UPDATE Project SET
            title = ${sqlString(title)},
            slug = ${sqlString(slug)},
            category = ${sqlString(category)},
            year = ${sqlString(year)},
            shortDesc = ${sqlString(shortDesc)},
            fullDesc = ${sqlString(fullDesc)},
            thumbnail = ${sqlString(thumbnail)},
            heroImage = ${sqlString(heroImage)},
            gallery = ${sqlString(gallery)},
            video = ${sqlString(video)},
            technologies = ${sqlString(technologies)},
            liveUrl = ${sqlString(liveUrl)},
            caseStudy = ${sqlString(caseStudy)},
            featured = ${featured},
            published = ${published},
            "order" = ${order},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(id)}
        `)
      } else {
        await execute(`
          INSERT INTO Project (
            id,
            title,
            slug,
            category,
            year,
            shortDesc,
            fullDesc,
            thumbnail,
            heroImage,
            gallery,
            video,
            technologies,
            liveUrl,
            caseStudy,
            featured,
            published,
            "order",
            updatedAt
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(title)},
            ${sqlString(slug)},
            ${sqlString(category)},
            ${sqlString(year)},
            ${sqlString(shortDesc)},
            ${sqlString(fullDesc)},
            ${sqlString(thumbnail)},
            ${sqlString(heroImage)},
            ${sqlString(gallery)},
            ${sqlString(video)},
            ${sqlString(technologies)},
            ${sqlString(liveUrl)},
            ${sqlString(caseStudy)},
            ${featured},
            ${published},
            ${order},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
        id,
      })
    }

    /*
     * SKILLS
     */
    if (resource === 'skills') {
      const id =
        clean(body.id) ||
        `skill-${Date.now()}`

      const category = clean(body.category)
      const title = clean(body.title)
      const items = jsonArray(body.items)

      const order =
        Number.isFinite(Number(body.order))
          ? Number(body.order)
          : 0

      const visible =
        body.visible === false ? 0 : 1

      if (!category || !title) {
        return NextResponse.json(
          {
            error:
              'Category and title are required',
          },
          { status: 400 }
        )
      }

      const existing =
        await query<{ id: string }>(`
          SELECT id
          FROM Skill
          WHERE id = ${sqlString(id)}
          LIMIT 1
        `)

      if (existing.length) {
        await execute(`
          UPDATE Skill SET
            category = ${sqlString(category)},
            title = ${sqlString(title)},
            items = ${sqlString(items)},
            "order" = ${order},
            visible = ${visible},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(id)}
        `)
      } else {
        await execute(`
          INSERT INTO Skill (
            id,
            category,
            title,
            items,
            "order",
            visible,
            updatedAt
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(category)},
            ${sqlString(title)},
            ${sqlString(items)},
            ${order},
            ${visible},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
        id,
      })
    }

    /*
     * SERVICES
     */
    if (resource === 'services') {
      const id =
        clean(body.id) ||
        `service-${Date.now()}`

      const title = clean(body.title)
      const desc = clean(body.desc)

      const order =
        Number.isFinite(Number(body.order))
          ? Number(body.order)
          : 0

      const visible =
        body.visible === false ? 0 : 1

      if (!title || !desc) {
        return NextResponse.json(
          {
            error:
              'Title and description are required',
          },
          { status: 400 }
        )
      }

      const existing =
        await query<{ id: string }>(`
          SELECT id
          FROM Service
          WHERE id = ${sqlString(id)}
          LIMIT 1
        `)

      if (existing.length) {
        await execute(`
          UPDATE Service SET
            title = ${sqlString(title)},
            desc = ${sqlString(desc)},
            "order" = ${order},
            visible = ${visible},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(id)}
        `)
      } else {
        await execute(`
          INSERT INTO Service (
            id,
            title,
            desc,
            "order",
            visible,
            updatedAt
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(title)},
            ${sqlString(desc)},
            ${order},
            ${visible},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
        id,
      })
    }

    /*
     * SOCIAL LINKS
     */
    if (resource === 'socials') {
      const id =
        clean(body.id) ||
        `social-${Date.now()}`

      const platform = clean(body.platform)
      const username = clean(body.username)
      const url = clean(body.url)
      const icon = clean(body.icon)

      const order =
        Number.isFinite(Number(body.order))
          ? Number(body.order)
          : 0

      const visible =
        body.visible === false ? 0 : 1

      if (!platform || !username || !url) {
        return NextResponse.json(
          {
            error:
              'Platform, username and URL are required',
          },
          { status: 400 }
        )
      }

      const existing =
        await query<{ id: string }>(`
          SELECT id
          FROM SocialLink
          WHERE id = ${sqlString(id)}
          LIMIT 1
        `)

      if (existing.length) {
        await execute(`
          UPDATE SocialLink SET
            platform = ${sqlString(platform)},
            username = ${sqlString(username)},
            url = ${sqlString(url)},
            icon = ${sqlString(icon)},
            "order" = ${order},
            visible = ${visible},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(id)}
        `)
      } else {
        await execute(`
          INSERT INTO SocialLink (
            id,
            platform,
            username,
            url,
            icon,
            "order",
            visible,
            updatedAt
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(platform)},
            ${sqlString(username)},
            ${sqlString(url)},
            ${sqlString(icon)},
            ${order},
            ${visible},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
        id,
      })
    }

    /*
     * REVIEWS
     */
    if (resource === 'reviews') {
      const id =
        clean(body.id) ||
        `review-${Date.now()}`

      const name = clean(body.name)
      const role = clean(body.role)
      const company = clean(body.company)
      const quote = clean(body.quote)
      const image = clean(body.image)

      const order =
        Number.isFinite(Number(body.order))
          ? Number(body.order)
          : 0

      const visible =
        body.visible === false ? 0 : 1

      if (!name || !quote) {
        return NextResponse.json(
          {
            error:
              'Reviewer name and review are required',
          },
          { status: 400 }
        )
      }

      const existing =
        await query<{ id: string }>(`
          SELECT id
          FROM Testimonial
          WHERE id = ${sqlString(id)}
          LIMIT 1
        `)

      if (existing.length) {
        await execute(`
          UPDATE Testimonial SET
            name = ${sqlString(name)},
            role = ${sqlString(role)},
            company = ${sqlString(company)},
            quote = ${sqlString(quote)},
            image = ${sqlString(image)},
            "order" = ${order},
            visible = ${visible},
            updatedAt = CURRENT_TIMESTAMP
          WHERE id = ${sqlString(id)}
        `)
      } else {
        await execute(`
          INSERT INTO Testimonial (
            id,
            name,
            role,
            company,
            quote,
            image,
            "order",
            visible,
            updatedAt
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(name)},
            ${sqlString(role)},
            ${sqlString(company)},
            ${sqlString(quote)},
            ${sqlString(image)},
            ${order},
            ${visible},
            CURRENT_TIMESTAMP
          )
        `)
      }

      return NextResponse.json({
        ok: true,
        id,
      })
    }

    return NextResponse.json(
      { error: 'Unsupported resource' },
      { status: 400 }
    )
  } catch (error) {
    console.error('ADMIN SAVE ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to save data',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const resource = getResource(req)

  if (!resource) {
    return NextResponse.json(
      { error: 'Invalid resource' },
      { status: 400 }
    )
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const tables: Record<string, string> = {
      projects: 'Project',
      skills: 'Skill',
      services: 'Service',
      socials: 'SocialLink',
      reviews: 'Testimonial',
    }

    const table = tables[resource]

    if (!table) {
      return NextResponse.json(
        {
          error:
            'This resource cannot be deleted',
        },
        { status: 400 }
      )
    }

    await execute(`
      DELETE FROM ${table}
      WHERE id = ${sqlString(id)}
    `)

    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    console.error('ADMIN DELETE ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to delete item',
      },
      { status: 500 }
    )
  }
}