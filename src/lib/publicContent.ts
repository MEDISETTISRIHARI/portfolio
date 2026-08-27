import { query } from '@/lib/sqlite'

export type PortfolioContent = {
  profile: any | null
  hero: any | null
  projects: any[]
  skills: any[]
  services: any[]
  testimonials: any[]
  socials: any[]
}

function parseJson(value: unknown, fallback: any = []) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return fallback
  }

  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()

    return (
      v === 'true' ||
      v === '1' ||
      v === 'yes' ||
      v === 'on'
    )
  }

  return Boolean(value)
}

export async function getPublicContent(): Promise<PortfolioContent> {
  const [
    profile,
    hero,
    projects,
    skills,
    services,
    testimonials,
    socials,
  ] = await Promise.all([
    query(`
      SELECT
        id,
        name,
        role,
        tagline,
        bio,
        location,
        email,
        availability,
        image,
        createdAt,
        updatedAt
      FROM Profile
      ORDER BY createdAt ASC
      LIMIT 1
    `),

    query(`
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
        secondaryLink,
        createdAt,
        updatedAt
      FROM Hero
      ORDER BY createdAt ASC
      LIMIT 1
    `),

    query(`
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
        "order",
        createdAt,
        updatedAt
      FROM Project
      WHERE published = TRUE
      ORDER BY "order" ASC, createdAt ASC
    `),

    query(`
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
    `),

    query(`
      SELECT
        id,
        title,
        desc,
        "order",
        visible,
        createdAt,
        updatedAt
      FROM Service
      WHERE visible = TRUE
      ORDER BY "order" ASC, createdAt ASC
    `),

    query(`
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
      WHERE visible = TRUE
      ORDER BY "order" ASC, createdAt ASC
    `),

    query(`
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
      WHERE visible = TRUE
      ORDER BY "order" ASC, createdAt ASC
    `),
  ])

  return {
    profile: profile[0] || null,

    hero: hero[0] || null,

    projects: projects.map((project: any) => ({
      ...project,
      featured: toBoolean(project.featured),
      published: toBoolean(project.published),
      gallery: parseJson(project.gallery, []),
      technologies: parseJson(
        project.technologies,
        []
      ),
    })),

    skills: skills.map((skill: any) => ({
      ...skill,
      visible: toBoolean(skill.visible),
      items: parseJson(skill.items, []),
    })),

    services: services.map((service: any) => ({
      ...service,
      visible: toBoolean(service.visible),
    })),

    testimonials: testimonials.map(
      (testimonial: any) => ({
        ...testimonial,
        visible: toBoolean(
          testimonial.visible
        ),
      })
    ),

    socials: socials.map((social: any) => ({
      ...social,
      visible: toBoolean(social.visible),
    })),
  }
}