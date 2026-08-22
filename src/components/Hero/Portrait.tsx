'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type PortraitProps = {
  src?: string | null
  alt?: string
  isInView?: boolean
  mousePos?: { x: number; y: number }
  isMobile?: boolean
}

export default function Portrait({ src, alt = 'Portrait', isInView = false, mousePos = { x: 0, y: 0 }, isMobile = false }: PortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const floatRef = useRef({ x: 0, y: 0, rotY: 0, rotX: 0 })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isInView || !isClient) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.2 })

      // Container cinematic reveal
      tl.fromTo(containerRef.current,
        { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0, scale: 1.08, y: 50, rotateY: 8, filter: 'blur(12px)' },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, y: 0, rotateY: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.inOut' }
      )

      // Frame reveal
      if (frameRef.current) {
        tl.fromTo(frameRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=1.2'
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isInView, isClient])

  // Continuous subtle floating animation
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return

    const animate = () => {
      const t = Date.now() * 0.001
      floatRef.current.x = Math.sin(t * 0.5) * 3
      floatRef.current.y = Math.cos(t * 0.4) * 2
      floatRef.current.rotY = Math.sin(t * 0.3) * 1.5
      floatRef.current.rotX = Math.cos(t * 0.35) * 0.8

      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${floatRef.current.x}px, ${floatRef.current.y}px) rotateY(${floatRef.current.rotY}deg) rotateX(${floatRef.current.rotX}deg)`
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isClient])

  // Pointer/touch influence
  useEffect(() => {
    if (!isClient || isMobile || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10
      const y = (e.clientY / window.innerHeight - 0.5) * 5
      floatRef.current.x += x * 0.3
      floatRef.current.y += y * 0.2
      floatRef.current.rotY += x * 0.2
      floatRef.current.rotX += y * 0.1
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isClient, isMobile])

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Placeholder or real image
  const imageSrc = src || '/images/srihari.jpg'
  const isPlaceholder = !src

  return (
    <div
      ref={containerRef}
      className="hero-portrait relative"
      style={{
        opacity: 0,
        transform: 'translate(0, 0) rotateY(0deg) rotateX(0deg)',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
    >
      {/* Depth shadow / glow behind portrait */}
      <div
        className="absolute -inset-4 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        style={{ opacity: isInView ? 0.5 : 0 }}
      />

      {/* Main image container with asymmetric cinematic mask */}
      <div
        ref={imageRef}
        className="relative overflow-hidden"
        style={{
          width: 'min(82vw, 320px)',
          aspectRatio: '3/4',
          clipPath: 'inset(0% 0% 0% 0%)',
          transform: 'scale(1)',
          filter: 'grayscale(100%) contrast(1.1) brightness(0.9)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
        }}
      >
        {/* Mobile-first responsive image */}
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            display: 'block',
          }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />

        {/* Placeholder gradient when image missing or fails to load */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-surface via-background to-surface pointer-events-none"
          style={{
            opacity: isPlaceholder ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />

        {/* Top gradient fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 60%, rgba(5,5,5,0.4) 100%)',
          }}
        />
      </div>

      {/* Editorial frame */}
      <div
        ref={frameRef}
        className="absolute -inset-3 border border-border-subtle pointer-events-none"
        style={{
          transform: 'scale(0.95)',
          opacity: 0,
          clipPath: 'inset(0 0 0 0)',
        }}
      />

      {/* Corner accent marks */}
      <div
        className="absolute -top-1 -left-1 w-6 h-6 pointer-events-none"
        style={{
          borderTop: '1px solid rgba(125, 211, 252, 0.3)',
          borderLeft: '1px solid rgba(125, 211, 252, 0.3)',
        }}
      />
      <div
        className="absolute -bottom-1 -right-1 w-6 h-6 pointer-events-none"
        style={{
          borderBottom: '1px solid rgba(125, 211, 252, 0.3)',
          borderRight: '1px solid rgba(125, 211, 252, 0.3)',
        }}
      />

      {/* Floating label */}
      <div
        className="absolute -bottom-8 left-0 caption text-text-muted pointer-events-none"
        style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.8s ease 0.8s' }}
      >
        CREATIVE DEVELOPER
      </div>
    </div>
  )
}
