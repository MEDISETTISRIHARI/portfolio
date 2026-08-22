'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'

type CameraRigProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  prefersReducedMotion: boolean
  pointerDistance?: number
}

const LERP_RELAXED = 0.008
const SPRING_FREQUENCY = 0.01
const SPRING_DAMPING = 0.9

export default function CameraRig({ mousePos, scrollProgress, prefersReducedMotion, pointerDistance }: CameraRigProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  const state = useRef({
    targetX: 0,
    targetY: 0,
    targetZ: 18,
    currentX: 0,
    currentY: 0,
    currentZ: 18,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    idleTick: 0,
    prevScrollProgress: 0,
    scrollVelocity: 0,
  })

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

  useFrame(() => {
    if (!cameraRef.current) return
    const camera = cameraRef.current

    if (prefersReducedMotion) {
      camera.position.x += (mousePos.x * 0.2 - camera.position.x) * 0.005
      camera.position.y += (mousePos.y * 0.1 - camera.position.y) * 0.005
      camera.position.z += (18 - scrollProgress * 1 - camera.position.z) * 0.005
      camera.lookAt(0, 0, 0)
      return
    }

    // Layer 1: Slow idle movement (continuous gentle drift)
    state.current.idleTick += 0.016
    const idleX = Math.sin(state.current.idleTick * 0.8) * 0.12
    const idleY = Math.cos(state.current.idleTick * 0.6) * 0.08

    // Layer 2: Pointer-based parallax with damping (mobile amplitude reduced)
    const pointerAmp = isMobile ? 0.25 : 0.5
    const pointerFactor = pointerDistance !== undefined ? Math.max(0, 1 - pointerDistance / 15) : 1
    const pointerX = mousePos.x * (pointerAmp * pointerFactor)
    const pointerY = -mousePos.y * (pointerAmp * 0.6 * pointerFactor)

    // Calculate scroll velocity for Layer 5 micro response
    state.current.scrollVelocity = (scrollProgress - state.current.prevScrollProgress) * 60
    state.current.prevScrollProgress = scrollProgress

    // Layer 3: Scroll-based movement (composition change)
    const scrollZ = 18 - scrollProgress * 3

    // Layer 4: Micro response during interaction
    const targetX = pointerX + idleX
    const targetY = pointerY + idleY
    const targetZ = scrollZ

    // Spring-based damping for smooth motion
    state.current.velocityX += (targetX - state.current.currentX) * SPRING_FREQUENCY
    state.current.velocityY += (targetY - state.current.currentY) * SPRING_FREQUENCY
    state.current.velocityZ += (targetZ - state.current.currentZ) * SPRING_FREQUENCY

    state.current.velocityX *= SPRING_DAMPING
    state.current.velocityY *= SPRING_DAMPING
    state.current.velocityZ *= SPRING_DAMPING

    state.current.currentX += state.current.velocityX
    state.current.currentY += state.current.velocityY
    state.current.currentZ += state.current.velocityZ

    // Apply with relaxed lerp for final smoothing
    camera.position.x += (state.current.currentX - camera.position.x) * LERP_RELAXED
    camera.position.y += (state.current.currentY - camera.position.y) * LERP_RELAXED
    camera.position.z += (state.current.currentZ - camera.position.z) * LERP_RELAXED

    camera.lookAt(0, 0, 0)
  })

  return <perspectiveCamera ref={cameraRef} fov={55} position={[0, 0, 18]} />
}