'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type HeroCTAProps = {
  hero?: any
}

export default function HeroCTA({
  hero,
}: HeroCTAProps) {
  const primaryRef =
    useRef<HTMLAnchorElement>(null)

  const secondaryRef =
    useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const setupMagnetic = (
      ref: React.RefObject<HTMLAnchorElement | null>
    ) => {
      if (!ref.current) return

      const domElement = ref.current

      const xTo = gsap.quickTo(
        domElement,
        'x',
        {
          duration: 0.3,
          ease: 'power2.out',
        }
      )

      const yTo = gsap.quickTo(
        domElement,
        'y',
        {
          duration: 0.3,
          ease: 'power2.out',
        }
      )

      const handleMouseMove = (
        event: MouseEvent
      ) => {
        const rect =
          domElement.getBoundingClientRect()

        const x =
          (event.clientX -
            rect.left -
            rect.width / 2) *
          0.12

        const y =
          (event.clientY -
            rect.top -
            rect.height / 2) *
          0.12

        xTo(x)
        yTo(y)
      }

      const handleMouseLeave = () => {
        gsap.to(domElement, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        })
      }

      domElement.addEventListener(
        'mousemove',
        handleMouseMove
      )

      domElement.addEventListener(
        'mouseleave',
        handleMouseLeave
      )

      return () => {
        domElement.removeEventListener(
          'mousemove',
          handleMouseMove
        )

        domElement.removeEventListener(
          'mouseleave',
          handleMouseLeave
        )
      }
    }

    const cleanup1 =
      setupMagnetic(primaryRef)

    const cleanup2 =
      setupMagnetic(secondaryRef)

    return () => {
      cleanup1?.()
      cleanup2?.()
    }
  }, [])

  const primaryText =
    typeof hero?.ctaText === 'string' &&
    hero.ctaText.trim()
      ? hero.ctaText.trim()
      : 'VIEW SELECTED WORK'

  const primaryLink =
    typeof hero?.ctaLink === 'string' &&
    hero.ctaLink.trim()
      ? hero.ctaLink.trim()
      : '#work'

  const secondaryText =
    typeof hero?.secondaryCta === 'string' &&
    hero.secondaryCta.trim()
      ? hero.secondaryCta.trim()
      : "LET'S TALK"

  const secondaryLink =
    typeof hero?.secondaryLink === 'string' &&
    hero.secondaryLink.trim()
      ? hero.secondaryLink.trim()
      : '#contact'

  return (
    <div className="mt-12 flex flex-wrap items-center gap-6">
      <a
        ref={primaryRef}
        href={primaryLink}
        className="hero-cta group relative px-8 py-4 bg-text-primary text-background text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:bg-accent hover:text-background"
      >
        <span className="relative z-10 block">
          {primaryText}
        </span>

        <span
          className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </a>

      <a
        ref={secondaryRef}
        href={secondaryLink}
        className="hero-cta group relative px-8 py-4 border border-border-default text-text-primary text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:border-accent hover:text-accent"
      >
        <span className="relative z-10 flex items-center gap-2">
          {secondaryText}

          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </a>
    </div>
  )
}