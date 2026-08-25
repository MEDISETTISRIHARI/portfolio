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

function parseJson(value: any, fallback: any = []) {
  if (value === null || value === undefined || value === '') {
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
      WHERE published = 1
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
      WHERE visible = 1
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
      WHERE visible = 1
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
      WHERE visible = 1
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
      WHERE visible = 1
      ORDER BY "order" ASC, createdAt ASC
    `),
  ])

  const profileData = profile[0] || null
  const heroData = hero[0] || null

  return {
    profile: profileData,

    hero: heroData,

    projects: projects.map((project: any) => ({
      ...project,
      featured: Boolean(project.featured),
      published: Boolean(project.published),
      gallery: parseJson(project.gallery, []),
      technologies: parseJson(project.technologies, []),
    })),

    skills: skills.map((skill: any) => ({
      ...skill,
      visible: Boolean(skill.visible),
      items: parseJson(skill.items, []),
    })),

    services: services.map((service: any) => ({
      ...service,
      visible: Boolean(service.visible),
    })),

    testimonials: testimonials.map((testimonial: any) => ({
      ...testimonial,
      visible: Boolean(testimonial.visible),
    })),

    socials: socials.map((social: any) => ({
      ...social,
      visible: Boolean(social.visible),
    })),
  }
}
