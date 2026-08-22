'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import HeroVisual from './HeroVisual'
import HeroContent from './HeroContent'
import HeroMeta from './HeroMeta'
import HeroCTA from './HeroCTA'
import HeroMetadata from './HeroMetadata'
import { useScroll } from '@/hooks/useScroll'

type HeroData = {
  headline: string
  subtitle: string
  description: string
  image?: string | null
  video?: string | null
  visualMode: string
  ctaText?: string | null
  ctaLink?: string | null
  secondaryCta?: string | null
  secondaryLink?: string | null
}

type HeroProps = {
  data: HeroData
  role?: string
}

export default function Hero({ data, role }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [pointerDistance, setPointerDistance] = useState(0)
  const [touchVelocity, setTouchVelocity] = useState({ x: 0, y: 0 })
  const { scrollY, progress } = useScroll()

  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return
    const x = Math.max(-1, Math.min(1, e.gamma / 45))
    const y = Math.max(-1, Math.min(1, (e.beta - 45) / 45))
    setMousePos({ x, y })
    const dist = Math.sqrt(x * x + y * y)
    setPointerDistance(dist)
  }

  const requestOrientation = useCallback(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true })
          }
        })
        .catch(() => {})
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    }
  }, [])

  // Mouse + touch + orientation tracking
  useEffect(() => {
    let lastTouchX = 0
    let lastTouchY = 0
    let lastTouchTime = 0

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
      const dist = Math.sqrt(x * x + y * y)
      setPointerDistance(dist)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        lastTouchX = e.touches[0].clientX
        lastTouchY = e.touches[0].clientY
        lastTouchTime = Date.now()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const currentX = e.touches[0].clientX
        const currentY = e.touches[0].clientY
        const now = Date.now()
        const dt = Math.max(1, now - lastTouchTime)
        const dx = (currentX - lastTouchX) / dt * 16
        const dy = (currentY - lastTouchY) / dt * 16

        setTouchVelocity({ x: dx, y: dy })

        const normalizedX = (currentX / window.innerWidth) * 2 - 1
        const normalizedY = -(currentY / window.innerHeight) * 2 + 1
        setMousePos({ x: normalizedX, y: normalizedY })
        const dist = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)
        setPointerDistance(dist)

        lastTouchX = currentX
        lastTouchY = currentY
        lastTouchTime = now
      }
    }

    const handleTouchEnd = () => {
      setTouchVelocity({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Scroll exit: fade hero content as user scrolls down
  useEffect(() => {
    if (progress > 0.12) {
      const intensity = Math.min(1, (progress - 0.12) * 2)
      gsap.to('.hero-content-wrapper', {
        opacity: 1 - intensity,
        y: intensity * -40,
        scale: 1 - intensity * 0.02,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      })
    } else {
      gsap.to('.hero-content-wrapper', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      })
    }
  }, [progress])

  // Intro coordination: run entrance animation when intro completes
  useEffect(() => {
    const animate = () => {
      const tl = gsap.timeline({ paused: true })

      // Visual reveal: scale from 1.03 to 1, fade in
      tl.fromTo(
        '.hero-canvas',
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      )

      // Title lines: masked clip-path reveal, staggered
      tl.fromTo(
        '.hero-title-line',
        {
          opacity: 0,
          y: 60,
          clipPath: 'inset(0 0 100% 0)',
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=1'
      )

      // Role text: fade up from muted
      tl.fromTo(
        '.hero-role',
        { opacity: 0, y: 20, filter: 'blur(2px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )

      // Description: subtle fade
      tl.fromTo(
        '.hero-reveal',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )

      // CTA: fade up
      tl.fromTo(
        '.hero-cta',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )

      // Metadata: fade up delayed
      tl.fromTo(
        '.hero-metadata',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )

      tl.play()
    }

    const hasSeenIntro = sessionStorage.getItem('srihari-intro-seen')

    if (hasSeenIntro) {
      // Shortened entrance for returning visitors
      const tl = gsap.timeline()
      tl.fromTo('.hero-title-line', { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, stagger: 0.1, ease: 'power3.out' })
        .fromTo('.hero-role', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
        .fromTo('.hero-reveal', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('.hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .fromTo('.hero-metadata', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      tl.play()
    } else {
      const handleIntroComplete = () => {
        animate()
        window.removeEventListener('intro-complete', handleIntroComplete)
      }
      window.addEventListener('intro-complete', handleIntroComplete)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      data-scroll-section="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* 3D Hero Visual - occupies upper portion */}
      <HeroVisual
        mousePos={mousePos}
        scrollProgress={progress}
        pointerDistance={pointerDistance}
        visualMode={data.visualMode}
        image={data.image}
        video={data.video}
      />

      {/* Content area - positioned in lower third */}
      <div className="hero-content-wrapper relative z-20 w-full max-w-2xl mx-auto pb-32 md:pb-40">
        <HeroContent headline={data.headline} subtitle={data.subtitle} role={role} />
        <HeroMeta description={data.description} />
        <HeroCTA
          primaryText={data.ctaText || 'VIEW SELECTED WORK'}
          primaryHref={data.ctaLink || '#work'}
          secondaryText={data.secondaryCta || "LET'S TALK"}
          secondaryHref={data.secondaryLink || '#contact'}
        />
      </div>

      {/* Bottom metadata - pinned at bottom */}
      <HeroMetadata className="mt-32 md:mt-40" onRequestOrientation={requestOrientation} />
    </section>
  )
}
