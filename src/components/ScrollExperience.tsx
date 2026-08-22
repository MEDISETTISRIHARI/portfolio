'use client'

import { useEffect, useRef, useState } from 'react'

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

  // Animation loop
  useEffect(() => {
    let raf: number

    const animate = () => {
      const state = scrollState.current
      const viewportHeight = state.viewportHeight
      const scrollY = state.scrollY

      sections.current.forEach((section) => {
        const sectionTop = section.top
        const sectionBottom = section.bottom
        const sectionHeight = section.height

        const visibleTop = Math.max(scrollY, sectionTop)
        const visibleBottom = Math.min(scrollY + viewportHeight, sectionBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        section.visibility = sectionHeight > 0 ? visibleHeight / sectionHeight : 0

        const distanceFromTop = scrollY - sectionTop
        const scrollableDistance = sectionHeight + viewportHeight
        section.progress = scrollableDistance > 0 ? Math.max(0, Math.min(1, distanceFromTop / scrollableDistance)) : 0
      })

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
      }

      elements.current.forEach((elInfo) => {
        const section = sections.current.get(elInfo.sectionId)
        if (!section) return

        const el = elInfo.element
        const rect = el.getBoundingClientRect()
        const elCenter = rect.top + rect.height / 2
        const viewportCenter = viewportHeight / 2
        const distanceFromCenter = (elCenter - viewportCenter) / viewportHeight
        const clampedDistance = Math.max(-1, Math.min(1, distanceFromCenter))

        switch (elInfo.type) {
          case 'reveal': {
            const targetOpacity = Math.max(0, 1 - Math.abs(clampedDistance) * 1.5)
            const targetTranslateY = clampedDistance * 60
            const targetBlur = Math.abs(clampedDistance) * 4

            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            elInfo.currentValues.translateY += (targetTranslateY - elInfo.currentValues.translateY) * SMOOTHING
            elInfo.currentValues.blur += (targetBlur - elInfo.currentValues.blur) * SMOOTHING

            el.style.opacity = String(elInfo.currentValues.opacity)
            el.style.transform = `translateY(${elInfo.currentValues.translateY}px)`
            el.style.filter = `blur(${elInfo.currentValues.blur}px)`
            break
          }
          case 'parallax': {
            const speed = elInfo.speed || PARALLAX_BASE
            const targetY = section.progress * viewportHeight * speed * 0.3
            elInfo.currentValues.translateY += (targetY - elInfo.currentValues.translateY) * SMOOTHING
            el.style.transform = `translateY(${elInfo.currentValues.translateY}px)`
            break
          }
          case 'scale': {
            const targetScale = 0.85 + section.progress * 0.15
            const targetOpacity = section.progress
            elInfo.currentValues.scale += (targetScale - elInfo.currentValues.scale) * SMOOTHING
            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            el.style.transform = `scale(${elInfo.currentValues.scale})`
            el.style.opacity = String(elInfo.currentValues.opacity)
            break
          }
          case 'opacity': {
            const targetOpacity = Math.min(1, section.progress * 2)
            elInfo.currentValues.opacity += (targetOpacity - elInfo.currentValues.opacity) * SMOOTHING
            el.style.opacity = String(elInfo.currentValues.opacity)
            break
          }
          case 'rotate': {
            const targetRotate = -5 + section.progress * 5
            elInfo.currentValues.rotate += (targetRotate - elInfo.currentValues.rotate) * SMOOTHING
            el.style.transform = `rotate(${elInfo.currentValues.rotate}deg)`
            break
          }
          case 'blur': {
            const targetBlur = Math.max(0, 8 - section.progress * 8)
            const targetOpacity = section.progress
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
  }, [])

  return (
    <div ref={containerRef} className="scroll-experience">
      {children}
    </div>
  )
}
