'use client'

import { useState, useEffect } from 'react'

type HeroMetadataProps = {
  className?: string
  onRequestOrientation?: () => void
}

export default function HeroMetadata({ className, onRequestOrientation }: HeroMetadataProps) {
  const [showOrientation, setShowOrientation] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const hasOrientation = typeof DeviceOrientationEvent !== 'undefined'
    setShowOrientation(window.innerWidth < 768 && hasOrientation)
  }, [])

  return (
    <div className={`hero-metadata ${className || ''}`}>
      <div className="flex items-center justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center gap-6">
          <span className="caption text-text-muted tracking-widest">01 / 04</span>
          <span className="w-px h-3.5 bg-border-default" />
          <span className="caption text-text-muted tracking-widest hidden sm:inline">CREATIVE WEB DESIGNER & DEVELOPER</span>
        </div>
        <div className="flex items-center gap-6">
          {showOrientation && onRequestOrientation && (
            <button
              onClick={onRequestOrientation}
              className="caption text-text-muted hover:text-accent transition-colors duration-300"
            >
              ENABLE MOTION
            </button>
          )}
          <span className="caption text-text-muted tracking-widest">INDIA</span>
          <span className="caption text-text-muted tracking-widest">2026</span>
        </div>
      </div>
    </div>
  )
}
