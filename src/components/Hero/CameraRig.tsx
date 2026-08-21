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
const LERP_ACTIVE = 0.02
const SPRING_FREQUENCY = 0.01
const SPRING_DAMPING = 0.9

export default function CameraRig({ mousePos, scrollProgress, prefersReducedMotion, pointerDistance }: CameraRigProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  // Camera state for smooth interpolation
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
  })

  useFrame(() => {
    if (!cameraRef.current) return
    const camera = cameraRef.current

    if (prefersReducedMotion) {
      // Minimal movement in reduced motion
      camera.position.x += (mousePos.x * 0.2 - camera.position.x) * 0.005
      camera.position.y += (mousePos.y * 0.1 - camera.position.y) * 0.005
      camera.position.z += (18 - scrollProgress * 1 - camera.position.z) * 0.005
      camera.lookAt(0, 0, 0)
      return
    }

    // Layer 1: Slow idle movement (continuous gentle drift)
    const idleX = Math.sin(state.current.idleTick) * 0.1
    const idleY = Math.cos(state.current.idleTick * 0.7) * 0.08
    state.current.idleTick = (state.current.idleTick || 0) + 0.016

    // Layer 2: Pointer-based parallax with damping
    const pointerFactor = pointerDistance !== undefined ? Math.max(0, 1 - pointerDistance / 15) : 1
    const pointerX = mousePos.x * (0.5 * pointerFactor)
    const pointerY = -mousePos.y * (0.3 * pointerFactor)

    // Layer 3: Scroll-based movement
    const scrollZ = 18 - scrollProgress * 4

    // Layer 4: Micro response during interaction
    const targetX = pointerX
    const targetY = pointerY
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

    // Dynamic lighting adjustment based on pointer proximity
    if (pointerDistance !== undefined) {
      const proximityFactor = Math.max(0, 1 - pointerDistance / 10)
      // Subtle color temperature shift, not flashlight behavior
      // This is handled in the scene lighting, not the camera
    }

    camera.lookAt(0, 0, 0)
  })

  // GSAP-powered section transition helper
  const transitionToSection = (targetY: number, duration = 1.5) => {
    gsap.to(cameraRef.current.position, {
      y: targetY,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        cameraRef.current.lookAt(0, 0, 0)
      },
    })
  }

  return <perspectiveCamera ref={cameraRef} fov={55} position={[0, 0, 18]} />
}