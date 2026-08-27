
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
    return value
  }

  return JSON.stringify([])
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
    /*
     * PROFILE
     */

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

    /*
     * HERO
     */

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

    /*
     * PROJECTS
     */

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

    /*
     * SKILLS
     */

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

    /*
     * SERVICES
     */

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

    /*
     * SOCIAL LINKS
     */

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

    /*
     * REVIEWS
     *
     * Uses the existing Testimonial table.
     */

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

      const values = {
        name: String(body.name || ''),
        role: String(body.role || ''),
        tagline: String(body.tagline || ''),
        bio: String(body.bio || ''),
        location: String(body.location || ''),
        email: String(body.email || ''),
        availability: String(
          body.availability || ''
        ),
        image: String(body.image || ''),
      }

      if (existing.length) {
        await execute(`
          UPDATE Profile SET
            name = ${sqlString(values.name)},
            role = ${sqlString(values.role)},
            tagline = ${sqlString(values.tagline)},
            bio = ${sqlString(values.bio)},
            location = ${sqlString(values.location)},
            email = ${sqlString(values.email)},
            availability = ${sqlString(values.availability)},
            image = ${sqlString(values.image)},
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
            image
          )
          VALUES (
            ${sqlString('profile-main')},
            ${sqlString(values.name)},
            ${sqlString(values.role)},
            ${sqlString(values.tagline)},
            ${sqlString(values.bio)},
            ${sqlString(values.location)},
            ${sqlString(values.email)},
            ${sqlString(values.availability)},
            ${sqlString(values.image)}
          )
        `)
      }

      return NextResponse.json({ ok: true })
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

      const values = {
        headline: String(body.headline || ''),
        subtitle: String(body.subtitle || ''),
        description: String(body.description || ''),
        image: String(body.image || ''),
        video: String(body.video || ''),
        visualMode: String(
          body.visualMode || 'image'
        ),
        ctaText: String(body.ctaText || ''),
        ctaLink: String(body.ctaLink || ''),
        secondaryCta: String(
          body.secondaryCta || ''
        ),
        secondaryLink: String(
          body.secondaryLink || ''
        ),
      }

      if (existing.length) {
        await execute(`
          UPDATE Hero SET
            headline = ${sqlString(values.headline)},
            subtitle = ${sqlString(values.subtitle)},
            description = ${sqlString(values.description)},
            image = ${sqlString(values.image)},
            video = ${sqlString(values.video)},
            visualMode = ${sqlString(values.visualMode)},
            ctaText = ${sqlString(values.ctaText)},
            ctaLink = ${sqlString(values.ctaLink)},
            secondaryCta = ${sqlString(values.secondaryCta)},
            secondaryLink = ${sqlString(values.secondaryLink)},
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
            secondaryLink
          )
          VALUES (
            ${sqlString('hero-main')},
            ${sqlString(values.headline)},
            ${sqlString(values.subtitle)},
            ${sqlString(values.description)},
            ${sqlString(values.image)},
            ${sqlString(values.video)},
            ${sqlString(values.visualMode)},
            ${sqlString(values.ctaText)},
            ${sqlString(values.ctaLink)},
            ${sqlString(values.secondaryCta)},
            ${sqlString(values.secondaryLink)}
          )
        `)
      }

      return NextResponse.json({ ok: true })
    }

    /*
     * PROJECTS
     */

    if (resource === 'projects') {
      const id =
        String(body.id || '').trim() ||
        `project-${Date.now()}`

      const existing = await query<{ id: string }>(`
        SELECT id
        FROM Project
        WHERE id = ${sqlString(id)}
        LIMIT 1
      `)

      const title = String(body.title || '').trim()
      const slug = String(body.slug || '').trim()
      const category = String(
        body.category || ''
      ).trim()
      const year = String(body.year || '').trim()
      const shortDesc = String(
        body.shortDesc || ''
      ).trim()
      const fullDesc = String(
        body.fullDesc || ''
      ).trim()
      const thumbnail = String(
        body.thumbnail || ''
      ).trim()
      const heroImage = String(
        body.heroImage || ''
      ).trim()
      const gallery = jsonArray(body.gallery)
      const video = String(body.video || '').trim()
      const technologies = jsonArray(
        body.technologies
      )
      const liveUrl = String(
        body.liveUrl || ''
      ).trim()
      const caseStudy = String(
        body.caseStudy || ''
      ).trim()
const featured = body.featured ? 'TRUE' : 'FALSE'  
const published = body.published === false ? 'FALSE' : 'TRUE'
      const order = Number(body.order || 0)

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
            "order"
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
            ${order}
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
        String(body.id || '').trim() ||
        `skill-${Date.now()}`

      const category = String(
        body.category || ''
      ).trim()
      const title = String(
        body.title || ''
      ).trim()
      const items = jsonArray(body.items)
      const order = Number(body.order || 0)
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

      const existing = await query<{ id: string }>(`
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
            visible
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(category)},
            ${sqlString(title)},
            ${sqlString(items)},
            ${order},
            ${visible}
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
        String(body.id || '').trim() ||
        `service-${Date.now()}`

      const title = String(
        body.title || ''
      ).trim()
      const desc = String(
        body.desc || ''
      ).trim()
      const order = Number(body.order || 0)
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

      const existing = await query<{ id: string }>(`
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
            visible
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(title)},
            ${sqlString(desc)},
            ${order},
            ${visible}
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
        String(body.id || '').trim() ||
        `social-${Date.now()}`

      const platform = String(
        body.platform || ''
      ).trim()
      const username = String(
        body.username || ''
      ).trim()
      const url = String(
        body.url || ''
      ).trim()
      const icon = String(
        body.icon || ''
      ).trim()
      const order = Number(body.order || 0)
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

      const existing = await query<{ id: string }>(`
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
            visible
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(platform)},
            ${sqlString(username)},
            ${sqlString(url)},
            ${sqlString(icon)},
            ${order},
            ${visible}
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
     *
     * Uses the existing Testimonial table.
     */

    if (resource === 'reviews') {
      const id =
        String(body.id || '').trim() ||
        `review-${Date.now()}`

      const name = String(
        body.name || ''
      ).trim()

      const role = String(
        body.role || ''
      ).trim()

      const company = String(
        body.company || ''
      ).trim()

      const quote = String(
        body.quote || ''
      ).trim()

      const image = String(
        body.image || ''
      ).trim()

      const order = Number(body.order || 0)

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

      const existing = await query<{ id: string }>(`
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
            visible
          )
          VALUES (
            ${sqlString(id)},
            ${sqlString(name)},
            ${sqlString(role)},
            ${sqlString(company)},
            ${sqlString(quote)},
            ${sqlString(image)},
            ${order},
            ${visible}
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
      { error: 'Failed to save data' },
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
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
