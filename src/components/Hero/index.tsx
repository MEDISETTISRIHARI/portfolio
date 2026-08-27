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

type HeroProps = {
  profile?: any
  hero?: any
}

export default function Hero({
  profile,
  hero,
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  })

  const { progress } = useScroll()

  /*
   * HERO ENTRANCE
   *
   * Important:
   * Mobile must NEVER wait for the cinematic intro.
   * The portfolio content must always become visible.
   */
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches

    const animate = () => {
      const canvas =
        document.querySelector('.hero-canvas')

      const titleLines =
        document.querySelectorAll('.hero-title-line')

      const role =
        document.querySelector('.hero-role')

      const cta =
        document.querySelectorAll('.hero-cta')

      const portrait =
        document.querySelector('.hero-portrait')

      const metadata =
        document.querySelector('.hero-metadata')

      const tl = gsap.timeline()

      if (canvas) {
        tl.fromTo(
          canvas,
          {
            opacity: 0,
            scale: 1.03,
          },
          {
            opacity: 1,
            scale: 1,
            duration: isMobile ? 0.6 : 1.5,
            ease: 'power2.out',
          }
        )
      }

      if (titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          {
            opacity: 0,
            y: isMobile ? 20 : 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: isMobile ? 0.6 : 1,
            stagger: isMobile ? 0.06 : 0.12,
            ease: 'power3.out',
          },
          isMobile ? '-=0.3' : '-=1'
        )
      }

      if (role) {
        tl.fromTo(
          role,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          isMobile ? '-=0.2' : '-=0.5'
        )
      }

      if (cta.length > 0) {
        tl.fromTo(
          cta,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          isMobile ? '-=0.2' : '-=0.4'
        )
      }

      if (portrait) {
        tl.fromTo(
          portrait,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          isMobile ? '-=0.2' : '-=0.4'
        )
      }

      if (metadata) {
        tl.fromTo(
          metadata,
          {
            opacity: 0,
            y: 10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          isMobile ? '-=0.1' : '-=0.2'
        )
      }
    }

    /*
     * MOBILE:
     * Start immediately.
     *
     * DESKTOP:
     * Keep the existing cinematic-intro behavior.
     */
    if (isMobile) {
      animate()
      return
    }

    const seen =
      sessionStorage.getItem(
        'srihari-intro-seen'
      )

    if (seen) {
      animate()
      return
    }

    const handler = () => {
      animate()

      window.removeEventListener(
        'intro-complete',
        handler
      )
    }

    window.addEventListener(
      'intro-complete',
      handler
    )

    /*
     * Safety fallback.
     *
     * If the cinematic intro fails for any reason,
     * the desktop Hero must still become visible.
     */
    const fallback = window.setTimeout(() => {
      animate()

      window.removeEventListener(
        'intro-complete',
        handler
      )
    }, 2500)

    return () => {
      window.removeEventListener(
        'intro-complete',
        handler
      )

      window.clearTimeout(fallback)
    }
  }, [])

  /*
   * MOUSE PARALLAX
   *
   * Disabled on touch/mobile devices.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(max-width: 767px)'
    )

    if (mediaQuery.matches) {
      return
    }

    const move = (event: MouseEvent) => {
      setMousePos({
        x:
          (event.clientX /
            window.innerWidth) *
            2 -
          1,

        y:
          -(event.clientY /
            window.innerHeight) *
            2 +
          1,
      })
    }

    window.addEventListener(
      'mousemove',
      move,
      {
        passive: true,
      }
    )

    return () => {
      window.removeEventListener(
        'mousemove',
        move
      )
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* HERO BACKGROUND */}

      <HeroVisual
        mousePos={mousePos}
        scrollProgress={progress}
      />

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

            <HeroPortrait
              image={profile?.image}
            />

          </div>

        </div>

        <div className="pb-10">

          <HeroMetadata />

        </div>

      </div>
    </section>
  )
}