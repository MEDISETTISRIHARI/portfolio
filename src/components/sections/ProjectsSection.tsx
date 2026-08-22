'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import ProjectVisual from './ProjectVisual'

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
  const sectionRef = useRef<HTMLElement>(null)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const magneticRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

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

  useEffect(() => {
    if (!isInView) return

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.projects-header')
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        )
      }

      const projects = sectionRef.current?.querySelectorAll('.project-item')
      if (projects) {
        gsap.fromTo(projects,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView])

  // Scroll progress for this section
  // Removed to avoid re-renders on every scroll - ProjectVisual handles its own animations

  const handleTouch = useCallback((id: string) => {
    setActiveId(activeId === id ? null : id)
  }, [activeId])

  const handleMouseEnter = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveId(null)
  }, [])

  // Magnetic button effect
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

  return (
    <section id="work" data-scroll-section="work" className="relative py-32 md:py-48 border-t border-border-subtle" ref={sectionRef}>
      {/* Section transition line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />

      <div className="container mx-auto px-6">
        {/* Section header - editorial style */}
        <div className="projects-header mb-24 md:mb-32">
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

        {/* Projects list - editorial stacked layout */}
        <div className="space-y-24 md:space-y-40">
          {data.map((project, i) => {
            const isActive = activeId === project.id
            const href = project.caseStudy || project.liveUrl || '#'

            return (
              <div
                key={project.id}
                ref={(el) => { projectRefs.current[i] = el }}
                className="project-item group relative"
                data-scroll-reveal
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Project number - large editorial */}
                  <div className="lg:col-span-1" data-scroll-parallax="0.06">
                    <div className="relative">
                      <p
                        className="font-display text-[clamp(3rem,6vw,6rem)] leading-none transition-all duration-700"
                        style={{
                          color: isActive ? '#7dd3fc' : '#2a2a2a',
                          transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <div
                        className="h-px bg-accent transition-all duration-700 mt-2"
                        style={{
                          width: isActive ? '100%' : '0%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Project info - massive typography */}
                  <div className="lg:col-span-7" data-scroll-parallax="0.1">
                    <div className="overflow-hidden mb-4">
                      <h3
                        className="font-display text-[clamp(2.5rem,5vw,5.5rem)] text-text-primary transition-all duration-700 leading-[0.9]"
                        style={{
                          letterSpacing: '-0.03em',
                          transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
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
                      {project.technologies && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-text-muted hidden md:block" />
                          <span className="body-sm text-text-muted hidden md:block">
                            {project.technologies.split(',').slice(0, 3).join(' / ')}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className="body-lg text-text-secondary max-w-xl transition-all duration-700"
                      style={{
                        opacity: isActive ? 1 : 0.5,
                        transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                      }}
                    >
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* View project - magnetic CTA */}
                  <div className="lg:col-span-4 hidden lg:flex items-start justify-end" data-scroll-parallax="0.04">
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
