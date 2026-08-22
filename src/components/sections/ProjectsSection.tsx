'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

const ABSTRACT_PALETTES: Record<string, { from: string; to: string; accent: string }> = {
  'Insurance': { from: '#0a0a0a', to: '#1a1a2e', accent: '#7dcffd' },
  'Fintech': { from: '#0a0a0a', to: '#16213e', accent: '#5b8def' },
  'Creative Agency': { from: '#0a0a0a', to: '#1a1a2e', accent: '#7dd3fc' },
  'Architecture': { from: '#0a0a0a', to: '#1a1a1a', accent: '#9ca3af' },
}

function getAbstractStyle(project: Project) {
  const palette = ABSTRACT_PALETTES[project.category] || ABSTRACT_PALETTES['Insurance']
  return palette
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section id="work" data-scroll-section="work" className="py-32 md:py-48 border-t border-border-subtle" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p className="label text-text-muted mb-4" data-scroll-reveal>SELECTED WORK</p>
            <h2 className="font-display text-display-md text-text-primary" data-scroll-reveal>PROJECTS</h2>
          </div>
          <p className="body-sm text-text-muted hidden md:block" data-scroll-reveal>
            {String(data.length).padStart(2, '0')} — {String(data.length).padStart(2, '0')}
          </p>
        </div>
        <div className="space-y-24 md:space-y-48">
          {data.map((project, i) => {
            const href = project.caseStudy || project.liveUrl || '#'
            const isHovered = hoveredId === project.id
            const palette = getAbstractStyle(project)

            return (
              <div
                key={project.id}
                className="group relative"
                data-scroll-reveal
                data-scroll-parallax="0.15"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-2">
                    <p
                      className="font-display text-display-sm transition-all duration-500"
                      style={{
                        color: isHovered ? '#7dd3fc' : '#626262',
                        transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h3
                      className="font-display text-display-md text-text-primary mb-4 transition-all duration-500"
                      style={{
                        transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="body-md text-text-secondary mb-2 transition-all duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0.7,
                        transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                      }}
                    >
                      {project.category}
                    </p>
                    <p
                      className="body-sm text-text-muted transition-all duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0.5,
                        transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                      }}
                    >
                      {project.year}
                    </p>
                  </div>
                  <div className="md:col-span-2 md:text-right">
                    <a
                      href={href}
                      className="label text-text-muted transition-all duration-500 inline-flex items-center gap-2"
                      style={{
                        color: isHovered ? '#7dd3fc' : '#626262',
                      }}
                    >
                      VIEW PROJECT
                      <svg
                        className="w-4 h-4 transition-transform duration-300"
                        style={{
                          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
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
                <div
                  className="mt-8 md:mt-12 w-full aspect-video border border-border-subtle overflow-hidden relative"
                  style={{
                    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
                      opacity: isHovered ? 0.95 : 0.6,
                    }}
                  />
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${palette.accent}15 0%, transparent 60%)`,
                      opacity: isHovered ? 1 : 0.4,
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="font-display text-display-sm tracking-tight"
                      style={{
                        color: palette.accent,
                        opacity: isHovered ? 0.9 : 0.3,
                      }}
                    >
                      {project.title}
                    </span>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 h-px transition-all duration-700"
                    style={{
                      width: isHovered ? '100%' : '0%',
                      backgroundColor: palette.accent,
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
