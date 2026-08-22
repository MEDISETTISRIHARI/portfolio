'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Skill = {
  id: string
  category: string
  title: string
  items: string
  order: number
  visible: boolean
}

type SkillsSectionProps = {
  data: Skill[]
}

export default function SkillsSection({ data }: SkillsSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

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
      const items = sectionRef.current?.querySelectorAll('.skill-item')
      if (items && !prefersReducedMotion) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
        )
      } else if (items && prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, prefersReducedMotion])

  const handleMouseEnter = (index: number) => {
    if (prefersReducedMotion) return
    setActiveIndex(index)
    itemRefs.current.forEach((ref, i) => {
      if (!ref) return
      const offset = i < index ? -6 : i > index ? 6 : 0
      gsap.to(ref, {
        x: offset,
        duration: 0.4,
        ease: 'power2.out',
      })
    })
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return
    setActiveIndex(null)
    itemRefs.current.forEach((ref) => {
      if (!ref) return
      gsap.to(ref, {
        x: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })
    })
  }

  const handleTouch = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section id="skills" data-scroll-section="skills" className="py-24 md:py-48 border-t border-border-subtle relative" ref={sectionRef}>
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
        <p className="label text-text-muted mb-12 md:mb-16" data-scroll-reveal>CAPABILITIES</p>
        <div className="space-y-0">
          {data.map((skill, i) => {
            const isActive = activeIndex === i
            const skillItems = skill.items.split('\n')

            return (
              <div
                key={skill.id}
                ref={(el) => { itemRefs.current[i] = el }}
                className="skill-item group relative border-t border-border-subtle transition-all duration-500"
                style={{
                  borderColor: isActive ? 'rgba(125, 211, 252, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleTouch(i)}
                data-cursor="skill"
                data-scroll-parallax="0.06"
              >
                <div className="py-6 md:py-12 grid grid-cols-12 gap-4 md:gap-8 items-center cursor-pointer">
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

                  {/* Category */}
                  <div className="col-span-10 md:col-span-4">
                    <p
                      className="label text-text-muted transition-all duration-500"
                      style={{
                        letterSpacing: isActive ? '0.25em' : '0.15em',
                        color: isActive ? '#F4F4F0' : '#626262',
                      }}
                    >
                      {skill.category}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1 transition-all duration-500"
                      style={{
                        opacity: isActive ? 0.7 : 0,
                        maxHeight: isActive ? '60px' : '0px',
                        overflow: 'hidden',
                      }}
                    >
                      {skill.title}
                    </p>
                  </div>

                  {/* Skill items - qualitative labels */}
                  <div className="col-span-12 md:col-span-6">
                    <div className="flex flex-wrap gap-2">
                      {skillItems.map((item, j) => (
                        <span
                          key={j}
                          className="text-[10px] text-text-muted/60 border border-border-subtle px-3 py-1.5 uppercase tracking-widest transition-all duration-500"
                          style={{
                            opacity: isActive ? 0.8 : 0.3,
                            borderColor: isActive ? 'rgba(125,211,252,0.15)' : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="hidden md:flex col-span-12 md:col-span-12 justify-end">
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
