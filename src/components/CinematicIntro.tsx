'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const hasSeenIntro = sessionStorage.getItem('srihari-intro-seen')

    if (hasSeenIntro) {
      // Returning visitor: quick fade out to reveal Hero
      window.dispatchEvent(new CustomEvent('intro-complete'))
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none'
          }
        },
      })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('srihari-intro-seen', 'true')
        },
      })

      timelineRef.current = tl

      const base = isMobile ? 0.5 : 0.8
      const sub = base * 0.75
      const overlap = base * 0.4

      tl.set('.intro-title', { opacity: 0, clipPath: 'inset(0 100% 0 0)' })
        .set('.intro-subtitle', { opacity: 0, y: 20 })
        .set('.intro-tagline', { opacity: 0, y: 20 })
        .set('.intro-divider', { opacity: 0, scaleY: 0 })
        .set(skipRef.current, { opacity: 0 })
        .set(containerRef.current, { opacity: 1, scale: 1 })

      .to('.intro-title', {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: base,
        ease: 'power3.out',
      })

      .to('.intro-subtitle', {
        opacity: 1,
        y: 0,
        duration: sub,
        ease: 'power2.out',
      }, `-=${overlap}`)

      .to('.intro-tagline', {
        opacity: 1,
        y: 0,
        duration: sub,
        ease: 'power2.out',
      }, `-=${overlap * 0.75}`)

      .to('.intro-divider', {
        opacity: 0.5,
        scaleY: 1,
        duration: sub * 0.6,
        ease: 'power2.out',
      }, '-=0.1')
      .to(contentRef.current, {
        scale: 1.01,
        duration: base * 0.6,
        ease: 'power1.inOut',
      }, '<')

      // Hold for a moment
      .to(contentRef.current, {
        scale: 1,
        duration: base * 0.3,
        ease: 'power1.inOut',
      }, `+=${base * 0.15}`)

      // Seamless reveal: dispatch event first so Hero can start animating
      // while intro is still fading out
      .call(() => {
        window.dispatchEvent(new CustomEvent('intro-complete'))
      }, undefined, `+=${base * 0.05}`)

      .to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: base * 0.7,
        ease: 'power2.inOut',
      }, '<')

      .set(containerRef.current, { display: 'none' }, `+=0.1`)

    }, containerRef)

    return () => ctx.revert()
  }, [isMobile])

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1)
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
    >
      <div ref={contentRef} className="text-center px-6">
        <h1 className="intro-title font-display text-display-lg text-text-primary mb-4">
          SRIHARI
        </h1>
        <p className="intro-subtitle font-display text-display-md text-accent mt-4">
          DIGITAL EXPERIENCES
        </p>
        <p className="intro-tagline body-md text-text-muted mt-8">
          DESIGN × CODE × MOTION
        </p>
        <div className="intro-divider w-px h-16 bg-gradient-to-b from-transparent via-text-muted to-transparent mx-auto mt-12 opacity-50 origin-top" />
      </div>
      <button
        ref={skipRef}
        onClick={handleSkip}
        className="absolute bottom-8 right-8 caption text-text-muted hover:text-text-primary transition-colors duration-300"
      >
        SKIP
      </button>
    </div>
  )
}
