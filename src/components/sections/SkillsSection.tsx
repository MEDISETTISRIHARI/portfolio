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
    if (!isInView) return

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('.skill-item')
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView])

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index)
    // Slightly shift surrounding items
    itemRefs.current.forEach((ref, i) => {
      if (!ref) return
      const offset = i < index ? -8 : i > index ? 8 : 0
      gsap.to(ref, {
        x: offset,
        duration: 0.4,
        ease: 'power2.out',
      })
    })
  }

  const handleMouseLeave = () => {
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

                  {/* Title */}
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
                  </div>

                  {/* Skill list */}
                  <div className="col-span-12 md:col-span-6">
                    <ul
                      className="space-y-1 overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: isActive ? '300px' : '0px',
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      {skillItems.map((item, j) => (
                        <li
                          key={j}
                          className="text-body text-text-primary transition-all duration-300"
                          style={{
                            transform: isActive ? 'translateX(0)' : 'translateX(-12px)',
                            opacity: isActive ? 1 : 0,
                            transitionDelay: isActive ? `${j * 0.05}s` : '0s',
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
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
