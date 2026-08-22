'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Testimonial = {
  id: string
  name: string
  role?: string | null
  company?: string | null
  quote: string
  image?: string | null
  visible: boolean
  order: number
}

type TestimonialsSectionProps = {
  data: Testimonial[]
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
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
      { threshold: 0.15 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.testimonials-header')
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        )
      }

      const items = sectionRef.current?.querySelectorAll('.testimonial-item')
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        )
      }

      const dividers = sectionRef.current?.querySelectorAll('.testimonial-divider')
      if (dividers) {
        gsap.fromTo(dividers,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
        )
      }

      const quoteMarks = sectionRef.current?.querySelectorAll('.testimonial-quote-mark')
      if (quoteMarks) {
        gsap.fromTo(quoteMarks,
          { opacity: 0, scale: 0.5, y: 20 },
          { opacity: 0.15, scale: 1, y: 0, duration: 1.4, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView])

  const handleTouch = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  const handleMouseEnter = (id: string) => {
    setActiveId(id)
  }

  const handleMouseLeave = () => {
    setActiveId(null)
  }

  return (
    <section id="testimonials" data-scroll-section="testimonials" className="py-24 md:py-48 border-t border-border-subtle relative" ref={sectionRef}>
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="testimonials-header mb-16 md:mb-32">
          <p className="label text-text-muted mb-4" data-scroll-reveal>TESTIMONIALS</p>
          <h2
            className="font-display text-[clamp(2.5rem,5vw,5rem)] text-text-primary"
            style={{ lineHeight: '0.95', letterSpacing: '-0.03em' }}
            data-scroll-reveal
          >
            KIND WORDS
          </h2>
        </div>

        {/* Testimonials list - editorial stacked layout */}
        <div className="space-y-20 md:space-y-40">
          {data.map((t, i) => {
            const isActive = activeId === t.id

            return (
              <div
                key={t.id}
                className="testimonial-item group relative"
                data-scroll-reveal
                onMouseEnter={() => handleMouseEnter(t.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleTouch(t.id)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Testimonial number */}
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

                  {/* Quote content */}
                  <div className="lg:col-span-7" data-scroll-parallax="0.1">
                    <div className="relative">
                      {/* Quote mark */}
                      <span
                        className="testimonial-quote-mark absolute -top-8 -left-2 md:-left-6 font-display text-[clamp(4rem,8vw,8rem)] leading-none pointer-events-none select-none"
                        style={{
                          color: '#7dd3fc',
                          opacity: 0.15,
                          transform: isActive ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        &ldquo;
                      </span>

                      {/* Quote text */}
                      <p
                        className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] text-text-primary leading-[1.2] transition-all duration-700"
                        style={{
                          letterSpacing: '-0.02em',
                          transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                        }}
                      >
                        {t.quote}
                      </p>
                    </div>

                    {/* Author */}
                    <div className="mt-8 flex items-center gap-4">
                      <div
                        className="testimonial-divider h-px bg-accent origin-left transition-all duration-700"
                        style={{
                          width: isActive ? '48px' : '24px',
                          backgroundColor: isActive ? '#7dd3fc' : 'rgba(255, 255, 255, 0.1)',
                        }}
                      />
                      <div>
                        <p
                          className="label text-text-primary transition-all duration-500"
                          style={{
                            letterSpacing: isActive ? '0.2em' : '0.15em',
                            color: isActive ? '#F4F4F0' : '#626262',
                          }}
                        >
                          {t.name.toUpperCase()}
                        </p>
                        <p className="body-sm text-text-muted mt-1">
                          {t.role}
                          {t.role && t.company ? ', ' : ''}
                          {t.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty right column for editorial balance */}
                  <div className="lg:col-span-4 hidden lg:block" data-scroll-parallax="0.04">
                    <div
                      className="transition-all duration-700"
                      style={{
                        opacity: isActive ? 0.6 : 0.2,
                        transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                      }}
                    >
                      <p className="body-sm text-text-muted leading-relaxed">
                        {t.role && t.company ? `${t.role} at ${t.company}` : t.role || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider line between testimonials */}
                {i < data.length - 1 && (
                  <div
                    className="testimonial-divider mt-24 md:mt-32 h-px bg-gradient-to-r from-border-default via-border-default to-transparent origin-left"
                    style={{ transform: 'scaleX(1)' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
