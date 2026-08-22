'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type VisualStyle = {
  base: string
  accent: string
  shape: string
  pattern: string
  movement: string
}

const VISUAL_STYLES: Record<string, VisualStyle> = {
  'Insurance': {
    base: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #0a0a0a 100%)',
    accent: '#7dcffd',
    shape: 'radial',
    pattern: 'grid',
    movement: 'drift',
  },
  'Fintech': {
    base: 'linear-gradient(135deg, #0a0a0a 0%, #0c1929 50%, #0a0a0a 100%)',
    accent: '#5b8def',
    shape: 'linear',
    pattern: 'lines',
    movement: 'slide',
  },
  'Creative Agency': {
    base: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #0a0a0a 100%)',
    accent: '#7dd3fc',
    shape: 'conic',
    pattern: 'dots',
    movement: 'rotate',
  },
  'Architecture': {
    base: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
    accent: '#9ca3af',
    shape: 'grid',
    pattern: 'structure',
    movement: 'pulse',
  },
  'default': {
    base: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
    accent: '#7dcffd',
    shape: 'radial',
    pattern: 'grid',
    movement: 'drift',
  },
}

function getVisualStyle(category?: string): VisualStyle {
  if (!category) return VISUAL_STYLES['default']
  return VISUAL_STYLES[category] || VISUAL_STYLES['default']
}

type ProjectVisualProps = {
  category?: string
  title: string
  isActive: boolean
}

export default function ProjectVisual({ category, title, isActive }: ProjectVisualProps) {
  const visualRef = useRef<HTMLDivElement>(null)
  const style = getVisualStyle(category)

  useEffect(() => {
    if (!visualRef.current) return
    const el = visualRef.current

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(el, { opacity: 0, scale: 0.98 })

      // Animate in when active
      if (isActive) {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
        })
      }
    }, visualRef)

    return () => ctx.revert()
  }, [isActive])

  useEffect(() => {
    if (!visualRef.current) return
    const el = visualRef.current

    const ctx = gsap.context(() => {
      const shapeEl = el.querySelector('.project-visual-shape')
      const patternEl = el.querySelector('.project-visual-pattern')
      const lineEl = el.querySelector('.project-visual-line')
      const titleEl = el.querySelector('.project-visual-title')

      if (shapeEl) {
        gsap.to(shapeEl, {
          x: isActive ? '0%' : '-5%',
          scale: isActive ? 1 : 0.9,
          duration: 1.4,
          ease: 'power3.out',
        })
      }

      if (patternEl) {
        gsap.to(patternEl, {
          opacity: isActive ? 0.6 : 0.2,
          x: isActive ? '0%' : '3%',
          duration: 1.6,
          ease: 'power2.out',
        })
      }

      if (lineEl) {
        gsap.to(lineEl, {
          scaleX: isActive ? 1 : 0,
          duration: 1,
          ease: 'power3.out',
        })
      }

      if (titleEl) {
        gsap.to(titleEl, {
          opacity: isActive ? 0.15 : 0,
          y: isActive ? 0 : 20,
          duration: 1,
          ease: 'power2.out',
        })
      }
    }, visualRef)

    return () => ctx.revert()
  }, [isActive])

  const renderShape = () => {
    switch (style.shape) {
      case 'radial':
        return (
          <div
            className="project-visual-shape absolute inset-0 transition-all duration-700"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${style.accent}18 0%, transparent 60%)`,
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        )
      case 'linear':
        return (
          <div
            className="project-visual-shape absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(45deg, transparent 40%, ${style.accent}12 50%, transparent 60%)`,
              transform: isActive ? 'translateX(10%)' : 'translateX(0)',
            }}
          />
        )
      case 'conic':
        return (
          <div
            className="project-visual-shape absolute inset-0 transition-all duration-700"
            style={{
              background: `conic-gradient(from 45deg at 50% 50%, transparent 0deg, ${style.accent}08 90deg, transparent 180deg)`,
              transform: isActive ? 'rotate(45deg) scale(1.2)' : 'rotate(0deg) scale(1)',
            }}
          />
        )
      case 'grid':
        return (
          <div
            className="project-visual-shape absolute inset-0 transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(${style.accent}08 1px, transparent 1px), linear-gradient(90deg, ${style.accent}08 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        )
      default:
        return null
    }
  }

  const renderPattern = () => {
    switch (style.pattern) {
      case 'grid':
        return (
          <div
            className="project-visual-pattern absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        )
      case 'lines':
        return (
          <div
            className="project-visual-pattern absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, ${style.accent}08 40px, ${style.accent}08 41px)`,
            }}
          />
        )
      case 'dots':
        return (
          <div
            className="project-visual-pattern absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, ${style.accent}15 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        )
      case 'structure':
        return (
          <div
            className="project-visual-pattern absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${style.accent}10 1px, transparent 1px), linear-gradient(90deg, ${style.accent}10 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={visualRef}
      className="project-visual absolute inset-0 overflow-hidden"
      style={{
        background: style.base,
      }}
    >
      {/* Depth layer - base */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      {/* Shape layer */}
      {renderShape()}

      {/* Pattern layer */}
      {renderPattern()}

      {/* Animated accent line */}
      <div
        className="project-visual-line absolute top-0 left-0 h-px origin-left"
        style={{
          width: '100%',
          background: `linear-gradient(90deg, transparent, ${style.accent}60, transparent)`,
          transform: 'scaleX(0)',
        }}
      />

      {/* Bottom accent line */}
      <div
        className="project-visual-line absolute bottom-0 left-0 h-px origin-left"
        style={{
          width: '100%',
          background: `linear-gradient(90deg, transparent, ${style.accent}40, transparent)`,
          transform: 'scaleX(0)',
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 transition-all duration-700"
        style={{
          opacity: isActive ? 0.2 : 0,
          background: `linear-gradient(135deg, transparent 50%, ${style.accent}15 50%)`,
        }}
      />

      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${style.accent}10 0%, transparent 70%)`,
          opacity: isActive ? 0.5 : 0.1,
          transform: `translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`,
        }}
      />

      {/* Title watermark */}
      <div
        className="project-visual-title absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span
          className="font-display text-[clamp(2rem,5vw,5rem)] tracking-tight select-none"
          style={{
            color: style.accent,
            opacity: 0.15,
            transform: 'translateY(20px)',
          }}
        >
          {title}
        </span>
      </div>
    </div>
  )
}
