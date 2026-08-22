'use client'

import { useEffect, useState } from 'react'

type ProjectProgressProps = {
  current: number
  total: number
}

export default function ProjectProgress({ current, total }: ProjectProgressProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 400)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-text-muted/60 font-mono tracking-widest">
          {String(current).padStart(2, '0')}
        </span>
        <div className="w-px h-6 bg-border-default" />
        <span className="text-[10px] text-text-muted/40 font-mono tracking-widest">
          {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
