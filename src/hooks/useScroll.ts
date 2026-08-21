'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export interface ScrollState {
  scrollY: number
  direction: 'up' | 'down' | null
  progress: number
}

export function useScroll() {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    direction: null,
    progress: 0,
  })
  const rafRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const maxScroll = document.body.scrollHeight - window.innerHeight
        const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0

        let direction: 'up' | 'down' | null = null
        if (Math.abs(currentScrollY - lastScrollY.current) > 1) {
          direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
        }

        setState({
          scrollY: currentScrollY,
          direction,
          progress,
        })

        lastScrollY.current = currentScrollY
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const scrollTo = useCallback((y: number) => {
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  return { ...state, scrollTo }
}
