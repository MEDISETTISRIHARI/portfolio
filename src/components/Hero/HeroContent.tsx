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
            y: 60,
            clipPath: 'inset(0 0 100% 0)',
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.4,
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
            y: 40,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.05,
            ease: 'power2.out',
            delay: 0.7,
          }
        )
      }
    }, titleRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {role && (
        <p className="text-[clamp(0.65rem,1vw,0.75rem)] text-text-muted/50 mb-6 md:mb-8 tracking-[0.35em] uppercase hero-role font-light" style={{ letterSpacing: '0.35em' }}>
          {role}
        </p>
      )}
      <div className="hero-title-wrapper overflow-hidden">
        <h1
          ref={titleRef}
          className="font-display text-[clamp(3.2rem,7.5vw,9rem)] text-text-primary hero-title-line leading-[0.85] tracking-[-0.05em]"
          style={{ lineHeight: '0.85', letterSpacing: '-0.05em' }}
        >
          {headline.split(' ').map((word, i) => (
            <span
              key={i}
              className="hero-word inline-block"
              style={{
                marginRight: '0.12em',
                fontWeight: i % 3 === 0 ? 300 : 600,
                transform: `translateX(${i % 5 === 0 ? '-4px' : i % 5 === 2 ? '4px' : '0'})`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>
      </div>
      {subtitleLines.map((line, i) => (
        <div key={i} className="hero-title-wrapper overflow-hidden">
          <h2
            ref={i === 0 ? subtitleRef : undefined}
            className="font-display text-[clamp(2.2rem,5.5vw,7rem)] text-text-primary/85 hero-title-line leading-[0.9] tracking-[-0.04em]"
            style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
          >
            {line.split(' ').map((word, j) => (
              <span
                key={j}
                className="hero-word inline-block"
                style={{
                  marginRight: '0.12em',
                  fontWeight: j % 2 === 0 ? 300 : 500,
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      ))}
    </>
  )
}
