'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import HeroVisual from './HeroVisual'
import HeroContent from './HeroContent'
import HeroMeta from './HeroMeta'
import HeroCTA from './HeroCTA'
import HeroMetadata from './HeroMetadata'
import HeroPortrait from './HeroPortrait'
import { useScroll } from '@/hooks/useScroll'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { progress } = useScroll()

  useEffect(() => {
    const animate = () => {
      const tl = gsap.timeline()

      tl.fromTo('.hero-canvas',
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      )

      tl.fromTo('.hero-title-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' },
        '-=1'
      )

      tl.fromTo('.hero-role',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )

      tl.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      )

      tl.fromTo('.hero-portrait',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.4'
      )

      tl.fromTo('.hero-metadata',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.2'
      )
    }

    const seen = sessionStorage.getItem('srihari-intro-seen')
    if (seen) {
      animate()
    } else {
      const handler = () => {
        animate()
        window.removeEventListener('intro-complete', handler)
      }
      window.addEventListener('intro-complete', handler)
    }
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
    >
      <HeroVisual mousePos={mousePos} scrollProgress={progress} />

      <div className="relative z-20 mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="grid min-h-screen grid-cols-1 items-center gap-12 py-24 md:grid-cols-12 md:gap-10 lg:gap-16">

          {/* LEFT — identity + work */}
          <div className="md:col-span-7">
            <HeroContent />
            <HeroMeta />
            <HeroCTA />
          </div>

          {/* RIGHT — PHOTO */}
          <div className="flex items-center justify-center md:col-span-5">
            <HeroPortrait />
          </div>

        </div>

        <div className="pb-10">
          <HeroMetadata />
        </div>
      </div>
    </section>
  )
}
