'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import HeroVisual from './HeroVisual'
import HeroContent from './HeroContent'
import HeroMeta from './HeroMeta'
import HeroCTA from './HeroCTA'
import HeroIdentity from './HeroIdentity'
import Portrait from './Portrait'
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
  const [isMobile, setIsMobile] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { scrollY, progress } = useScroll()

  // Check reduced motion preference
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return
    const x = Math.max(-1, Math.min(1, e.gamma / 45))
    const y = Math.max(-1, Math.min(1, (e.beta - 45) / 45))
    setMousePos({ x, y })
    const dist = Math.sqrt(x * x + y * y)
    setPointerDistance(dist)
  }

  const orientationListenerRef = useRef(false)

  const requestOrientation = useCallback(() => {
    if (orientationListenerRef.current) return
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            orientationListenerRef.current = true
            window.addEventListener('deviceorientation', handleOrientation, { passive: true })
          }
        })
        .catch(() => {})
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      orientationListenerRef.current = true
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    }
  }, [])

  // Mouse + touch + orientation tracking
  useEffect(() => {
    let lastTouchX = 0
    let lastTouchY = 0
    let lastTouchTime = 0

    // Detect mobile once on mount
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768)
    }

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
    if (prefersReducedMotion) return

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

    // Scroll-responsive typography movement
    const heroContent = document.querySelector('.hero-center-column') as HTMLElement | null
    if (heroContent && progress < 0.15) {
      const parallax = progress * 30
      heroContent.style.transform = `translateY(${-parallax}px)`
    }
  }, [progress, prefersReducedMotion])

  // In-view detection for portrait reveal
  useEffect(() => {
    if (!heroRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  // Intro coordination: run entrance animation when intro completes
  useEffect(() => {
    const animate = () => {
      if (prefersReducedMotion) {
        gsap.set('.hero-canvas, .identity-mark, .identity-role, .identity-tagline, .identity-divider, .identity-meta, .hero-title-line, .hero-reveal, .hero-cta, .hero-metadata, .hero-portrait', { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)' })
        return
      }

      const tl = gsap.timeline({ paused: true })

      // Visual reveal: scale from 1.03 to 1, fade in
      tl.fromTo(
        '.hero-canvas',
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      )

      // Identity mark reveal
      tl.fromTo(
        '.identity-mark',
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
        '-=1'
      )

      // Role reveal
      tl.fromTo(
        '.identity-role',
        { opacity: 0, y: 15, filter: 'blur(2px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      )

      // Tagline reveal
      tl.fromTo(
        '.identity-tagline',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )

      // Divider reveal
      tl.fromTo(
        '.identity-divider',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )

      // Meta items reveal
      tl.fromTo(
        '.identity-meta',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
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

      // Portrait: cinematic reveal
      tl.fromTo(
        '.hero-portrait',
        { clipPath: 'inset(12% 8% 12% 8%)', opacity: 0, scale: 1.08, y: 40, rotateY: 8 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 1.6, ease: 'power3.inOut' },
        '-=1.2'
      )

      tl.play()
    }

    const hasSeenIntro = sessionStorage.getItem('srihari-intro-seen')

    if (hasSeenIntro) {
      // Shortened entrance for returning visitors
      const tl = gsap.timeline()
      if (prefersReducedMotion) {
        tl.set('.identity-mark, .identity-role, .identity-tagline, .identity-divider, .identity-meta, .hero-title-line, .hero-reveal, .hero-cta, .hero-metadata, .hero-portrait', { opacity: 1, y: 0, x: 0, clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)' })
      } else {
        tl.fromTo('.identity-mark', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          .fromTo('.identity-role', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
          .fromTo('.identity-tagline', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
          .fromTo('.identity-divider', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
          .fromTo('.identity-meta', { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.3')
          .fromTo('.hero-title-line', { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
          .fromTo('.hero-reveal', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo('.hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
          .fromTo('.hero-metadata', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
          .fromTo('.hero-portrait', { clipPath: 'inset(12% 8% 12% 8%)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1, ease: 'power3.inOut' }, '-=0.6')
      }
      tl.play()
    } else {
      const handleIntroComplete = () => {
        animate()
        window.removeEventListener('intro-complete', handleIntroComplete)
      }
      window.addEventListener('intro-complete', handleIntroComplete)
    }
  }, [prefersReducedMotion])

  return (
    <section
      id="hero"
      ref={heroRef}
      data-scroll-section="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background depth - 3D environment */}
      <div data-depth="background" className="absolute inset-0 z-0">
        <HeroVisual
          mousePos={mousePos}
          scrollProgress={progress}
          pointerDistance={pointerDistance}
          visualMode={data.visualMode}
          image={data.image}
          video={data.video}
          isMobile={isMobile}
        />
      </div>

      {/* Signature wow moment trigger */}
      <div id="wow-moment-trigger" className="hidden" aria-hidden="true" />

      {/* Content depth - editorial grid */}
      <div data-depth="content" className={`hero-content-wrapper relative z-20 w-full ${isMobile ? 'px-6 pt-16 pb-24' : 'px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-32 md:pb-40'}`}>
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left column - identity system */}
          <div className="md:col-span-3 lg:col-span-3 order-1">
            <div className="md:sticky md:top-32">
              <HeroIdentity role={role} isInView={isInView} />
            </div>
          </div>

          {/* Center column - typography, description, CTA */}
          <div className="md:col-span-5 lg:col-span-5 order-2 md:order-2 hero-center-column">
            <HeroContent headline={data.headline} subtitle={data.subtitle} />
            <div className="mt-8 md:mt-12">
              <HeroMeta description={data.description} />
            </div>
            <div className="mt-8 md:mt-12 hero-cta">
              <HeroCTA
                primaryText={data.ctaText || 'VIEW SELECTED WORK'}
                primaryHref={data.ctaLink || '#work'}
                secondaryText={data.secondaryCta || "LET'S TALK"}
                secondaryHref={data.secondaryLink || '#contact'}
              />
            </div>
          </div>

          {/* Right column - portrait composition */}
          <div className="md:col-span-4 lg:col-span-4 order-3 hidden md:block" data-scroll-parallax="0.08">
            <div className="relative">
              <Portrait
                src={data.image}
                alt={role || 'SRIHARI'}
                isInView={isInView}
                mousePos={mousePos}
                touchVelocity={touchVelocity}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Mobile portrait - strong crop, centered */}
          <div className="md:hidden order-3 mt-10" data-scroll-parallax="0.06">
            <div className="relative mx-auto" style={{ width: 'min(82vw, 320px)' }}>
              <Portrait
                src={data.image}
                alt={role || 'SRIHARI'}
                isInView={isInView}
                mousePos={mousePos}
                touchVelocity={touchVelocity}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Foreground depth - metadata */}
      <div data-depth="foreground" className="relative z-30">
        <HeroMetadata className={isMobile ? 'mt-8' : 'mt-auto'} onRequestOrientation={requestOrientation} />
      </div>
    </section>
  )
}
