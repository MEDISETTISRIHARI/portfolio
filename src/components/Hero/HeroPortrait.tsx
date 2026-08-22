'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type HeroPortraitProps = {
  src?: string | null
  alt?: string
  isInView?: boolean
  mousePos?: { x: number; y: number }
  touchVelocity?: { x: number; y: number }
  isMobile?: boolean
  scrollProgress?: number
}

type TransformState = {
  x: number
  y: number
  rotY: number
  rotX: number
  scale: number
}

const LERP_SPEED = 0.08
const MAX_ROTATION = 8
const MAX_TRANSLATION = 12
const MAX_SCALE = 1.05
const MIN_SCALE = 0.95

export default function HeroPortrait({
  src,
  alt = 'Portrait',
  isInView = false,
  mousePos = { x: 0, y: 0 },
  touchVelocity = { x: 0, y: 0 },
  isMobile = false,
  scrollProgress = 0,
}: HeroPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const grainRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const target = useRef<TransformState>({ x: 0, y: 0, rotY: 0, rotX: 0, scale: 1 })
  const current = useRef<TransformState>({ x: 0, y: 0, rotY: 0, rotX: 0, scale: 1 })
  const lastTime = useRef(Date.now())

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Smooth interpolation animation loop
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return

    const animate = () => {
      const now = Date.now()
      const dt = Math.max(1, now - lastTime.current)
      lastTime.current = now

      // Lerp current toward target
      current.current.x += (target.current.x - current.current.x) * LERP_SPEED
      current.current.y += (target.current.y - current.current.y) * LERP_SPEED
      current.current.rotY += (target.current.rotY - current.current.rotY) * LERP_SPEED
      current.current.rotX += (target.current.rotX - current.current.rotX) * LERP_SPEED
      current.current.scale += (target.current.scale - current.current.scale) * LERP_SPEED

      const { x, y, rotY, rotX, scale } = current.current

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`
      }

      // Move light reflection
      if (lightRef.current) {
        const lightX = 50 + (x / MAX_TRANSLATION) * 30
        const lightY = 50 + (y / MAX_TRANSLATION) * 30
        lightRef.current.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isClient, prefersReducedMotion])

  // Mouse movement
  useEffect(() => {
    if (!isClient || isMobile || prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = -(e.clientY / window.innerHeight - 0.5) * 2

      target.current.x = x * MAX_TRANSLATION
      target.current.y = y * MAX_TRANSLATION
      target.current.rotY = x * MAX_ROTATION
      target.current.rotX = y * MAX_ROTATION * 0.6
      target.current.scale = 1 + Math.abs(x) * 0.02 + Math.abs(y) * 0.02
    }

    const handleMouseLeave = () => {
      target.current = { x: 0, y: 0, rotY: 0, rotX: 0, scale: 1 }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isClient, isMobile, prefersReducedMotion])

  // Touch influence
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return

    const influenceX = Math.max(-MAX_TRANSLATION, Math.min(MAX_TRANSLATION, touchVelocity.x * 2))
    const influenceY = Math.max(-MAX_TRANSLATION, Math.min(MAX_TRANSLATION, touchVelocity.y * 2))

    target.current.x = influenceX
    target.current.y = influenceY
    target.current.rotY = (influenceX / MAX_TRANSLATION) * MAX_ROTATION
    target.current.rotX = (influenceY / MAX_TRANSLATION) * MAX_ROTATION * 0.6

    // Decay back to center
    const decay = () => {
      target.current.x *= 0.95
      target.current.y *= 0.95
      target.current.rotY *= 0.95
      target.current.rotX *= 0.95
      if (Math.abs(target.current.x) > 0.01 || Math.abs(target.current.y) > 0.01) {
        requestAnimationFrame(decay)
      }
    }
    requestAnimationFrame(decay)
  }, [touchVelocity, isClient, prefersReducedMotion])

  // Scroll parallax
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return

    const parallaxY = scrollProgress * 40
    const parallaxScale = 1 - scrollProgress * 0.08

    target.current.y = parallaxY
    target.current.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, parallaxScale))
  }, [scrollProgress, isClient, prefersReducedMotion])

  // Cinematic entrance
  useEffect(() => {
    if (!isInView || !containerRef.current) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.hero-portrait-container', { opacity: 1, clipPath: 'inset(0 0 0 0)' })
        gsap.set('.hero-portrait-border', { scale: 1, opacity: 0.4 })
        gsap.set('.hero-portrait-glow', { opacity: 0.5 })
        gsap.set('.hero-portrait-meta', { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({ delay: 1.0 })

      tl.fromTo('.hero-portrait-container',
        { clipPath: 'inset(12% 8% 12% 8%)', opacity: 0, scale: 1.08, y: 50, rotateY: 8, filter: 'blur(12px)' },
        { clipPath: 'inset(0 0 0 0)', opacity: 1, scale: 1, y: 0, rotateY: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.inOut' }
      )

      tl.fromTo('.hero-portrait-border',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 1.2, ease: 'power3.out' },
        '-=1.2'
      )

      tl.fromTo('.hero-portrait-glow',
        { opacity: 0, scale: 0.9 },
        { opacity: 0.5, scale: 1, duration: 1.4, ease: 'power2.out' },
        '-=1'
      )

      tl.fromTo('.hero-portrait-meta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
        '-=0.8'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [isInView, prefersReducedMotion])

  const imageSrc = src || '/images/srihari-portrait.jpg'
  const showPlaceholder = !src || imageError

  return (
    <div
      ref={containerRef}
      className="hero-portrait relative"
      style={{
        opacity: 0,
        willChange: 'transform',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Atmospheric glow behind portrait */}
      <div
        ref={glowRef}
        className="hero-portrait-glow absolute -inset-8 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Main image container with asymmetric cinematic mask */}
      <div
        ref={imageWrapperRef}
        className="hero-portrait-container relative overflow-hidden"
        style={{
          width: 'min(70vw, 420px)',
          aspectRatio: '3/4',
          clipPath: 'inset(0% 0% 0% 0%)',
          transform: 'scale(1)',
          filter: 'grayscale(100%) contrast(1.1) brightness(0.9)',
          transition: 'filter 0.8s ease',
          willChange: 'clip-path, filter',
        }}
      >
        {!showPlaceholder ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover', display: 'block' }}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface via-background to-surface">
            <div className="text-center px-8">
              <div className="w-16 h-16 mx-auto mb-4 border border-border-subtle rounded-full flex items-center justify-center">
                <span className="text-text-muted text-xs tracking-widest uppercase">Photo</span>
              </div>
              <p className="caption text-text-muted max-w-[200px] mx-auto leading-relaxed">
                Replace with your portrait at <br />
                <span className="text-accent">/images/srihari-portrait.jpg</span>
              </p>
            </div>
          </div>
        )}

        {/* Glass/gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Subtle grain overlay */}
        <div
          ref={grainRef}
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />

        {/* Moving light reflection */}
        <div
          ref={lightRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
            opacity: isInView ? 1 : 0,
          }}
        />

        {/* Top/bottom gradient fades */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, rgba(5,5,5,0.3) 100%)',
          }}
        />
      </div>

      {/* Thin animated border */}
      <div
        ref={borderRef}
        className="hero-portrait-border absolute -inset-3 border border-accent/20 pointer-events-none"
        style={{
          transform: 'scale(0.95)',
          opacity: 0,
          clipPath: 'inset(0 0 0 0)',
          transition: 'opacity 0.8s ease',
        }}
      />

      {/* Corner accent marks */}
      <div
        className="absolute -top-1 -left-1 w-6 h-6 pointer-events-none"
        style={{ borderTop: '1px solid rgba(125, 211, 252, 0.4)', borderLeft: '1px solid rgba(125, 211, 252, 0.4)' }}
      />
      <div
        className="absolute -bottom-1 -right-1 w-6 h-6 pointer-events-none"
        style={{ borderBottom: '1px solid rgba(125, 211, 252, 0.4)', borderRight: '1px solid rgba(125, 211, 252, 0.4)' }}
      />

      {/* Metadata labels around portrait */}
      <div className="hero-portrait-meta absolute -right-16 top-1/4 hidden lg:block" style={{ opacity: 0 }}>
        <p className="caption text-text-muted tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          SRIHARI
        </p>
      </div>
      <div className="hero-portrait-meta absolute -left-16 bottom-1/4 hidden lg:block" style={{ opacity: 0 }}>
        <p className="caption text-text-muted tracking-widest" style={{ writingMode: 'vertical-rl' }}>
          CREATIVE DEVELOPER
        </p>
      </div>
      <div className="hero-portrait-meta absolute -bottom-12 left-1/2 -translate-x-1/2" style={{ opacity: 0 }}>
        <p className="caption text-text-muted/60 tracking-widest">
          DESIGN &times; CODE &times; MOTION
        </p>
      </div>
    </div>
  )
}
