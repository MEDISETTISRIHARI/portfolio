'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type HeroContentProps = {
  headline: string
  subtitle: string
  role?: string
}

export default function HeroContent({ headline, subtitle, role }: HeroContentProps) {
  const subtitleLines = subtitle.split('\n')
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll('.hero-word')
      if (words) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 40,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.3,
          }
        )
      }
    }, titleRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {role && (
        <p className="text-[clamp(0.75rem,2.5vw,0.875rem)] text-text-muted/70 mb-8 tracking-[0.25em] uppercase hero-role font-medium" style={{ letterSpacing: '0.25em' }}>
          {role}
        </p>
      )}
      <div className="hero-title-wrapper overflow-hidden">
        <h1
          ref={titleRef}
          className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-[0.9] tracking-[-0.04em]"
          style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
        >
          {headline.split(' ').map((word, i) => (
            <span key={i} className="hero-word inline-block" style={{ marginRight: '0.2em' }}>
              {word}
            </span>
          ))}
        </h1>
      </div>
      {subtitleLines.map((line, i) => (
        <div key={i} className="hero-title-wrapper overflow-hidden">
          <h2
            className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-[0.9] tracking-[-0.04em]"
            style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
          >
            {line.split(' ').map((word, j) => (
              <span key={j} className="hero-word inline-block" style={{ marginRight: '0.2em' }}>
                {word}
              </span>
            ))}
          </h2>
        </div>
      ))}
    </>
  )
}
