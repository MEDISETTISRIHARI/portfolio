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

  const headline = data.tagline || data.name
  const lines = headline.split('.').filter((line) => line.trim().length > 0)
  const capabilities = ['DESIGN', 'DEVELOPMENT', 'MOTION', 'EXPERIENCE']

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
      const section = sectionRef.current
      if (!section) return

      // Staggered line reveals with clip-path and blur
      const aboutLines = section.querySelectorAll('.about-hero-line')
      if (aboutLines) {
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
      }

      // Portrait reveal
      const portrait = section.querySelector('.hero-portrait')
      if (portrait) {
        gsap.fromTo(portrait,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.4, ease: 'power3.inOut', delay: 0.4 }
        )
      }

      // Supporting text reveal
      const supporting = section.querySelector('.about-supporting')
      if (supporting) {
        gsap.fromTo(
          supporting,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.8 }
        )
      }

      // Capabilities stagger
      const caps = section.querySelectorAll('.about-capability')
      if (caps) {
        gsap.fromTo(
          caps,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 1 }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView])

  return (
    <section id="about" data-scroll-section="about" className="py-24 md:py-48 relative overflow-hidden" ref={sectionRef}>
      {/* Section continuity line - animated on transition */}
      <div
        className="section-continuity-line absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent origin-left"
        style={{ transform: 'scaleX(0)', opacity: 0 }}
      />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-start">
          {/* Left column - minimal metadata + portrait */}
          <div className="md:col-span-4 relative">
            <p className="label text-text-muted mb-4" data-scroll-reveal data-scroll-parallax="0.1">01 — ABOUT</p>
            <div className="w-16 h-px bg-border-default mb-8" data-scroll-reveal />
            {data.availability && (
              <p className="body-sm text-accent mb-4" data-scroll-reveal>{data.availability}</p>
            )}

            {/* Portrait - masked reveal with editorial treatment */}
            {data.image && (
              <div className="hidden md:block mb-8" data-scroll-parallax="0.15">
                <HeroPortrait src={data.image} alt={data.name} isInView={isInView} />
              </div>
            )}

            <div className="space-y-2 mt-8 hidden md:block">
              {capabilities.map((cap, i) => (
                <p
                  key={cap}
                  className="caption text-text-muted about-capability"
                  style={{ opacity: 0 }}
                >
                  {cap}
                </p>
              ))}
            </div>
          </div>

          {/* Right column - editorial centerpiece */}
          <div className="md:col-span-8">
            {/* Hero text - visual centerpiece */}
            <div className="mb-16 md:mb-24">
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
          </div>
        </div>
      </div>
    </section>
  )
}
