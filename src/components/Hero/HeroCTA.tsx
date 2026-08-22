'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type HeroCTAProps = {
  primaryText: string
  primaryHref: string
  secondaryText: string
  secondaryHref: string
}

export default function HeroCTA({ primaryText, primaryHref, secondaryText, secondaryHref }: HeroCTAProps) {
  const primaryRef = useRef<HTMLAnchorElement>(null)
  const secondaryRef = useRef<HTMLAnchorElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    const setupMagnetic = (ref: React.RefObject<HTMLAnchorElement>, strength: number) => {
      if (!ref.current) return

      const domElement = ref.current

      const xTo = gsap.quickTo(domElement, 'x', {
        duration: 0.4,
        ease: 'power2.out',
      })
      const yTo = gsap.quickTo(domElement, 'y', {
        duration: 0.4,
        ease: 'power2.out',
      })

      const handleMouseMove = (e: MouseEvent) => {
        if (!domElement) return
        const rect = domElement.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * strength
        const y = (e.clientY - rect.top - rect.height / 2) * strength
        xTo(x)
        yTo(y)

        gsap.to(domElement, {
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      const handleMouseLeave = () => {
        gsap.to(domElement, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        })
      }

      domElement.addEventListener('mousemove', handleMouseMove)
      domElement.addEventListener('mouseleave', handleMouseLeave)

      const handleTouchStart = () => {
        gsap.to(domElement, {
          scale: 0.97,
          duration: 0.15,
          ease: 'power2.out',
        })
      }

      const handleTouchEnd = () => {
        gsap.to(domElement, {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.4)',
        })
      }

      if (isMobile) {
        domElement.addEventListener('touchstart', handleTouchStart, { passive: true })
        domElement.addEventListener('touchend', handleTouchEnd)
      }

      return () => {
        if (domElement) {
          domElement.removeEventListener('mousemove', handleMouseMove)
          domElement.removeEventListener('mouseleave', handleMouseLeave)
          if (isMobile) {
            domElement.removeEventListener('touchstart', handleTouchStart)
            domElement.removeEventListener('touchend', handleTouchEnd)
          }
        }
      }
    }

    const cleanup1 = setupMagnetic(primaryRef, 0.15)
    const cleanup2 = setupMagnetic(secondaryRef, 0.1)

    return () => {
      cleanup1?.()
      cleanup2?.()
    }
  }, [isMobile])

  return (
    <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 hero-cta">
      <a
        ref={primaryRef}
        href={primaryHref}
        className="group relative px-7 py-3.5 bg-text-primary text-background text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(125,211,252,0.15)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto text-center"
        style={{ borderRadius: '2px' }}
      >
        <span className="relative z-10 block">{primaryText}</span>
        <span
          className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, transparent 50%)',
            backgroundSize: '200% 100%',
            transform: 'translateX(-100%)',
          }}
        />
      </a>
      <a
        ref={secondaryRef}
        href={secondaryHref}
        className="group relative px-7 py-3.5 border border-border-default text-text-primary text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto text-center"
        style={{ borderRadius: '2px' }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
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
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(125,211,252,0.08) 45%, transparent 50%)',
            backgroundSize: '200% 100%',
            transform: 'translateX(-100%)',
          }}
        />
      </a>
    </div>
  )
}
