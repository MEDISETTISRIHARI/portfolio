'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type CameraRigProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  prefersReducedMotion: boolean
  pointerDistance?: number
  isMobile?: boolean
}

const LERP_RELAXED = 0.006
const SPRING_FREQUENCY = 0.008
const SPRING_DAMPING = 0.92

export default function CameraRig({ mousePos, scrollProgress, prefersReducedMotion, pointerDistance, isMobile = false }: CameraRigProps) {
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
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
    targetLookAtX: 0,
    targetLookAtY: 0,
    targetLookAtZ: 0,
  })

  useFrame(() => {
    if (!cameraRef.current) return
    const camera = cameraRef.current

    if (prefersReducedMotion) {
      camera.position.x += (mousePos.x * 0.15 - camera.position.x) * 0.004
      camera.position.y += (mousePos.y * 0.08 - camera.position.y) * 0.004
      camera.position.z += (18 - scrollProgress * 1 - camera.position.z) * 0.004
      camera.lookAt(0, 0, 0)
      return
    }

    // Layer 1: Slow idle movement (organic drift using Lissajous-like curves)
    state.current.idleTick += 0.012
    const idleX = Math.sin(state.current.idleTick * 0.7) * 0.15 + Math.cos(state.current.idleTick * 0.3) * 0.05
    const idleY = Math.cos(state.current.idleTick * 0.5) * 0.1 + Math.sin(state.current.idleTick * 0.4) * 0.04

    // Layer 2: Pointer-based parallax with damping (mobile amplitude reduced)
    const pointerAmp = isMobile ? 0.2 : 0.45
    const pointerFactor = pointerDistance !== undefined ? Math.max(0, 1 - pointerDistance / 12) : 1
    const pointerX = mousePos.x * (pointerAmp * pointerFactor)
    const pointerY = -mousePos.y * (pointerAmp * 0.7 * pointerFactor)

    // Calculate scroll velocity for micro response
    state.current.scrollVelocity = (scrollProgress - state.current.prevScrollProgress) * 60
    state.current.prevScrollProgress = scrollProgress

    // Layer 3: Scroll-based movement (composition change)
    // Camera pulls back slightly and shifts down as user scrolls
    const scrollZ = 18 - scrollProgress * 2.5
    const scrollY = -scrollProgress * 1.5

    // Layer 4: Scroll velocity micro response
    const scrollMicroX = state.current.scrollVelocity * 0.02

    // Layer 5: Scroll-driven subtle scene rotation
    const scrollRotationY = scrollProgress * 0.3
    const scrollRotationX = scrollProgress * 0.1

    // Combine all layers
    const targetX = pointerX + idleX + scrollMicroX
    const targetY = pointerY + idleY + scrollY
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

    // Subtle look-at drift for cinematic feel
    state.current.targetLookAtX = mousePos.x * 0.3 + scrollRotationY * 0.1
    state.current.targetLookAtY = -mousePos.y * 0.2 - scrollRotationX * 0.1
    state.current.lookAtX += (state.current.targetLookAtX - state.current.lookAtX) * 0.02
    state.current.lookAtY += (state.current.targetLookAtY - state.current.lookAtY) * 0.02
    camera.lookAt(state.current.lookAtX, state.current.lookAtY, 0)
  })

  return <perspectiveCamera ref={cameraRef} fov={55} position={[0, 0, 18]} />
}
