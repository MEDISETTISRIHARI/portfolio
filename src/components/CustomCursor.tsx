'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type CursorState = 'default' | 'project' | 'image' | 'link' | 'cta' | 'nav' | 'object3d' | 'skill'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [state, setState] = useState<CursorState>('default')
  const [text, setText] = useState('')

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const ringTarget = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })

  const baseDotSize = 6
  const baseRingSize = 40

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  useEffect(() => {
    let raf: number

    const animate = () => {
      // Calculate velocity
      const dx = target.current.x - lastPos.current.x
      const dy = target.current.y - lastPos.current.y
      velocity.current.x = dx
      velocity.current.y = dy
      lastPos.current = { x: target.current.x, y: target.current.y }

      // Update dot position (fast follow)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x - baseDotSize / 2}px, ${target.current.y - baseDotSize / 2}px)`
      }

      // Update ring position (slower follow with lag)
      ringTarget.current.x += (target.current.x - ringTarget.current.x) * 0.12
      ringTarget.current.y += (target.current.y - ringTarget.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringTarget.current.x - baseRingSize / 2}px, ${ringTarget.current.y - baseRingSize / 2}px)`
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement
      const projectLink = targetEl.closest('a[href^="#work"], a[href*="/projects/"]')
      const imageLink = targetEl.closest('.cursor-image')
      const externalLink = targetEl.closest('a[target="_blank"], a[rel="noopener"]')
      const ctaButton = targetEl.closest('button, .cursor-cta')
      const navLink = targetEl.closest('nav a, .nav-link')
      const interactive3D = targetEl.closest('[data-cursor-3d]')
      const skillCategory = targetEl.closest('[data-cursor="skill"]')

      if (projectLink) {
        setState('project')
        setText('VIEW\nPROJECT')
      } else if (imageLink) {
        setState('image')
        setText('EXPLORE')
      } else if (externalLink) {
        setState('link')
        setText('OPEN')
      } else if (ctaButton) {
        setState('cta')
        setText('GO')
      } else if (navLink) {
        setState('nav')
        setText('')
      } else if (interactive3D) {
        setState('object3d')
        setText('')
      } else if (skillCategory) {
        setState('skill')
        setText('EXPLORE')
      } else {
        setState('default')
        setText('')
      }
    }

    document.addEventListener('mouseover', handleHover)
    return () => document.removeEventListener('mouseover', handleHover)
  }, [])

  const getCursorStyles = () => {
    switch (state) {
      case 'cta':
        return {
          dot: { width: 12, height: 12, backgroundColor: '#7dd3fc' },
          ring: { width: 64, height: 64, borderColor: 'rgba(125, 211, 252, 0.4)', borderWidth: 1 },
        }
      case 'project':
        return {
          dot: { width: 8, height: 8, backgroundColor: '#ffffff' },
          ring: { width: 80, height: 80, borderColor: 'rgba(255, 255, 255, 0.3)', borderWidth: 1 },
        }
      case 'nav':
        return {
          dot: { width: 4, height: 4, backgroundColor: '#ffffff' },
          ring: { width: 32, height: 32, borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1 },
        }
      case 'object3d':
        return {
          dot: { width: 10, height: 10, backgroundColor: '#7dd3fc' },
          ring: { width: 50, height: 50, borderColor: 'rgba(125, 211, 252, 0.2)', borderWidth: 1 },
        }
      case 'skill':
        return {
          dot: { width: 8, height: 8, backgroundColor: '#7dd3fc' },
          ring: { width: 56, height: 56, borderColor: 'rgba(125, 211, 252, 0.3)', borderWidth: 1 },
        }
      default:
        return {
          dot: { width: baseDotSize, height: baseDotSize, backgroundColor: '#ffffff' },
          ring: { width: baseRingSize, height: baseRingSize, borderColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1 },
        }
    }
  }

  const cursorStyles = getCursorStyles()

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const showText = state !== 'default' && text

  return (
    <>
      {/* Precision dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          width: cursorStyles.dot.width,
          height: cursorStyles.dot.height,
          backgroundColor: cursorStyles.dot.backgroundColor,
          transform: `translate(${target.current.x - baseDotSize / 2}px, ${target.current.y - baseDotSize / 2}px)`,
          transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
        }}
      />

      {/* Outer magnetic ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border mix-blend-difference"
        style={{
          width: cursorStyles.ring.width,
          height: cursorStyles.ring.height,
          borderColor: cursorStyles.ring.borderColor,
          borderWidth: cursorStyles.ring.borderWidth,
          transform: `translate(${ringTarget.current.x - baseRingSize / 2}px, ${ringTarget.current.y - baseRingSize / 2}px)`,
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, border-width 0.3s ease',
        }}
      />

      {/* Contextual text inside ring */}
      {showText && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
          style={{
            transform: `translate(${ringTarget.current.x - baseRingSize / 2}px, ${ringTarget.current.y - baseRingSize / 2}px)`,
            width: cursorStyles.ring.width,
            height: cursorStyles.ring.height,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="text-[10px] font-medium tracking-widest uppercase whitespace-pre-line text-center leading-tight text-text-primary">
            {text}
          </span>
        </div>
      )}
    </>
  )
}
