'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type HeroPortraitProps = {
  src?: string | null
  alt?: string
  isInView?: boolean
}

export default function HeroPortrait({ src, alt = 'Portrait', isInView = false }: HeroPortraitProps) {
  const portraitRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!portraitRef.current || !isInView) return

    const ctx = gsap.context(() => {
      // Masked reveal choreography
      const tl = gsap.timeline({ delay: 0.8 })

      // Image container reveal
      tl.fromTo(portraitRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.4, ease: 'power3.inOut' }
      )

      // Image scale choreography
      if (imageRef.current) {
        tl.fromTo(imageRef.current,
          { scale: 1.2, filter: 'blur(4px) grayscale(100%)' },
          { scale: 1, filter: 'blur(0px) grayscale(100%)', duration: 1.8, ease: 'power2.out' },
          '-=1.2'
        )
      }

      // Subtle border frame reveal
      const frame = portraitRef.current?.querySelector('.portrait-frame')
      if (frame) {
        tl.fromTo(frame,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=1'
        )
      }
    }, portraitRef)

    return () => ctx.revert()
  }, [isInView])

  // Placeholder when no image is provided
  const placeholderSrc = src || '/portrait-placeholder.jpg'

  return (
    <div
      ref={portraitRef}
      className="hero-portrait relative overflow-hidden"
      style={{
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
      }}
    >
      {/* Depth layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 z-10 pointer-events-none" />

      {/* Main image */}
      <div
        ref={imageRef}
        className="portrait-image absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${placeholderSrc})`,
          filter: 'grayscale(100%) contrast(1.1) brightness(0.9)',
          transform: 'scale(1)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Editorial frame */}
      <div
        className="portrait-frame absolute inset-4 border border-border-subtle pointer-events-none z-20 origin-left"
        style={{ transform: 'scaleX(0)', opacity: 0 }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-px bg-accent/30 z-20 pointer-events-none origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Corner mark */}
      <div
        className="absolute top-6 right-6 z-20 pointer-events-none"
        style={{
          width: '24px',
          height: '24px',
          borderTop: '1px solid rgba(125, 211, 252, 0.3)',
          borderRight: '1px solid rgba(125, 211, 252, 0.3)',
        }}
      />

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}
