'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import HeroVisual from './HeroVisual'
import HeroContent from './HeroContent'
import HeroMeta from './HeroMeta'
import HeroCTA from './HeroCTA'
import HeroMetadata from './HeroMetadata'
import { useScroll } from '@/hooks/useScroll'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollY, progress } = useScroll()

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
          y: 40,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=1'
      )

      // Role text: fade up from muted
      tl.fromTo(
        '.hero-role',
        { opacity: 0, y: 15, filter: 'blur(2px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      )

      // CTA: fade up
      tl.fromTo(
        '.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      )

      // Metadata: fade up delayed
      tl.fromTo(
        '.hero-metadata',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.2'
      )

      tl.play()
    }

    const hasSeenIntro = sessionStorage.getItem('srihari-intro-seen')

    if (hasSeenIntro) {
      animate()
    } else {
      const handleIntroComplete = () => {
        animate()
        window.removeEventListener('intro-complete', handleIntroComplete)
      }
      window.addEventListener('intro-complete', handleIntroComplete)
    }
  }, [])

  // Mouse tracking for camera parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* 3D Hero Visual - occupies upper portion */}
      <HeroVisual mousePos={mousePos} scrollProgress={progress} />

      {/* Content area - positioned in lower third */}
      <div className="relative z-20 w-full max-w-2xl mx-auto pb-32 md:pb-40">
        <HeroContent />
        <HeroMeta />
        <HeroCTA />
      </div>

      {/* Bottom metadata - pinned at bottom */}
      <HeroMetadata className="mt-32 md:mt-40" />
    </section>
  )
}