'use client'

import { useState, useEffect } from 'react'

type HeroMetadataProps = {
  className?: string
  onRequestOrientation?: () => void
}

export default function HeroMetadata({ className, onRequestOrientation }: HeroMetadataProps) {
  const [showOrientation, setShowOrientation] = useState(false)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const hasOrientation = typeof DeviceOrientationEvent !== 'undefined'
    setShowOrientation(isMobile && hasOrientation)
  }, [])

  return (
    <div className={`hero-metadata border-t border-border-subtle pt-8 ${className || ''}`}>
      <div className="container mx-auto px-6 flex items-center justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <span className="caption text-text-muted">SCROLL TO EXPLORE</span>
          <span className="w-px h-3.5 bg-border-default" />
        </div>
        <div className="flex items-center gap-8">
          {showOrientation && onRequestOrientation && (
            <button
              onClick={onRequestOrientation}
              className="caption text-text-muted hover:text-accent transition-colors duration-300"
            >
              ENABLE MOTION
            </button>
          )}
          <span className="caption text-text-muted">2026</span>
          <span className="caption text-text-muted">INDIA</span>
        </div>
      </div>
    </div>
  )
}