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
        <p className="text-[clamp(0.7rem,1.2vw,0.8rem)] text-text-muted/60 mb-6 md:mb-8 tracking-[0.3em] uppercase hero-role font-medium" style={{ letterSpacing: '0.3em' }}>
          {role}
        </p>
      )}
      <div className="hero-title-wrapper overflow-hidden">
        <h1
          ref={titleRef}
          className="font-display text-[clamp(3rem,7vw,8.5rem)] text-text-primary hero-title-line leading-[0.88] tracking-[-0.045em]"
          style={{ lineHeight: '0.88', letterSpacing: '-0.045em' }}
        >
          {headline.split(' ').map((word, i) => (
            <span key={i} className="hero-word inline-block" style={{ marginRight: '0.15em' }}>
              {word}
            </span>
          ))}
        </h1>
      </div>
      {subtitleLines.map((line, i) => (
        <div key={i} className="hero-title-wrapper overflow-hidden">
          <h2
            ref={i === 0 ? subtitleRef : undefined}
            className="font-display text-[clamp(2.5rem,6vw,7.5rem)] text-text-primary/90 hero-title-line leading-[0.9] tracking-[-0.035em]"
            style={{ lineHeight: '0.9', letterSpacing: '-0.035em' }}
          >
            {line.split(' ').map((word, j) => (
              <span key={j} className="hero-word inline-block" style={{ marginRight: '0.15em' }}>
                {word}
              </span>
            ))}
          </h2>
        </div>
      ))}
    </>
  )
}
