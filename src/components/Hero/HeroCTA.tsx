'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HeroCTA() {
  const primaryRef = useRef<HTMLAnchorElement>(null)
  const secondaryRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const setupMagnetic = (ref: React.RefObject<HTMLAnchorElement>) => {
      if (!ref.current) return

      // Store the actual DOM element reference for safe cleanup
      const domElement = ref.current

      const xTo = gsap.quickTo(domElement, 'x', {
        duration: 0.3,
        ease: 'power2.out',
      })
      const yTo = gsap.quickTo(domElement, 'y', {
        duration: 0.3,
        ease: 'power2.out',
      })

      const handleMouseMove = (e: MouseEvent) => {
        if (!domElement) return
        const rect = domElement.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12
        const y = (e.clientY - rect.top - rect.height / 2) * 0.12
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

      domElement.addEventListener('mousemove', handleMouseMove)
      domElement.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        if (domElement) {
          domElement.removeEventListener('mousemove', handleMouseMove)
          domElement.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
    }

    const cleanup1 = setupMagnetic(primaryRef)
    const cleanup2 = setupMagnetic(secondaryRef)

    return () => {
      cleanup1?.()
      cleanup2?.()
    }
  }, [])

  return (
    <div className="mt-12 flex items-center gap-6">
      <a
        ref={primaryRef}
        href="#work"
        className="group relative px-8 py-4 bg-text-primary text-background text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:bg-accent hover:text-background"
      >
        <span className="relative z-10 block">VIEW SELECTED WORK</span>
        <span
          className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </a>
      <a
        ref={secondaryRef}
        href="#contact"
        className="group relative px-8 py-4 border border-border-default text-text-primary text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:border-accent hover:text-accent"
      >
        <span className="relative z-10 flex items-center gap-2">
          LET&apos;S TALK
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