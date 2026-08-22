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

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const magneticRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const { scrollY, progress } = useScroll()

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
        const descEl = projectEl.querySelector('.project-description')
        const visualEl = projectEl.querySelector('.project-visual-container')
        const metaEl = projectEl.querySelector('.project-meta')

        const tl = gsap.timeline({ delay: 0.3 + i * 0.15 })

        // 1. Number appears
        if (numberEl) {
          tl.fromTo(numberEl,
            { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
            { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out' },
            0
          )
        }

        // 2. Divider draws
        if (dividerEl) {
          tl.fromTo(dividerEl,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
            0.2
          )
        }

        // 3. Title reveals
        if (titleEl) {
          tl.fromTo(titleEl,
            { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' },
            { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out' },
            0.3
          )
        }

        // 4. Description appears
        if (descEl) {
          tl.fromTo(descEl,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            0.5
          )
        }

        // 5. Visual reveals through mask
        if (visualEl) {
          tl.fromTo(visualEl,
            { opacity: 0, scale: 0.98, clipPath: 'inset(0 0 10% 0)' },
            { opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.out' },
            0.4
          )
        }

        // 6. Metadata settles
        if (metaEl) {
          tl.fromTo(metaEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            0.7
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, data.length])

  // Track scroll velocity for physical scroll response
  useEffect(() => {
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
  }, [scrollY])

  const handleTouch = useCallback((id: string) => {
    setActiveId(activeId === id ? null : id)
  }, [activeId])

  const handleMouseEnter = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveId(null)
  }, [])

  // GSAP hover experience
  useEffect(() => {
    const refs = magneticRefs.current
    if (!refs.size) return

    const cleanups: (() => void)[] = []

    refs.forEach((domElement) => {
      const xTo = gsap.quickTo(domElement, 'x', { duration: 0.4, ease: 'power2.out' })
      const yTo = gsap.quickTo(domElement, 'y', { duration: 0.4, ease: 'power2.out' })

      const handleMouseMove = (e: MouseEvent) => {
        const rect = domElement.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * 0.2
        const y = (e.clientY - rect.top - rect.height / 2) * 0.2
        xTo(x)
        yTo(y)
      }

      const handleMouseLeave = () => {
        gsap.to(domElement, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      }

      domElement.addEventListener('mousemove', handleMouseMove)
      domElement.addEventListener('mouseleave', handleMouseLeave)

      cleanups.push(() => {
        domElement.removeEventListener('mousemove', handleMouseMove)
        domElement.removeEventListener('mouseleave', handleMouseLeave)
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [activeId])

  // Scroll velocity effect on projects
  const getVelocityStyle = (): React.CSSProperties => {
    if (scrollVelocity > 30) return { transform: 'translateX(2px) skewX(1deg)' }
    if (scrollVelocity > 15) return { transform: 'translateX(1px) skewX(0.5deg)' }
    return {}
  }

  return (
    <section id="work" data-scroll-section="work" className="relative py-24 md:py-48 border-t border-border-subtle" ref={sectionRef}>
      {/* Section transition line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />

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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                  {/* Project number - large editorial */}
                  <div className="lg:col-span-1" data-scroll-parallax="0.06">
                    <div className="relative">
                      <p
                        className="project-number font-display text-[clamp(3rem,6vw,6rem)] leading-none transition-all duration-700"
                        style={{
                          color: isActive ? '#7dd3fc' : '#2a2a2a',
                          transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
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

                  {/* Project info - massive typography */}
                  <div className="lg:col-span-6" data-scroll-parallax="0.1">
                    <div className="overflow-hidden mb-4">
                      <h3
                        className="project-title font-display text-[clamp(2.5rem,5vw,5.5rem)] text-text-primary transition-all duration-700 leading-[0.9]"
                        style={{
                          letterSpacing: '-0.03em',
                          transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>

                    {/* Metadata row */}
                    <div className="project-meta flex flex-wrap items-center gap-4 md:gap-6 mb-6">
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

                    {/* Description */}
                    <p
                      className="project-description body-lg text-text-secondary max-w-xl transition-all duration-700 mb-6"
                      style={{
                        opacity: isActive ? 1 : 0.5,
                        transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                      }}
                    >
                      {project.shortDesc}
                    </p>

                    {/* Technology / capability indicators */}
                    <div className="flex flex-wrap gap-2">
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
                  </div>

                  {/* View project - magnetic CTA */}
                  <div className="lg:col-span-5 hidden lg:flex items-start justify-end" data-scroll-parallax="0.04">
                    <a
                      ref={(el) => {
                        if (el) magneticRefs.current.set(project.id, el)
                      }}
                      href={href}
                      className="group/link relative px-8 py-4 border border-border-default text-text-primary text-sm font-medium tracking-wide overflow-hidden transition-all duration-500 hover:border-accent hover:text-accent"
                      style={{
                        borderRadius: '2px',
                        borderColor: isActive ? 'rgba(125, 211, 252, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        VIEW PROJECT
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                          style={{
                            transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>

                {/* Project visual - large editorial area */}
                <div
                  className="project-visual-container mt-10 md:mt-14 w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative cursor-pointer"
                  data-scroll-parallax="0.2"
                  style={{
                    transform: isActive ? 'scale(1.005)' : 'scale(1)',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
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

                  {/* Mobile CTA */}
                  <div className="lg:hidden absolute bottom-6 right-6">
                    <a
                      href={href}
                      className="px-6 py-3 bg-text-primary text-background text-xs font-medium tracking-wide hover:bg-accent transition-colors duration-300"
                      style={{ borderRadius: '2px' }}
                    >
                      VIEW PROJECT
                    </a>
                  </div>
                </div>

                {/* Mobile metadata */}
                <div className="lg:hidden mt-6 flex items-center gap-4">
                  <span className="label text-text-muted" style={{ letterSpacing: '0.15em' }}>
                    {project.category.toUpperCase()}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span className="body-sm text-text-muted">{project.year}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
