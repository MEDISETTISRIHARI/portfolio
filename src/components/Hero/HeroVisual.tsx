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
}

export default function HeroVisual({ mousePos, scrollProgress, pointerDistance, visualMode, image, video }: HeroVisualProps) {
  const [mounted, setMounted] = useState(false)
  const isWebGLSupported = useWebGL()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="absolute inset-0 hero-canvas">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 18], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene mousePos={mousePos} scrollProgress={scrollProgress} prefersReducedMotion={false} pointerDistance={pointerDistance} />
        </Canvas>
      </div>
    )
  }

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
        dpr={[1, 2]}
        camera={{ position: [0, 0, 18], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mousePos={mousePos} scrollProgress={scrollProgress} prefersReducedMotion={prefersReducedMotion} pointerDistance={pointerDistance} />
      </Canvas>
    </div>
  )
}