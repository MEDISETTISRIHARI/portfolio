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
  const subtitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const ctx = gsap.context(() => {
      // Word-level animation with clip-path reveal
      const words = titleRef.current?.querySelectorAll('.hero-word')
      if (words) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 50,
            clipPath: 'inset(0 0 100% 0)',
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.3,
          }
        )
      }

      // Subtitle line reveal with depth
      const subtitleWords = subtitleRef.current?.querySelectorAll('.hero-word')
      if (subtitleWords) {
        gsap.fromTo(
          subtitleWords,
          {
            opacity: 0,
            y: 30,
            filter: 'blur(3px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.04,
            ease: 'power2.out',
            delay: 0.6,
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
            ref={subtitleRef}
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
