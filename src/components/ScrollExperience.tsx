'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type ScrollState = {
  scrollY: number
  progress: number
  velocity: number
  direction: 'up' | 'down' | null
  viewportHeight: number
  viewportWidth: number
}

type SectionInfo = {
  id: string
  element: HTMLElement
  top: number
  bottom: number
  height: number
  progress: number
  visibility: number
  active: boolean
  prevActive: boolean
}

type ElementInfo = {
  element: HTMLElement
  sectionId: string
  type: 'reveal' | 'parallax' | 'scale' | 'opacity' | 'rotate' | 'blur'
  speed?: number
  currentValues: {
    translateY: number
    scale: number
    opacity: number
    rotate: number
    blur: number
  }
}

const SMOOTHING = 0.08
const PARALLAX_BASE = 0.3

export default function ScrollExperience({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollState = useRef<ScrollState>({
    scrollY: 0,
    progress: 0,
    velocity: 0,
    direction: null,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
  })
  const sections = useRef<Map<string, SectionInfo>>(new Map())
  const elements = useRef<Map<string, ElementInfo>>(new Map())
  const rafRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const activeSectionRef = useRef<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const physics = useRef({
    skewX: 0,
    skewY: 0,
    displacement: 0,
    intensity: 1,
  })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const sectionDividersRef = useRef<Map<string, HTMLDivElement>>(new Map())

  // Resize observer for viewport dimensions
  useEffect(() => {
    const handleResize = () => {
      scrollState.current.viewportHeight = window.innerHeight
      scrollState.current.viewportWidth = window.innerWidth
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Check reduced motion preference
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  // Passive scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const now = Date.now()
        const dt = Math.max(1, now - lastTime.current)
        const currentScrollY = window.scrollY
        const maxScroll = document.body.scrollHeight - scrollState.current.viewportHeight
        const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0
        const velocity = (currentScrollY - lastScrollY.current) / dt * 16
        const direction = Math.abs(currentScrollY - lastScrollY.current) > 1
          ? (currentScrollY > lastScrollY.current ? 'down' : 'up')
          : null

        scrollState.current = {
          ...scrollState.current,
          scrollY: currentScrollY,
          progress,
          velocity,
          direction,
        }

        lastScrollY.current = currentScrollY
        lastTime.current = now
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Register sections and elements
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    sections.current.clear()
    elements.current.clear()
    sectionDividersRef.current.clear()

    const sectionEls = container.querySelectorAll('[data-scroll-section]')
    sectionEls.forEach((el) => {
      const id = el.getAttribute('data-scroll-section') || ''
      if (!id) return

      const rect = el.getBoundingClientRect()
      sections.current.set(id, {
        id,
        element: el as HTMLElement,
        top: rect.top + scrollState.current.scrollY,
        bottom: rect.bottom + scrollState.current.scrollY,
        height: rect.height,
        progress: 0,
        visibility: 0,
        active: false,
        prevActive: false,
      })

      const revealEls = el.querySelectorAll('[data-scroll-reveal], .reveal-up')
      revealEls.forEach((child, i) => {
        const childId = `${id}-reveal-${i}`
        elements.current.set(childId, {
          element: child as HTMLElement,
          sectionId: id,
          type: 'reveal',
          currentValues: { translateY: 40, scale: 1, opacity: 0, rotate: 0, blur: 4 },
        })
      })

      const parallaxEls = el.querySelectorAll('[data-scroll-parallax]')
      parallaxEls.forEach((child, i) => {
        const childId = `${id}-parallax-${i}`
        const speed = parseFloat(child.getAttribute('data-scroll-parallax') || '0.5')
        elements.current.set(childId, {
          element: child as HTMLElement,
          sectionId: id,
          type: 'parallax',
          speed,
          currentValues: { translateY: 0, scale: 1, opacity: 1, rotate: 0, blur: 0 },
        })
      })

      const scaleEls = el.querySelectorAll('[data-scroll-scale]')
      scaleEls.forEach((child, i) => {
        const childId = `${id}-scale-${i}`
        elements.current.set(childId, {
          element: child as HTMLElement,
          sectionId: id,
          type: 'scale',
          currentValues: { translateY: 0, scale: 0.9, opacity: 0, rotate: 0, blur: 0 },
        })
      })

      const opacityEls = el.querySelectorAll('[data-scroll-opacity]')
      opacityEls.forEach((child, i) => {
        const childId = `${id}-opacity-${i}`
        elements.current.set(childId, {
          element: child as HTMLElement,
          sectionId: id,
          type: 'opacity',
          currentValues: { translateY: 0, scale: 1, opacity: 0, rotate: 0, blur: 0 },
        })
      })

      const rotateEls = el.querySelectorAll('[data-scroll-rotate]')
      rotateEls.forEach((child, i) => {
        const childId = `${id}-rotate-${i}`
        elements.current.set(childId, {
          element: child as HTMLElement,
          sectionId: id,
          type: 'rotate',
          currentValues: { translateY: 0, scale: 1, opacity: 1, rotate: -5, blur: 0 },
        })
      })

      const blurEls = el.querySelectorAll('[data-scroll-blur]')
      blurEls.forEach((child, i) => {
        const childId = `${id}-blur-${i}`
        elements.current.set(childId, {
          element: child as HTMLElement,
          sectionId: id,
          type: 'blur',
          currentValues: { translateY: 0, scale: 1, opacity: 0, rotate: 0, blur: 8 },
        })
      })
    })

    const resizeObserver = new ResizeObserver(() => {
      sections.current.forEach((section) => {
        const rect = section.element.getBoundingClientRect()
        section.top = rect.top + scrollState.current.scrollY
        section.bottom = rect.bottom + scrollState.current.scrollY
        section.height = rect.height
      })
    })

    sectionEls.forEach((el) => resizeObserver.observe(el))

    return () => {
      resizeObserver.disconnect()
    }
  }, [children])

  // IntersectionObserver for active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-scroll-section') || ''
            activeSectionRef.current = id
            setActiveSection(id)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    const sectionEls = containerRef.current?.querySelectorAll('[data-scroll-section]')
    sectionEls?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [children])

  // Signature wow moment: Hero to About transition
  useEffect(() => {
    let wowTimeline: gsap.core.Timeline | null = null
    let hasTriggeredWow = false

    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>
      const newSection = customEvent.detail?.sectionId

      if (newSection === 'about' && !hasTriggeredWow && activeSectionRef.current === 'hero') {
        hasTriggeredWow = true

        // Create cinematic wow moment
        wowTimeline = gsap.timeline()

        // 1. Hero content subtle separation
        const heroContent = containerRef.current?.querySelector('.hero-content-wrapper')
        if (heroContent) {
          wowTimeline.to(heroContent, {
            opacity: 0.3,
            scale: 0.98,
            y: -30,
            duration: 0.8,
            ease: 'power2.inOut',
          }, 0)
        }

        // 2. 3D canvas subtle pulse
        const heroCanvas = containerRef.current?.querySelector('.hero-canvas')
        if (heroCanvas) {
          wowTimeline.to(heroCanvas, {
            scale: 1.02,
            opacity: 0.7,
            duration: 1,
            ease: 'power2.inOut',
          }, 0)
        }

        // 3. About section dramatic entrance
        const aboutSection = containerRef.current?.querySelector('[data-scroll-section="about"]')
        if (aboutSection) {
          wowTimeline.fromTo(aboutSection,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
            0.3
          )
        }

        // 4. About headline clip-path reveal
        const aboutLines = containerRef.current?.querySelectorAll('.about-hero-line')
        if (aboutLines) {
          wowTimeline.fromTo(aboutLines,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out' },
            0.5
          )
        }

        // 5. Portrait emergence (if present)
        const portrait = containerRef.current?.querySelector('.hero-portrait')
        if (portrait) {
          wowTimeline.fromTo(portrait,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.4, ease: 'power3.inOut' },
            0.6
          )
        }

        // 6. Clean up hero after transition
        wowTimeline.to('.hero-content-wrapper', {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        }, 1.2)
      }
    }

    window.addEventListener('scroll-section-change', handleSectionChange as EventListener)

    return () => {
      window.removeEventListener('scroll-section-change', handleSectionChange as EventListener)
      if (wowTimeline) {
        wowTimeline.kill()
      }
    }
  }, [])

  // Animation loop
  useEffect(() => {
    let raf: number

    const animate = () => {
      const state = scrollState.current
      const viewportHeight = state.viewportHeight
      const scrollY = state.scrollY
      const absVelocity = Math.abs(state.velocity)
      const maxVelocity = 25

      // Cinematic scroll physics - reduced if user prefers
      const velocityFactor = prefersReducedMotion ? 0 : Math.min(absVelocity / maxVelocity, 1)
      const targetSkew = prefersReducedMotion ? 0 : state.velocity * 0.015
      const targetDisplacement = prefersReducedMotion ? 0 : state.velocity * 0.4
      const targetIntensity = prefersReducedMotion ? 1 : 1 + velocityFactor * 0.3

      physics.current.skewX += (targetSkew - physics.current.skewX) * 0.05
      physics.current.skewY += (0 - physics.current.skewY) * 0.06
      physics.current.displacement += (targetDisplacement - physics.current.displacement) * 0.05
      physics.current.intensity += (targetIntensity - physics.current.intensity) * 0.03

      const skewX = physics.current.skewX
      const displacement = physics.current.displacement
      const intensity = physics.current.intensity

      sections.current.forEach((section) => {
        const sectionTop = section.top
        const sectionBottom = section.bottom
        const sectionHeight = section.height

        const visibleTop = Math.max(scrollY, sectionTop)
        const visibleBottom = Math.min(scrollY + viewportHeight, sectionBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        section.visibility = sectionHeight > 0 ? visibleHeight / sectionHeight : 0
        section.active = section.visibility > 0.01

        const distanceFromTop = scrollY - sectionTop
        const scrollableDistance = sectionHeight + viewportHeight
        section.progress = scrollableDistance > 0 ? Math.max(0, Math.min(1, distanceFromTop / scrollableDistance)) : 0
      })

      // Section transitions: fade/scale adjacent sections based on proximity
      const sortedSections = Array.from(sections.current.values()).sort((a, b) => a.top - b.top)
      sortedSections.forEach((section, index) => {
        const prevSection = sortedSections[index - 1]
        const nextSection = sortedSections[index + 1]
        const sectionEl = section.element

        // Transition from previous section
        if (prevSection && section.progress < 0.15) {
          const transitionProgress = Math.max(0, 1 - section.progress / 0.15)
          sectionEl.style.opacity = String(Math.min(1, 0.3 + transitionProgress * 0.7))
          sectionEl.style.transform = `scale(${0.97 + transitionProgress * 0.03}) translateY(${(1 - transitionProgress) * -20}px)`
        }

        // Transition to next section
        if (nextSection && section.progress > 0.85) {
          const transitionProgress = Math.max(0, (section.progress - 0.85) / 0.15)
          sectionEl.style.opacity = String(Math.max(0, 1 - transitionProgress * 0.5))
          sectionEl.style.transform = `scale(${1 - transitionProgress * 0.02}) translateY(${transitionProgress * 10}px)`
        }

        // Section-specific background shifts for continuity
        if (section.id === 'about') {
          const aboutProgress = section.progress
          sectionEl.style.background = `linear-gradient(to bottom, transparent 0%, rgba(125, 211, 252, ${aboutProgress * 0.02}) 50%, transparent 100%)`
        }
        if (section.id === 'skills') {
          const skillsProgress = section.progress
          sectionEl.style.background = `linear-gradient(to bottom, transparent 0%, rgba(91, 141, 239, ${skillsProgress * 0.015}) 50%, transparent 100%)`
        }
        if (section.id === 'work') {
          const workProgress = section.progress
          sectionEl.style.background = `linear-gradient(to bottom, transparent 0%, rgba(125, 211, 252, ${workProgress * 0.02}) 50%, transparent 100%)`
        }
      })

      // Dispatch section change events
      let maxVisibility = 0
      let mostVisibleId: string | null = null
      sections.current.forEach((section) => {
        if (section.visibility > maxVisibility) {
          maxVisibility = section.visibility
          mostVisibleId = section.id
        }
      })
      if (mostVisibleId && mostVisibleId !== activeSectionRef.current) {
        activeSectionRef.current = mostVisibleId
        setActiveSection(mostVisibleId)
        window.dispatchEvent(new CustomEvent('scroll-section-change', { detail: { sectionId: mostVisibleId } }))
      }

      // Animate elements
      elements.current.forEach((elInfo) => {
        const section = sections.current.get(elInfo.sectionId)
        if (!section || !section.active) return

        const el = elInfo.element
        const rect = el.getBoundingClientRect()
        const elCenter = rect.top + rect.height / 2
        const viewportCenter = viewportHeight / 2
        const distanceFromCenter = (elCenter - viewportCenter) / viewportHeight
        const clampedDistance = Math.max(-1, Math.min(1, distanceFromCenter))

        switch (elInfo.type) {
          case 'reveal': {
            const velocityBoost = velocityFactor * 0.2
            const targetOpacity = Math.max(0, 1 - Math.abs(clampedDistance + velocityBoost) * 1.5)
            const targetTranslateY = (clampedDistance + velocityBoost * 0.5) * 60 * intensity + displacement * 0.1
            const targetBlur = Math.abs(clampedDistance + velocityBoost) * 3 * intensity

            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            elInfo.currentValues.translateY += (targetTranslateY - elInfo.currentValues.translateY) * SMOOTHING
            elInfo.currentValues.blur += (targetBlur - elInfo.currentValues.blur) * SMOOTHING

            el.style.transform = `translateY(${elInfo.currentValues.translateY}px) skewX(${skewX * 0.2}deg)`
            el.style.opacity = String(elInfo.currentValues.opacity)
            el.style.filter = `blur(${elInfo.currentValues.blur}px)`
            break
          }
          case 'parallax': {
            const speed = elInfo.speed || PARALLAX_BASE
            const velocityParallaxBoost = 1 + velocityFactor * 0.6
            const targetY = section.progress * viewportHeight * speed * 0.3 * velocityParallaxBoost + displacement * 0.05
            elInfo.currentValues.translateY += (targetY - elInfo.currentValues.translateY) * SMOOTHING
            el.style.transform = `translateY(${elInfo.currentValues.translateY}px) skewX(${skewX * 0.1}deg)`
            break
          }
          case 'scale': {
            const targetScale = 0.92 + section.progress * 0.08 * intensity
            const targetOpacity = Math.min(1, section.progress * 2 * intensity)
            elInfo.currentValues.scale += (targetScale - elInfo.currentValues.scale) * SMOOTHING
            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            el.style.transform = `scale(${elInfo.currentValues.scale}) skewX(${skewX * 0.08}deg)`
            el.style.opacity = String(elInfo.currentValues.opacity)
            break
          }
          case 'opacity': {
            const targetOpacity = Math.min(1, section.progress * 2 * intensity)
            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            el.style.opacity = String(elInfo.currentValues.opacity)
            break
          }
          case 'rotate': {
            const targetRotate = -3 + section.progress * 3
            elInfo.currentValues.rotate += (targetRotate - elInfo.currentValues.rotate) * SMOOTHING
            el.style.transform = `rotate(${elInfo.currentValues.rotate}deg) skewX(${skewX * 0.15}deg)`
            break
          }
          case 'blur': {
            const targetBlur = Math.max(0, 6 - section.progress * 6)
            const targetOpacity = section.progress * intensity
            elInfo.currentValues.blur += (targetBlur - elInfo.currentValues.blur) * SMOOTHING
            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            el.style.filter = `blur(${elInfo.currentValues.blur}px)`
            el.style.opacity = String(elInfo.currentValues.opacity)
            break
          }
        }
      })

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [prefersReducedMotion])

  return (
    <div ref={containerRef} className="scroll-experience">
      {children}
    </div>
  )
}
