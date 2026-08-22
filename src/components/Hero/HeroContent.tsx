'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type HeroContentProps = {
  headline: string
  subtitle: string
  mousePos?: { x: number; y: number }
}

type WordStyle = {
  weight: number
  opacity: number
  translateX: string
  translateY: string
  color: string
  letterSpacing: string
}

const getWordStyle = (index: number, total: number, mouseX: number): WordStyle => {
  const normalizedMouse = (mouseX + 1) / 2

  const baseWeight = 600
  const lightWeight = 300
  const mediumWeight = 400

  let weight = baseWeight
  let opacity = 1
  let translateX = '0px'
  let translateY = '0px'
  let color = '#F4F4F0'
  let letterSpacing = '-0.02em'

  if (total <= 2) {
    if (index === 0) weight = lightWeight
    if (index === total - 1) weight = baseWeight
  } else if (total === 3) {
    if (index === 0) { weight = lightWeight; opacity = 0.7; letterSpacing = '0.15em' }
    if (index === 1) { weight = baseWeight; color = '#7dd3fc'; letterSpacing = '-0.04em' }
    if (index === 2) { weight = mediumWeight; opacity = 0.85 }
  } else if (total === 4) {
    if (index === 0) { weight = lightWeight; opacity = 0.7; letterSpacing = '0.1em' }
    if (index === 1) { weight = baseWeight; color = '#F4F4F0' }
    if (index === 2) { weight = baseWeight; color = '#7dd3fc'; letterSpacing = '-0.04em' }
    if (index === 3) { weight = mediumWeight; opacity = 0.85 }
  } else {
    if (index % 5 === 0) { weight = lightWeight; opacity = 0.7; letterSpacing = '0.05em' }
    else if (index % 5 === 1) { weight = baseWeight; color = '#F4F4F0' }
    else if (index % 5 === 2) { weight = baseWeight; color = '#7dd3fc'; letterSpacing = '-0.04em' }
    else if (index % 5 === 3) { weight = mediumWeight; opacity = 0.85 }
    else { weight = lightWeight; opacity = 0.75 }
  }

  const subtleOffset = (normalizedMouse - 0.5) * 4
  translateX = `${subtleOffset * (index % 2 === 0 ? 1 : -1)}px`
  translateY = `${subtleOffset * 0.5 * (index % 3 === 0 ? 1 : -1)}px`

  return { weight, opacity, translateX, translateY, color, letterSpacing }
}

export default function HeroContent({ headline, subtitle, mousePos = { x: 0, y: 0 } }: HeroContentProps) {
  const subtitleLines = subtitle.split('\n')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!titleRef.current) return

    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll('.hero-word')
      if (words) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 80,
            clipPath: 'inset(0 0 100% 0)',
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.6,
          }
        )
      }

      const subtitleWords = subtitleRef.current?.querySelectorAll('.hero-word')
      if (subtitleWords) {
        gsap.fromTo(
          subtitleWords,
          {
            opacity: 0,
            y: 50,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.06,
            ease: 'power2.out',
            delay: 0.9,
          }
        )
      }
    }, titleRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const words = wordsRef.current
    if (!words.length) return

    const subtleX = mousePos.x * 6
    const subtleY = mousePos.y * 3

    words.forEach((word, i) => {
      if (!word) return
      const factor = 1 - (i % 3) * 0.2
      const x = subtleX * factor
      const y = subtleY * factor
      gsap.to(word, {
        x,
        y,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }, [mousePos])

  const headlineWords = headline.split(' ')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  return (
    <>
      <div className="hero-title-wrapper overflow-hidden">
        <h1
          ref={titleRef}
          className="font-display text-[clamp(3.5rem,8vw,10rem)] text-text-primary hero-title-line leading-[0.82] tracking-[-0.05em]"
          style={{ lineHeight: '0.82', letterSpacing: '-0.05em' }}
        >
          {headlineWords.map((word, i) => {
            const style = getWordStyle(i, headlineWords.length, mousePos.x)
            return (
              <span
                key={i}
                ref={(el) => { wordsRef.current[i] = el }}
                className="hero-word inline-block"
                style={{
                  marginRight: '0.14em',
                  fontWeight: style.weight,
                  opacity: style.opacity,
                  transform: `translate3d(${style.translateX}, ${style.translateY}, 0)`,
                  color: style.color,
                  letterSpacing: style.letterSpacing,
                  willChange: 'transform, opacity',
                  transition: 'color 0.6s ease',
                }}
              >
                {word}
              </span>
            )
          })}
        </h1>
      </div>
      {subtitleLines.map((line, i) => (
        <div key={i} className="hero-title-wrapper overflow-hidden">
          <h2
            ref={i === 0 ? subtitleRef : undefined}
            className="font-display text-[clamp(2rem,5.5vw,7.5rem)] text-text-primary/80 hero-title-line leading-[0.88] tracking-[-0.04em]"
            style={{ lineHeight: '0.88', letterSpacing: '-0.04em' }}
          >
            {line.split(' ').map((word, j) => (
              <span
                key={j}
                className="hero-word inline-block"
                style={{
                  marginRight: '0.12em',
                  fontWeight: j % 2 === 0 ? 300 : 500,
                  opacity: 0.8,
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
