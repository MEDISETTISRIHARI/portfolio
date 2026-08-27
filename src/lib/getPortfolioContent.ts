import { query } from '@/lib/sqlite'

function parseJSON(
  value: unknown,
  fallback: any = []
) {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback
  }

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return fallback
  }

  if (!value.trim()) {
    return fallback
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

export async function getPortfolioContent() {
  const [
    profileRows,
    heroRows,
    projectRows,
    skillRows,
    serviceRows,
    socialRows,
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
        image
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
        secondaryLink
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
        "order"
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
        visible
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
        visible
      FROM Service
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
        "order"
      FROM SocialLink
      WHERE visible = TRUE
      ORDER BY "order" ASC, createdAt ASC
    `),
  ])

  return {
    profile: profileRows[0] || null,

    hero: heroRows[0] || null,

    projects: projectRows.map((project: any) => ({
      ...project,
      featured: toBoolean(project.featured),
      published: toBoolean(project.published),
      gallery: parseJSON(
        project.gallery,
        []
      ),
      technologies: parseJSON(
        project.technologies,
        []
      ),
    })),

    skills: skillRows.map((skill: any) => ({
      ...skill,
      visible: toBoolean(skill.visible),
      items: parseJSON(
        skill.items,
        []
      ),
    })),

    services: serviceRows.map((service: any) => ({
      ...service,
      visible: toBoolean(service.visible),
    })),

    socials: socialRows.map((social: any) => ({
      ...social,
      visible: toBoolean(social.visible),
    })),
  }
}