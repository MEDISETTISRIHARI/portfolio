'use client'

import { useState, useEffect, useRef } from 'react'

type CursorState = 'default' | 'project' | 'image' | 'link' | 'cta'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [state, setState] = useState<CursorState>('default')
  const [text, setText] = useState('')

  const cursorRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const sizeRef = useRef(6)
  const baseSize = 6

  useEffect(() => {
    sizeRef.current = state === 'default' ? baseSize : 40
  }, [state])

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
      const dx = target.current.x - current.current.x
      const dy = target.current.y - current.current.y

      current.current.x += dx * 0.15
      current.current.y += dy * 0.15

      if (cursorRef.current) {
        const size = sizeRef.current
        const scale = size / baseSize
        cursorRef.current.style.transform = `translate(${current.current.x - baseSize / 2}px, ${current.current.y - baseSize / 2}px) scale(${scale})`
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const projectLink = target.closest('a[href^="#work"], a[href*="/projects/"]')
      const imageLink = target.closest('.cursor-image')
      const externalLink = target.closest('a[target="_blank"], a[rel="noopener"]')
      const ctaButton = target.closest('button, .cursor-cta')

      if (projectLink) {
        setState('project')
        setText('VIEW')
      } else if (imageLink) {
        setState('image')
        setText('EXPLORE')
      } else if (externalLink) {
        setState('link')
        setText('OPEN')
      } else if (ctaButton) {
        setState('cta')
        setText('GO')
      } else {
        setState('default')
        setText('')
      }
    }

    document.addEventListener('mouseover', handleHover)
    return () => document.removeEventListener('mouseover', handleHover)
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const showText = state !== 'default' && text

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${state === 'default' ? 'bg-text-primary' : 'bg-text-primary text-background'}`}>
        {showText && (
          <span className="text-[10px] font-medium tracking-widest uppercase whitespace-nowrap">
            {text}
          </span>
        )}
      </div>
    </div>
  )
}
