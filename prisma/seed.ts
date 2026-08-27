import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Admin
  await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: '$2a$10$rQ7H8pZ8X8Q7H8pZ8X8QOeK8pZ8X8Q7H8pZ8X8Q7H8pZ8X8Q7H8pZ',
    },
  })

  // Profile
  await prisma.profile.upsert({
    where: { id: 'profile-main' },
    update: {},
    create: {
      id: 'profile-main',
      name: 'Alex Varma',
      role: 'Creative Web Designer & Developer',
      tagline: 'I DESIGN DIGITAL EXPERIENCES THAT PEOPLE REMEMBER.',
      bio: 'I create high-quality websites, interfaces and interactive digital experiences where design, technology and motion work together.',
      email: 'hello@example.com',
      location: 'Remote',
      image: '/images/srihari-profile.jpg',
    },
  })

  // Hero
  await prisma.hero.upsert({
    where: { id: 'hero-main' },
    update: {},
    create: {
      id: 'hero-main',
      headline: 'DIGITAL EXPERIENCES',
      subtitle: 'SRIHARI',
      description: 'I design and build premium digital experiences that merge cinematic storytelling with cutting-edge technology.',
      ctaText: 'VIEW WORK',
      ctaLink: '#work',
      secondaryCta: 'GET IN TOUCH',
      secondaryLink: '#contact',
    },
  })

  // Skills
  const skills = [
    { category: 'DESIGN', title: 'Design', items: 'UI / UX\nVisual Design\nDesign Systems\nResponsive Design' },
    { category: 'DEVELOPMENT', title: 'Development', items: 'HTML\nCSS\nJavaScript\nReact\nTypeScript\nNext.js' },
    { category: 'MOTION', title: 'Motion', items: 'GSAP\nScroll Animation\nInteraction Design\nMicro-interactions' },
    { category: 'EXPERIENCE', title: 'Experience', items: 'Creative Development\nPerformance Optimization\nDeployment' },
  ]

  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({
      data: {
        category: skills[i].category,
        title: skills[i].title,
        items: skills[i].items,
        order: i,
      },
    })
  }

  // Services
  const services = [
    { title: 'Web Design', desc: 'Premium, cinematic websites with exceptional typography, layout, and visual hierarchy.' },
    { title: 'Creative Development', desc: 'Interactive experiences built with modern frameworks, smooth animations, and performant code.' },
    { title: 'Motion Design', desc: 'Scroll-driven animations, transitions, and micro-interactions that feel natural and intentional.' },
    { title: '3D / WebGL', desc: 'Immersive 3D environments and shader-based visual effects using Three.js and React Three Fiber.' },
  ]

  for (let i = 0; i < services.length; i++) {
    await prisma.service.create({
      data: {
        title: services[i].title,
        desc: services[i].desc,
        order: i,
      },
    })
  }

  // Projects
  const projects = [
    {
      title: 'NOVA INSURANCE',
      slug: 'nova-insurance',
      category: 'Insurance / Digital Platform',
      year: '2024',
      shortDesc: 'A premium digital platform reimagining the insurance experience through cinematic design and seamless interactions.',
      fullDesc: 'NOVA INSURANCE required a complete digital transformation. The goal was to create a platform that felt trustworthy, modern, and effortless. Every interaction was designed to reduce friction and build confidence.',
      thumbnail: '/assets/images/nova-thumb.jpg',
      heroImage: '/assets/images/nova-hero.jpg',
      technologies: 'Next.js, GSAP, Tailwind CSS, Prisma',
      liveUrl: 'https://demo-nova.vercel.app',
      caseStudy: '/projects/nova-insurance',
      featured: true,
      order: 0,
    },
    {
      title: 'AETHER FINANCE',
      slug: 'aether-finance',
      category: 'Fintech / Dashboard',
      year: '2024',
      shortDesc: 'An elegant fintech dashboard blending complex data visualization with refined minimalist aesthetics.',
      fullDesc: 'AETHER FINANCE needed a dashboard that made complex financial data feel approachable. The design focuses on clarity, precision, and subtle depth through layered surfaces and restrained typography.',
      thumbnail: '/assets/images/aether-thumb.jpg',
      heroImage: '/assets/images/aether-hero.jpg',
      technologies: 'React, D3.js, TypeScript, Framer Motion',
      liveUrl: 'https://demo-aether.vercel.app',
      caseStudy: '/projects/aether-finance',
      featured: true,
      order: 1,
    },
    {
      title: 'LUMINA STUDIOS',
      slug: 'lumina-studios',
      category: 'Creative Agency',
      year: '2023',
      shortDesc: 'A bold, immersive portfolio experience for a creative studio specializing in film and digital art.',
      fullDesc: 'LUMINA STUDIOS wanted a website that felt like stepping into their creative universe. The result is a scroll-driven narrative with cinematic transitions, 3D elements, and editorial typography.',
      thumbnail: '/assets/images/lumina-thumb.jpg',
      heroImage: '/assets/images/lumina-hero.jpg',
      technologies: 'Next.js, Three.js, GSAP, Tailwind CSS',
      liveUrl: 'https://demo-lumina.vercel.app',
      caseStudy: '/projects/lumina-studios',
      featured: true,
      order: 2,
    },
    {
      title: 'TERRA ARCHITECTS',
      slug: 'terra-architects',
      category: 'Architecture',
      year: '2023',
      shortDesc: 'A refined digital presence for an architecture firm, emphasizing space, light, and material.',
      fullDesc: 'TERRA ARCHITECTS needed a website that reflected their philosophy of space and light. The design uses generous whitespace, high-resolution imagery, and subtle motion to create a sense of calm sophistication.',
      thumbnail: '/assets/images/terra-thumb.jpg',
      heroImage: '/assets/images/terra-hero.jpg',
      technologies: 'Next.js, Framer Motion, Tailwind CSS',
      liveUrl: 'https://demo-terra.vercel.app',
      caseStudy: '/projects/terra-architects',
      featured: false,
      order: 3,
    },
  ]

  for (const p of projects) {
    await prisma.project.create({ data: p })
  }

  // Testimonials
  const testimonials = [
    { name: 'Sarah Chen', role: 'CEO', company: 'Nova Insurance', quote: 'The attention to detail is extraordinary. Every pixel, every transition, every micro-interaction feels intentional and premium.', visible: true, order: 0 },
    { name: 'Marcus Webb', role: 'CTO', company: 'Aether Finance', quote: 'Not just beautiful — deeply functional. The performance is outstanding and the animations never feel like filler.', visible: true, order: 1 },
    { name: 'Elena Rossi', role: 'Creative Director', company: 'Lumina Studios', quote: 'They understood our vision immediately and elevated it beyond what we imagined. A true creative partner.', visible: true, order: 2 },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }

  // Social Links
  const socials = [
    { platform: 'Instagram', username: '@demo.creator', url: 'https://instagram.com/demo.creator', icon: 'Instagram', visible: true, order: 0 },
    { platform: 'GitHub', username: '@demo.developer', url: 'https://github.com/demo.developer', icon: 'Github', visible: true, order: 1 },
    { platform: 'LinkedIn', username: '@demo.designer', url: 'https://linkedin.com/in/demo.designer', icon: 'Linkedin', visible: true, order: 2 },
    { platform: 'Email', username: 'hello@example.com', url: 'mailto:hello@example.com', icon: 'Mail', visible: true, order: 3 },
  ]

  for (const s of socials) {
    await prisma.socialLink.create({ data: s })
  }

  // Site Settings
  const settings = [
    { key: 'site_name', value: 'SRIHARI' },
    { key: 'site_description', value: 'Creative Web Designer & Developer' },
    { key: 'maintenance_mode', value: 'false' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
