'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Service = {
  id: string
  title: string
  desc: string
  order: number
  visible: boolean
}

type ServicesSectionProps = {
  data: Service[]
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
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
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  useEffect(() => {
    if (!isInView) return

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.services-header')
      if (header && !prefersReducedMotion) {
        gsap.fromTo(header,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        )
      } else if (header && prefersReducedMotion) {
        gsap.set(header, { opacity: 1, y: 0 })
      }

      const items = sectionRef.current?.querySelectorAll('.service-item')
      if (items && !prefersReducedMotion) {
        gsap.fromTo(items,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
        )
      } else if (items && prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, prefersReducedMotion])

  return (
    <section id="services" data-scroll-section="services" className="py-24 md:py-48 border-t border-border-subtle relative" ref={sectionRef}>
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />
      
      {/* Background depth - subtle grain */}
      <div data-depth="background" className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      <div className="container mx-auto px-6">
        <div className="services-header mb-16 md:mb-24">
          <p className="label text-text-muted mb-4" data-scroll-reveal>SERVICES</p>
          <h2
            className="font-display text-[clamp(2.5rem,5vw,5rem)] text-text-primary"
            style={{ lineHeight: '0.95', letterSpacing: '-0.03em' }}
            data-scroll-reveal
          >
            WHAT I DO
          </h2>
        </div>

        {/* Editorial stacked list */}
        <div className="space-y-0">
          {data.map((service, i) => {
            const isActive = activeIndex === i

            return (
              <div
                key={service.id}
                className="service-item group relative border-t border-border-subtle transition-all duration-500 cursor-pointer"
                style={{
                  borderColor: isActive ? 'rgba(125, 211, 252, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                data-cursor="skill"
              >
                <div className="py-8 md:py-12 grid grid-cols-12 gap-4 md:gap-8 items-center">
                  {/* Index */}
                  <div className="col-span-2 md:col-span-1">
                    <span
                      className="font-display text-display-sm transition-all duration-500 block"
                      style={{
                        color: isActive ? '#7dd3fc' : '#626262',
                        transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Animated divider */}
                  <div className="hidden md:block col-span-1">
                    <div
                      className="h-px transition-all duration-500 origin-left"
                      style={{
                        width: isActive ? '40px' : '0px',
                        backgroundColor: '#7dd3fc',
                      }}
                    />
                  </div>

                  {/* Title + Description */}
                  <div className="col-span-10 md:col-span-7">
                    <p
                      className="label text-text-muted transition-all duration-500 mb-2"
                      style={{
                        letterSpacing: isActive ? '0.25em' : '0.15em',
                        color: isActive ? '#F4F4F0' : '#626262',
                      }}
                    >
                      {service.title.toUpperCase()}
                    </p>
                    <p className="text-body-sm text-text-secondary transition-all duration-500"
                      style={{
                        opacity: isActive ? 0.8 : 0.4,
                      }}
                    >
                      {service.desc}
                    </p>
                  </div>

                  {/* Expand indicator */}
                  <div className="hidden md:flex col-span-3 justify-end">
                    <span
                      className="text-xs text-text-muted transition-all duration-300"
                      style={{
                        opacity: isActive ? 0 : 0.5,
                        transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                      }}
                    >
                      {isActive ? '—' : '+'}
                    </span>
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
