'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type PageTransitionProps = {
  children: React.ReactNode
  className?: string
  variant?: 'fade' | 'slide' | 'scale' | 'blur'
}

export default function PageTransition({ children, className, variant = 'blur' }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      switch (variant) {
        case 'fade':
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
          )
          break
        case 'slide':
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
          )
          break
        case 'scale':
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
          )
          break
        case 'blur':
        default:
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 40, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }
          )
          break
      }
    }, containerRef)

    return () => ctx.revert()
  }, [variant])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
