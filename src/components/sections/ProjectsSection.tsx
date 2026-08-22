'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import ProjectVisual from './ProjectVisual'
import ProjectProgress from './ProjectProgress'
import { useScroll } from '@/hooks/useScroll'

type Project = {
  id: string
  title: string
  slug: string
  category: string
  year: string
  shortDesc: string
  fullDesc?: string | null
  thumbnail: string
  heroImage?: string | null
  gallery?: string | null
  video?: string | null
  technologies: string
  liveUrl?: string | null
  caseStudy?: string | null
  featured: boolean
  published: boolean
  order: number
}

type ProjectsSectionProps = {
  data: Project[]
}

function ProjectCTA({ href, isActive, magneticRef }: { href: string; isActive: boolean; magneticRef: (el: HTMLAnchorElement | null) => void }) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const el = linkRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15
      gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' })
    }

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <a
      ref={(el) => {
        linkRef.current = el
        magneticRef(el)
      }}
      href={href}
      className="group/project-cta relative inline-flex items-center gap-3 text-sm font-medium tracking-wide text-text-primary hover:text-accent transition-colors duration-500"
      style={{ willChange: 'transform' }}
    >
      <span className="relative">
        <span className="relative z-10">EXPLORE PROJECT</span>
        <span className="absolute bottom-0 left-0 h-px bg-accent origin-left transition-all duration-500 group-hover/project-cta:scale-x-100"
          style={{ width: '100%', transform: 'scaleX(0)' }}
        />
      </span>
      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover/project-cta:translate-x-1"
        style={{ transform: isActive ? 'translateX(4px)' : 'translateX(0)' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  )
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const projectRefs = useRef<Array<HTMLDivElement | null>>([])
  const magneticRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const { scrollY, progress } = useScroll()
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Track which project is most visible
  useEffect(() => {
    if (!isInView || !sectionRef.current) return

    const observers: IntersectionObserver[] = []

    projectRefs.current.forEach((ref, index) => {
      if (!ref) return

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveProjectIndex(index)
            }
          })
        },
        { threshold: [0.3, 0.5, 0.7], rootMargin: '-20% 0px -20% 0px' }
      )

      obs.observe(ref)
      observers.push(obs)
    })

    return () => {
      observers.forEach(obs => obs.disconnect())
    }
  }, [isInView])

  // Choreographed reveal animation when section enters viewport
  useEffect(() => {
    if (!isInView) return

    const ctx = gsap.context(() => {
      // Header reveal
      const header = sectionRef.current?.querySelector('.projects-header')
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        )
      }

      // Each project reveals with staggered timing
      data.forEach((_, i) => {
        const projectEl = projectRefs.current[i]
        if (!projectEl) return

        const numberEl = projectEl.querySelector('.project-number')
        const dividerEl = projectEl.querySelector('.project-divider')
        const titleEl = projectEl.querySelector('.project-title')
        const categoryEl = projectEl.querySelector('.project-category')
        const descEl = projectEl.querySelector('.project-description')
        const visualEl = projectEl.querySelector('.project-visual-container')
        const metaEl = projectEl.querySelector('.project-meta')
        const ctaEl = projectEl.querySelector('.project-cta')

        const delay = prefersReducedMotion ? 0 : 0.3 + i * 0.15

        // 1. Number appears
        if (numberEl && !prefersReducedMotion) {
          gsap.fromTo(numberEl,
            { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
            { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out', delay }
          )
        }

        // 2. Divider draws
        if (dividerEl && !prefersReducedMotion) {
          gsap.fromTo(dividerEl,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', delay: delay + 0.2 }
          )
        }

        // 3. Title reveals
        if (titleEl && !prefersReducedMotion) {
          gsap.fromTo(titleEl,
            { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' },
            { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', delay: delay + 0.3 }
          )
        }

        // 3b. Category reveals
        if (categoryEl && !prefersReducedMotion) {
          gsap.fromTo(categoryEl,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: delay + 0.4 }
          )
        }

        // 4. Visual reveals through mask
        if (visualEl && !prefersReducedMotion) {
          gsap.fromTo(visualEl,
            { opacity: 0, scale: 0.98, clipPath: 'inset(0 0 10% 0)' },
            { opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.out', delay: delay + 0.4 }
          )
        }

        // 5. Description appears
        if (descEl && !prefersReducedMotion) {
          gsap.fromTo(descEl,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: delay + 0.6 }
          )
        }

        // 6. Metadata settles
        if (metaEl && !prefersReducedMotion) {
          gsap.fromTo(metaEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: delay + 0.7 }
          )
        }

        // 7. CTA appears
        if (ctaEl && !prefersReducedMotion) {
          gsap.fromTo(ctaEl,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: delay + 0.8 }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, data.length, prefersReducedMotion])

  // Track scroll velocity for physical scroll response
  useEffect(() => {
    if (prefersReducedMotion) return

    let lastY = scrollY
    let raf: number

    const updateVelocity = () => {
      const delta = scrollY - lastY
      const velocity = Math.abs(delta)
      setScrollVelocity(velocity)
      lastY = scrollY
      raf = requestAnimationFrame(updateVelocity)
    }

    raf = requestAnimationFrame(updateVelocity)
    return () => cancelAnimationFrame(raf)
  }, [scrollY, prefersReducedMotion])

  const handleTouch = useCallback((id: string) => {
    setActiveId(activeId === id ? null : id)
  }, [activeId])

  const handleMouseEnter = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveId(null)
  }, [])

  // Scroll velocity effect on projects
  const getVelocityStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) return {}
    if (scrollVelocity > 30) return { transform: 'translateX(2px) skewX(1deg)' }
    if (scrollVelocity > 15) return { transform: 'translateX(1px) skewX(0.5deg)' }
    return {}
  }

  return (
    <section id="work" data-scroll-section="work" className="relative py-24 md:py-48 border-t border-border-subtle" ref={sectionRef}>
      {/* Section transition line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />

      {/* Background depth - subtle grain */}
      <div data-depth="background" className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Project progress indicator */}
      <ProjectProgress current={activeProjectIndex + 1} total={data.length} />

      <div className="container mx-auto px-6">
        {/* Section header - editorial style */}
        <div className="projects-header mb-16 md:mb-32">
          <div className="flex items-end justify-between">
            <div>
              <p className="label text-text-muted mb-4" data-scroll-reveal>SELECTED WORK</p>
              <h2
                className="font-display text-[clamp(2.5rem,5vw,5rem)] text-text-primary"
                style={{ lineHeight: '0.95', letterSpacing: '-0.03em' }}
                data-scroll-reveal
              >
                PROJECTS
              </h2>
            </div>
            <p className="body-sm text-text-muted hidden md:block" data-scroll-reveal>
              {String(data.length).padStart(2, '0')} PROJECTS
            </p>
          </div>
        </div>

        {/* Projects list - cinematic editorial stacked layout */}
        <div className="space-y-24 md:space-y-40">
          {data.map((project, i) => {
            const isActive = activeId === project.id
            const href = project.caseStudy || project.liveUrl || '#'
            const techList = project.technologies.split(',').slice(0, 4)
            const isLast = i === data.length - 1

            return (
              <div
                key={project.id}
                ref={(el) => { projectRefs.current[i] = el }}
                className="project-item group relative"
                data-scroll-reveal
                style={getVelocityStyle()}
              >
                {/* Connecting element between projects */}
                {!isLast && (
                  <div className="absolute -bottom-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent opacity-0 transition-opacity duration-1000"
                    style={{ opacity: isActive ? 0.5 : 0 }}
                  />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
                  {/* Project number - large editorial */}
                  <div className="lg:col-span-1 order-1" data-scroll-parallax="0.06">
                    <div className="relative">
                      <p
                        className="project-number font-display text-[clamp(2.5rem,5vw,5rem)] md:text-[clamp(3rem,6vw,6rem)] leading-none transition-all duration-700"
                        style={{
                          color: isActive ? '#7dd3fc' : '#2a2a2a',
                          transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <div
                        className="project-divider h-px bg-accent transition-all duration-700 mt-2 origin-left"
                        style={{
                          width: isActive ? '100%' : '0%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Title + Category (before visual on mobile) */}
                  <div className="lg:col-span-6 order-2" data-scroll-parallax="0.1">
                    <div className="overflow-hidden mb-3 md:mb-4">
                      <h3
                        className="project-title font-display text-[clamp(2rem,5vw,4.5rem)] md:text-[clamp(2.5rem,5vw,5.5rem)] text-text-primary transition-all duration-700 leading-[0.9]"
                        style={{
                          letterSpacing: '-0.03em',
                          transform: isActive ? 'translateX(10px)' : 'translateX(0)',
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>

                    {/* Category + Year */}
                    <div className="project-category flex flex-wrap items-center gap-3 md:gap-4 md:gap-6 mb-4 md:mb-6">
                      <span
                        className="label transition-all duration-500"
                        style={{
                          color: isActive ? '#7dd3fc' : '#626262',
                          letterSpacing: isActive ? '0.2em' : '0.15em',
                        }}
                      >
                        {project.category.toUpperCase()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span className="body-sm text-text-muted">{project.year}</span>
                    </div>
                  </div>

                  {/* Project visual - between title/category and description on mobile */}
                  <div className="order-3 lg:order-3 lg:col-span-5">
                    <div
                      className="project-visual-container w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative"
                      data-scroll-parallax="0.2"
                      style={{
                        transform: isActive ? 'scale(1.003)' : 'scale(1)',
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'transform',
                      }}
                      onClick={() => handleTouch(project.id)}
                      onMouseEnter={() => handleMouseEnter(project.id)}
                      onMouseLeave={handleMouseLeave}
                      data-cursor="project"
                    >
                      <ProjectVisual
                        category={project.category}
                        title={project.title}
                        isActive={isActive}
                      />
                    </div>

                    {/* Mobile metadata below visual */}
                    <div className="lg:hidden mt-4 flex items-center gap-4">
                      <span className="label text-text-muted" style={{ letterSpacing: '0.15em' }}>
                        {project.category.toUpperCase()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span className="body-sm text-text-muted">{project.year}</span>
                    </div>
                  </div>

                  {/* Description + Tech + CTA (after visual on mobile) */}
                  <div className="lg:col-span-6 lg:col-start-1 order-4" data-scroll-parallax="0.05">
                    <p
                      className="project-description body-lg text-text-secondary max-w-xl transition-all duration-700 mb-4 md:mb-6"
                      style={{
                        opacity: isActive ? 1 : 0.5,
                        transform: isActive ? 'translateY(0)' : 'translateY(6px)',
                      }}
                    >
                      {project.shortDesc}
                    </p>

                    {/* Technology / capability indicators */}
                    <div className="hidden md:flex flex-wrap gap-2 mb-6">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-text-muted/60 border border-border-subtle px-3 py-1.5 uppercase tracking-widest transition-all duration-500"
                          style={{
                            opacity: isActive ? 0.8 : 0.3,
                            borderColor: isActive ? 'rgba(125,211,252,0.15)' : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="project-cta">
                      <ProjectCTA href={href} isActive={isActive} magneticRef={(el) => {
                        if (el) magneticRefs.current.set(project.id, el)
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
