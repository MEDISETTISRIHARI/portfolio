'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

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

const ABSTRACT_PALETTES: Record<string, { from: string; to: string; accent: string; shape: string }> = {
  'Insurance': { from: '#0a0a0a', to: '#1a1a2e', accent: '#7dcffd', shape: 'radial' },
  'Fintech': { from: '#0a0a0a', to: '#16213e', accent: '#5b8def', shape: 'linear' },
  'Creative Agency': { from: '#0a0a0a', to: '#1a1a2e', accent: '#7dd3fc', shape: 'conic' },
  'Architecture': { from: '#0a0a0a', to: '#1a1a1a', accent: '#9ca3af', shape: 'grid' },
}

function getAbstractVisual(project: Project) {
  const palette = ABSTRACT_PALETTES[project.category] || ABSTRACT_PALETTES['Insurance']
  return palette
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])

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
      const projects = sectionRef.current?.querySelectorAll('.project-item')
      if (projects) {
        gsap.fromTo(
          projects,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView])

  const handleTouch = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <section id="work" data-scroll-section="work" className="py-32 md:py-48 border-t border-border-subtle" ref={sectionRef}>
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p className="label text-text-muted mb-4" data-scroll-reveal>SELECTED WORK</p>
            <h2 className="font-display text-display-md text-text-primary" data-scroll-reveal>PROJECTS</h2>
          </div>
          <p className="body-sm text-text-muted hidden md:block" data-scroll-reveal>
            {String(data.length).padStart(2, '0')} — {String(data.length).padStart(2, '0')}
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-32 md:space-y-48">
          {data.map((project, i) => {
            const isActive = activeId === project.id
            const palette = getAbstractVisual(project)
            const href = project.caseStudy || project.liveUrl || '#'

            return (
              <div
                key={project.id}
                ref={(el) => { projectRefs.current[i] = el }}
                className="project-item group relative"
                data-scroll-reveal
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                  {/* Project number */}
                  <div className="md:col-span-1" data-scroll-parallax="0.08">
                    <p
                      className="font-display text-display-sm transition-all duration-500"
                      style={{
                        color: isActive ? '#7dd3fc' : '#626262',
                        transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>

                  {/* Project info */}
                  <div className="md:col-span-7" data-scroll-parallax="0.12">
                    <h3
                      className="font-display text-[clamp(2rem,4vw,4rem)] text-text-primary mb-4 transition-all duration-500 leading-[0.95]"
                      style={{
                        letterSpacing: '-0.03em',
                        transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                      }}
                    >
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-6 mb-4">
                      <p
                        className="body-md text-text-secondary transition-all duration-500"
                        style={{
                          opacity: isActive ? 1 : 0.6,
                          transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                        }}
                      >
                        {project.category}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <p
                        className="body-sm text-text-muted transition-all duration-500"
                        style={{
                          opacity: isActive ? 1 : 0.5,
                        }}
                      >
                        {project.year}
                      </p>
                    </div>
                    <p
                      className="body-sm text-text-muted max-w-lg transition-all duration-500"
                      style={{
                        opacity: isActive ? 1 : 0.4,
                        transform: isActive ? 'translateY(0)' : 'translateY(6px)',
                      }}
                    >
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* View project link */}
                  <div className="md:col-span-4 md:text-right hidden md:block" data-scroll-parallax="0.06">
                    <a
                      href={href}
                      className="label text-text-muted transition-all duration-500 inline-flex items-center gap-2 group/link"
                      style={{
                        color: isActive ? '#7dd3fc' : '#626262',
                      }}
                    >
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
                    </a>
                  </div>
                </div>

                {/* Abstract project visual */}
                <div
                  className="mt-8 md:mt-12 w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative cursor-pointer"
                  data-scroll-parallax="0.25"
                  style={{
                    transform: isActive ? 'scale(1.01) perspective(1000px) rotateX(1deg)' : 'scale(1) perspective(1000px) rotateX(0deg)',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onClick={() => handleTouch(project.id)}
                  onMouseEnter={() => setActiveId(project.id)}
                  onMouseLeave={() => setActiveId(null)}
                  data-cursor="project"
                >
                  {/* Base gradient */}
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
                      opacity: isActive ? 0.95 : 0.6,
                    }}
                  />

                  {/* Abstract shape based on category */}
                  {palette.shape === 'radial' && (
                    <div
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${palette.accent}20 0%, transparent 60%)`,
                        opacity: isActive ? 1 : 0.4,
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  )}
                  {palette.shape === 'linear' && (
                    <div
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        background: `linear-gradient(45deg, transparent 40%, ${palette.accent}15 50%, transparent 60%)`,
                        opacity: isActive ? 1 : 0.4,
                        transform: isActive ? 'translateX(10%)' : 'translateX(0)',
                      }}
                    />
                  )}
                  {palette.shape === 'conic' && (
                    <div
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        background: `conic-gradient(from 45deg at 50% 50%, transparent 0deg, ${palette.accent}10 90deg, transparent 180deg)`,
                        opacity: isActive ? 1 : 0.3,
                        transform: isActive ? 'rotate(45deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                      }}
                    />
                  )}
                  {palette.shape === 'grid' && (
                    <div
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        backgroundImage: `linear-gradient(${palette.accent}08 1px, transparent 1px), linear-gradient(90deg, ${palette.accent}08 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        opacity: isActive ? 1 : 0.3,
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  )}

                  {/* Accent glow */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, ${palette.accent}20 0%, transparent 70%)`,
                      opacity: isActive ? 0.8 : 0.2,
                      transform: `translate(-50%, -50%) scale(${isActive ? 2 : 1})`,
                    }}
                  />

                  {/* Project title overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="font-display text-[clamp(1.5rem,3vw,3rem)] tracking-tight"
                      style={{
                        color: palette.accent,
                        opacity: isActive ? 0.9 : 0.2,
                      }}
                    >
                      {project.title}
                    </span>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-px transition-all duration-700"
                    style={{
                      width: isActive ? '100%' : '0%',
                      backgroundColor: palette.accent,
                    }}
                  />

                  {/* Top right corner accent */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16 transition-all duration-700"
                    style={{
                      opacity: isActive ? 0.3 : 0,
                      background: `linear-gradient(135deg, transparent 50%, ${palette.accent}20 50%)`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
