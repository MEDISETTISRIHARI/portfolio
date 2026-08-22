'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type TextRevealProps = {
  text?: string
  lines?: string[]
  variant?: 'fade' | 'clip' | 'blur' | 'word' | 'character'
  delay?: number
  stagger?: number
  className?: string
  children?: React.ReactNode
}

export default function TextReveal({
  text,
  lines,
  variant = 'fade',
  delay = 0,
  stagger = 0.1,
  className = '',
  children,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const elements = containerRef.current!.children

      if (variant === 'clip') {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            stagger,
            ease: 'power3.out',
            delay,
          }
        )
      } else if (variant === 'fade') {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger,
            ease: 'power2.out',
            delay,
          }
        )
      } else if (variant === 'blur') {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger,
            ease: 'power2.out',
            delay,
          }
        )
      } else if (variant === 'word' || variant === 'character') {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: stagger * 0.5,
            ease: 'power2.out',
            delay,
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [variant, stagger, delay])

  if (lines && lines.length > 0) {
    return (
      <div ref={containerRef} className={`text-reveal ${className}`}>
        {lines.map((line, i) => (
          <div key={i} className={variant === 'clip' ? 'overflow-hidden' : ''}>
            {line}
          </div>
        ))}
      </div>
    )
  }

  if (text) {
    if (variant === 'word') {
      const words = text.split(' ')
      return (
        <div ref={containerRef} className={`text-reveal ${className}`}>
          {words.map((word, i) => (
            <span key={i} className="inline-block" style={{ marginRight: '0.25em' }}>
              {word}
            </span>
          ))}
        </div>
      )
    }

    if (variant === 'character') {
      const chars = text.split('')
      return (
        <div ref={containerRef} className={`text-reveal ${className}`}>
          {chars.map((char, i) => (
            <span key={i} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      )
    }

    return (
      <div ref={containerRef} className={`text-reveal ${className}`}>
        <div>{text}</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`text-reveal ${className}`}>
      {children}
    </div>
  )
}
