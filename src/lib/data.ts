export async function getHero() {
  const res = await fetch('/api/hero', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch hero')
  return res.json()
}

export async function getProfile() {
  const res = await fetch('/api/profile', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function getProjects() {
  const res = await fetch('/api/projects', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function getSkills() {
  const res = await fetch('/api/skills', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch skills')
  return res.json()
}

export async function getServices() {
  const res = await fetch('/api/services', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch services')
  return res.json()
}

export async function getTestimonials() {
  const res = await fetch('/api/testimonials', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch testimonials')
  return res.json()
}

export async function getSocials() {
  const res = await fetch('/api/socials', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch socials')
  return res.json()
}
