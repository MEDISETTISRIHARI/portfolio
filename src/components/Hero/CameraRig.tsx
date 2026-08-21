'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type CameraRigProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  prefersReducedMotion: boolean
}

export default function CameraRig({ mousePos, scrollProgress, prefersReducedMotion }: CameraRigProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(() => {
    if (!cameraRef.current) return

    const lerpFactor = prefersReducedMotion ? 0.005 : 0.02
    const targetX = mousePos.x * (prefersReducedMotion ? 0.2 : 0.5)
    const targetY = mousePos.y * (prefersReducedMotion ? 0.1 : 0.3)
    const targetZ = 18 - scrollProgress * (prefersReducedMotion ? 1 : 4)

    cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * lerpFactor
    cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * lerpFactor
    cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * lerpFactor

    cameraRef.current.lookAt(0, 0, 0)
  })

  return <perspectiveCamera ref={cameraRef} fov={55} position={[0, 0, 18]} />
}