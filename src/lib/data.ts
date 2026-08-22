const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const FALLBACK_HERO = {
  headline: 'SRIHARI',
  subtitle: 'DIGITAL\nEXPERIENCES',
  description: 'I design and build premium digital experiences where design, technology and motion work together.',
  visualMode: '3d',
  ctaText: 'VIEW SELECTED WORK',
  ctaLink: '#work',
  secondaryCta: "LET'S TALK",
  secondaryLink: '#contact',
}

const FALLBACK_PROFILE = {
  id: 'profile-1',
  name: 'SRIHARI',
  role: 'Digital Creative Developer',
  tagline: 'I DESIGN. I BUILD. I EXPERIMENT.',
  bio: 'I am a digital creative developer specializing in premium web experiences. I combine design sensibility with technical precision to create award-winning digital products.',
  location: 'India',
  email: 'hello@srihari.dev',
  availability: 'Available for select projects',
}

const FALLBACK_PROJECTS = [
  {
    id: '1',
    title: 'NOVA INSURANCE',
    slug: 'nova-insurance',
    category: 'Insurance / Digital Platform',
    year: '2024',
    shortDesc: 'A complete digital platform for Nova Insurance.',
    fullDesc: 'Full-scale digital platform redesign.',
    thumbnail: '',
    heroImage: null,
    gallery: null,
    video: null,
    technologies: 'Next.js, Three.js, GSAP',
    liveUrl: '#',
    caseStudy: null,
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: '2',
    title: 'AETHER FINANCE',
    slug: 'aether-finance',
    category: 'Fintech / Dashboard',
    year: '2024',
    shortDesc: 'Real-time financial dashboard with data visualization.',
    fullDesc: 'High-performance fintech dashboard.',
    thumbnail: '',
    heroImage: null,
    gallery: null,
    video: null,
    technologies: 'React, D3.js, WebSocket',
    liveUrl: '#',
    caseStudy: null,
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: '3',
    title: 'LUMINA STUDIOS',
    slug: 'lumina-studios',
    category: 'Creative Agency',
    year: '2023',
    shortDesc: 'Brand experience for a creative studio.',
    fullDesc: 'Immersive brand experience.',
    thumbnail: '',
    heroImage: null,
    gallery: null,
    video: null,
    technologies: 'Three.js, React, Framer Motion',
    liveUrl: '#',
    caseStudy: null,
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: '4',
    title: 'TERRA ARCHITECTS',
    slug: 'terra-architects',
    category: 'Architecture',
    year: '2023',
    shortDesc: 'Portfolio platform for an architecture firm.',
    fullDesc: 'Minimal architectural portfolio.',
    thumbnail: '',
    heroImage: null,
    gallery: null,
    video: null,
    technologies: 'Next.js, GSAP, Prismic',
    liveUrl: '#',
    caseStudy: null,
    featured: true,
    published: true,
    order: 4,
  },
]

const FALLBACK_SKILLS = [
  { id: '1', category: 'DESIGN', title: 'Design', items: 'UI/UX\nBrand Identity\nMotion Design\n3D Visualization', order: 1, visible: true },
  { id: '2', category: 'DEVELOPMENT', title: 'Development', items: 'React\nNext.js\nThree.js\nNode.js', order: 2, visible: true },
  { id: '3', category: 'MOTION', title: 'Motion', items: 'GSAP\nFramer Motion\nCinematic Animation\nScroll Interactions', order: 3, visible: true },
  { id: '4', category: 'EXPERIENCE', title: 'Experience', items: 'WebGL\nInteractive Design\nCreative Direction\nPrototyping', order: 4, visible: true },
]

const FALLBACK_SERVICES = [
  { id: '1', title: 'Web Design', desc: 'Premium website design with cinematic motion and editorial typography.', order: 1, visible: true },
  { id: '2', title: 'Development', desc: 'High-performance React/Next.js applications with Three.js integration.', order: 2, visible: true },
  { id: '3', title: 'Motion', desc: 'Scroll-driven animations, microinteractions, and immersive transitions.', order: 3, visible: true },
  { id: '4', title: '3D / WebGL', desc: 'Interactive Three.js scenes, shaders, and real-time 3D experiences.', order: 4, visible: true },
]

const FALLBACK_TESTIMONIALS = [
  { id: '1', name: 'Alex Varma', role: 'CEO, Nova Tech', company: 'Nova Insurance', quote: 'Srihari delivered a world-class digital experience that exceeded our expectations.', image: null, visible: true, order: 1 },
  { id: '2', name: 'Priya Sharma', role: 'CTO', company: 'Aether Finance', quote: 'The attention to detail and technical excellence is unmatched.', image: null, visible: true, order: 2 },
  { id: '3', name: 'Rahul Menon', role: 'Creative Director', company: 'Lumina Studios', quote: 'A rare combination of design taste and engineering skill.', image: null, visible: true, order: 3 },
]

const FALLBACK_SOCIALS = [
  { id: '1', platform: 'GitHub', username: 'srihari', url: 'https://github.com', icon: null, visible: true, order: 1 },
  { id: '2', platform: 'LinkedIn', username: 'srihari', url: 'https://linkedin.com', icon: null, visible: true, order: 2 },
  { id: '3', platform: 'Twitter', username: 'srihari', url: 'https://twitter.com', icon: null, visible: true, order: 3 },
]

async function fetchWithFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${baseUrl}${url}`, { cache: 'no-store' })
    if (!res.ok) return fallback
    const data = await res.json()
    return data || fallback
  } catch {
    return fallback
  }
}

export async function getHero() {
  return fetchWithFallback('/api/hero', FALLBACK_HERO)
}

export async function getProfile() {
  return fetchWithFallback('/api/profile', FALLBACK_PROFILE)
}

export async function getProjects() {
  return fetchWithFallback('/api/projects', FALLBACK_PROJECTS)
}

export async function getSkills() {
  return fetchWithFallback('/api/skills', FALLBACK_SKILLS)
}

export async function getServices() {
  return fetchWithFallback('/api/services', FALLBACK_SERVICES)
}

export async function getTestimonials() {
  return fetchWithFallback('/api/testimonials', FALLBACK_TESTIMONIALS)
}

export async function getSocials() {
  return fetchWithFallback('/api/socials', FALLBACK_SOCIALS)
}