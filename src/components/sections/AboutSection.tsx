'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import HeroPortrait from '@/components/HeroPortrait'

type Profile = {
  id: string
  name: string
  role: string
  tagline?: string | null
  bio: string
  location?: string | null
  email: string
  availability?: string | null
  image?: string | null
}

type AboutSectionProps = {
  data: Profile
}

export default function AboutSection({ data }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const headline = data.tagline || data.name
  const lines = headline.split('.').filter((line) => line.trim().length > 0)
  
  const capabilities = [
    {
      id: '01',
      category: 'DESIGN',
      statement: 'Interfaces, visual systems, interaction and art direction',
      items: ['UI/UX Design', 'Brand Identity', 'Motion Design', '3D Visualization', 'Art Direction']
    },
    {
      id: '02', 
      category: 'DEVELOPMENT',
      statement: 'React, TypeScript, creative development and performance',
      items: ['React / Next.js', 'TypeScript', 'Three.js / WebGL', 'Node.js', 'Performance']
    },
    {
      id: '03',
      category: 'MOTION',
      statement: 'GSAP, interaction, scroll systems and cinematic transitions',
      items: ['GSAP', 'Framer Motion', 'Scroll Interactions', 'Cinematic Animation', 'Micro-interactions']
    },
    {
      id: '04',
      category: 'EXPERIENCE',
      statement: 'Digital products, storytelling and immersive interfaces',
      items: ['WebGL', 'Interactive Design', 'Creative Direction', 'Prototyping', 'Storytelling']
    }
  ]

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
      const section = sectionRef.current
      if (!section) return

      const aboutLines = section.querySelectorAll('.about-hero-line')
      if (aboutLines && !prefersReducedMotion) {
        gsap.fromTo(
          aboutLines,
          {
            opacity: 0,
            y: 80,
            clipPath: 'inset(0 0 100% 0)',
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
          }
        )
      } else if (aboutLines && prefersReducedMotion) {
        gsap.set(aboutLines, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)' })
      }

      const portraitSignature = section.querySelector('.about-portrait-signature')
      if (portraitSignature && !prefersReducedMotion) {
        gsap.fromTo(portraitSignature,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0, scale: 0.95 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, scale: 1, duration: 1.4, ease: 'power3.inOut', delay: 0.4 }
        )
      } else if (portraitSignature && prefersReducedMotion) {
        gsap.set(portraitSignature, { clipPath: 'inset(0 0% 0 0)', opacity: 1, scale: 1 })
      }

      const portraitFrame = section.querySelector('.about-portrait-frame')
      if (portraitFrame && !prefersReducedMotion) {
        gsap.fromTo(portraitFrame,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.3, duration: 1.2, ease: 'power3.out', delay: 0.6 }
        )
      } else if (portraitFrame && prefersReducedMotion) {
        gsap.set(portraitFrame, { scaleX: 1, opacity: 0.3 })
      }

      const supporting = section.querySelector('.about-supporting')
      if (supporting && !prefersReducedMotion) {
        gsap.fromTo(
          supporting,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.8 }
        )
      } else if (supporting && prefersReducedMotion) {
        gsap.set(supporting, { opacity: 1, y: 0 })
      }

      const caps = section.querySelectorAll('.about-capability')
      if (caps && !prefersReducedMotion) {
        gsap.fromTo(
          caps,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 1 }
        )
      } else if (caps && prefersReducedMotion) {
        gsap.set(caps, { opacity: 1, x: 0 })
      }

      const capItems = section.querySelectorAll('.capability-item')
      if (capItems && !prefersReducedMotion) {
        gsap.fromTo(
          capItems,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 1.2 }
        )
      } else if (capItems && prefersReducedMotion) {
        gsap.set(capItems, { opacity: 1, y: 0 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, prefersReducedMotion])

  return (
    <section id="about" data-scroll-section="about" className="py-24 md:py-48 relative overflow-hidden" ref={sectionRef}>
      {/* Section continuity line - animated on transition */}
      <div
        className="section-continuity-line absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent origin-left"
        style={{ transform: 'scaleX(0)', opacity: 0 }}
      />
      
      {/* Background depth - atmospheric grain */}
      <div data-depth="background" className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-start">
          {/* Left column - portrait signature + metadata */}
          <div className="md:col-span-4 relative">
            {/* Portrait signature - visual echo of hero */}
            <div className="relative mb-8 md:mb-12">
              {data.image && (
                <div className="about-portrait-signature relative" data-scroll-parallax="0.1">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden"
                    style={{
                      clipPath: 'inset(0 0 0 0)',
                      filter: 'grayscale(100%) contrast(1.1) brightness(0.9)',
                    }}
                  >
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-full object-cover"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  {/* Corner accent frame */}
                  <div className="about-portrait-frame absolute -inset-2 border border-accent/20 pointer-events-none origin-left"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </div>
              )}
              
              {/* Visual signature - abstract portrait shadow */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 md:w-24 md:h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none"
                style={{ opacity: isInView ? 0.6 : 0 }}
              />
            </div>

            <p className="label text-text-muted mb-4" data-scroll-reveal data-scroll-parallax="0.1">01 — ABOUT</p>
            <div className="w-16 h-px bg-border-default mb-8" data-scroll-reveal />
            {data.availability && (
              <p className="body-sm text-accent mb-4" data-scroll-reveal>{data.availability}</p>
            )}

            <div className="space-y-2 mt-8 hidden md:block">
              {capabilities.map((cap, i) => (
                <p
                  key={cap.id}
                  className="caption text-text-muted about-capability"
                  style={{ opacity: 0 }}
                >
                  {cap.category}
                </p>
              ))}
            </div>
          </div>

          {/* Right column - editorial centerpiece */}
          <div className="md:col-span-8">
            {/* Hero text - visual centerpiece */}
            <div className="mb-16 md:mb-24" data-scroll-reveal>
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="overflow-hidden mb-1 md:mb-2"
                  onMouseEnter={() => setHoveredLine(i)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  <span
                    className="about-hero-line font-display text-[clamp(2.5rem,6vw,6rem)] md:text-[clamp(3rem,7vw,7rem)] text-text-primary inline-block transition-all duration-500"
                    style={{
                      lineHeight: '0.9',
                      letterSpacing: '-0.04em',
                      transform: hoveredLine === i ? 'translateX(12px)' : 'translateX(0)',
                      color: hoveredLine === i ? '#7dd3fc' : '#F4F4F0',
                    }}
                    data-scroll-parallax="0.08"
                  >
                    {line.trim()}
                    {i < lines.length - 1 && <span className="text-accent">.</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Supporting text - appears later */}
            <div className="max-w-2xl about-supporting" style={{ opacity: 0 }}>
              <div className="w-24 h-px bg-border-default mb-8" data-scroll-reveal />
              <p className="body-lg text-text-secondary" style={{ lineHeight: '1.6' }}>
                {data.bio}
              </p>
            </div>

            {/* Editorial capabilities - stacked list */}
            <div className="mt-16 md:mt-24 space-y-0">
              {capabilities.map((cap, i) => (
                <div
                  key={cap.id}
                  className="capability-item group relative border-t border-border-subtle py-6 md:py-8 cursor-pointer"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                    {/* Number */}
                    <div className="col-span-1 md:col-span-1">
                      <span
                        className="font-display text-display-sm transition-all duration-500 block"
                        style={{
                          color: '#626262',
                          transform: 'translateX(0)',
                        }}
                      >
                        {cap.id}
                      </span>
                    </div>

                    {/* Category + Statement */}
                    <div className="col-span-11 md:col-span-4">
                      <p
                        className="label text-text-muted transition-all duration-500 mb-2"
                        style={{
                          letterSpacing: '0.15em',
                          color: '#626262',
                        }}
                      >
                        {cap.category}
                      </p>
                      <p className="text-body-sm text-text-secondary transition-all duration-500"
                        style={{
                          opacity: 0.6,
                        }}
                      >
                        {cap.statement}
                      </p>
                    </div>

                    {/* Skill details */}
                    <div className="col-span-12 md:col-span-6 mt-4 md:mt-0">
                      <div className="flex flex-wrap gap-2">
                        {cap.items.map((item, j) => (
                          <span
                            key={j}
                            className="text-[10px] text-text-muted/50 border border-border-subtle px-3 py-1.5 uppercase tracking-widest transition-all duration-500"
                            style={{
                              opacity: 0.4,
                              borderColor: 'rgba(255,255,255,0.06)',
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
