'use client'

import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import useWebGL from '@/hooks/useWebGL'
import { useState, useEffect } from 'react'

type HeroVisualProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  pointerDistance?: number
  visualMode?: string
  image?: string | null
  video?: string | null
  isMobile?: boolean
}

export default function HeroVisual({ mousePos, scrollProgress, pointerDistance, visualMode, image, video, isMobile = false }: HeroVisualProps) {
  const [mounted, setMounted] = useState(false)
  const isWebGLSupported = useWebGL()
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  const dpr = isMobile ? 1.5 : 2

  if (!mounted) {
    return (
      <div className="absolute inset-0 hero-canvas">
        <Canvas
          dpr={[1, dpr]}
          camera={{ position: [0, 0, 18], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene mousePos={mousePos} scrollProgress={scrollProgress} prefersReducedMotion={false} pointerDistance={pointerDistance} isMobile={false} />
        </Canvas>
      </div>
    )
  }

  if (!isWebGLSupported || prefersReducedMotion) {
    return (
      <div className="absolute inset-0 hero-canvas">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 hero-canvas pointer-events-none">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 18], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene mousePos={mousePos} scrollProgress={scrollProgress} prefersReducedMotion={prefersReducedMotion} pointerDistance={pointerDistance} isMobile={isMobile} />
      </Canvas>
      {/* Atmospheric overlay - subtle depth gradient */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(5,5,5,${0.2 + scrollProgress * 0.3}) 100%)`,
        }}
      />
      {/* Vignette for cinematic depth */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, transparent 0%, rgba(5,5,5,${0.3 + scrollProgress * 0.4}) 100%)`,
        }}
      />
    </div>
  )
}
