'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CameraRig from './CameraRig'

type SceneProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  prefersReducedMotion: boolean
}

// =============================================
// Cinematic 3D Scene
// =============================================
export default function Scene({ mousePos, scrollProgress, prefersReducedMotion }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Create cinematic floating elements
  const floatingElements = useMemo(() => {
    const elements = []
    for (let i = 0; i < 12; i++) {
      const isBox = Math.random() > 0.5
      let geometry: THREE.BufferGeometry
      if (isBox) {
        const w = Math.random() * 1.5 + 0.5
        const h = Math.random() * 0.1 + 0.05
        const d = Math.random() * 1.5 + 0.5
        geometry = new THREE.BoxGeometry(w, h, d)
      } else {
        const radius = Math.random() * 0.8 + 0.2
        geometry = new THREE.TorusGeometry(radius, 0.02, 16, 32)
      }
      const isAccent = Math.random() > 0.8
      const material = new THREE.MeshStandardMaterial({
        color: isAccent ? 0x7dcffd : 0xffffff,
        metalness: 0.95,
        roughness: 0.05,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10 - 4
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      mesh.userData = {
        floatSpeed: Math.random() * 0.2 + 0.1,
        floatOffset: Math.random() * Math.PI * 2,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
          z: (Math.random() - 0.5) * 0.05,
        },
      }
      elements.push(mesh)
    }
    return elements
  }, [])

  // Create subtle particles
  const particles = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    })
    return { geometry, material }
  }, [])

  // Create ground grid
  const grid = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions: number[] = []
    const size = 20
    const divisions = 20
    const step = size / divisions
    const half = size / 2
    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step
      positions.push(-half, -4, pos, half, -4, pos)
      positions.push(pos, -4, -half, pos, -4, half)
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
    })
    return { geometry, material }
  }, [])

  // Animate floating elements
  useFrame((state) => {
    if (prefersReducedMotion) return
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        const userData = (child as THREE.Mesh).userData as {
          floatSpeed: number
          floatOffset: number
          rotSpeed: { x: number; y: number; z: number }
        }
        if (userData.floatSpeed) {
          child.position.y += Math.sin(t * userData.floatSpeed + userData.floatOffset) * 0.002
          child.rotation.x += userData.rotSpeed.x * 0.01
          child.rotation.y += userData.rotSpeed.y * 0.01
        }
      })
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02
      particlesRef.current.rotation.x = t * 0.01
    }
  })

  return (
    <group>
      {/* Fog for depth */}
      <fog attach="fog" args={['#050505', 10, 40]} />

      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Key light */}
      <directionalLight position={[5, 10, 7.5]} intensity={0.6} />

      {/* Fill light */}
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />

      {/* Hemisphere light for natural ambient */}
      <hemisphereLight intensity={0.4} />

      {/* Camera rig for mouse and scroll interaction */}
      <CameraRig mousePos={mousePos} scrollProgress={scrollProgress} prefersReducedMotion={prefersReducedMotion} />

      {/* Ground grid */}
      <lineSegments geometry={grid.geometry} material={grid.material} />

      {/* Floating metallic elements */}
      <group ref={groupRef}>
        {floatingElements.map((mesh, i) => (
          <primitive key={i} object={mesh} />
        ))}
      </group>

      {/* Subtle particles */}
      <points ref={particlesRef} geometry={particles.geometry} material={particles.material} />
    </group>
  )
}