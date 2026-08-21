'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CameraRig from './CameraRig'

type SceneProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  prefersReducedMotion: boolean
  pointerDistance?: number
}

const PRIMARY_COLORS = [0x0d0d0d, 0x1a1a1a, 0x262626, 0x333333, 0x101010]
const ACCENT_COLOR = 0x7dcffd
const METALLIC_COLORS = [0x7dcffd, 0x5b8def, 0x3b82f6, 0x06b6d4, 0x0891b2]
const MATTE_COLORS = [0x0d0d0d, 0x1a1a1a, 0x262626, 0x333333, 0x101010]

function createPrimaryForm(index: number): THREE.Mesh {
  const isBlock = index % 4 !== 0
  const formIndex = index % 5

  let geometry: THREE.BufferGeometry
  let size: { w: number; h: number; d: number }

  if (isBlock) {
    // Beveled rectangular blocks / architectural slabs
    const baseWidth = 3 + formIndex * 1.5
    const baseHeight = 0.2 + formIndex * 0.1
    const baseDepth = 1.5 + formIndex * 0.5
    size = { w: baseWidth, h: baseHeight, d: baseDepth }
    geometry = new THREE.BoxGeometry(size.w, size.h, size.d)
    // Add bevel geometry for sophistication
    const bevelGeom = new THREE.BoxGeometry(size.w - 0.3, size.h - 0.3, size.d - 0.3)
    geometry = bevelGeom
  } else {
    // Rings / torus structures / elongated metallic frames
    const innerRadius = 0.5 + formIndex * 0.8
    const outerRadius = 1.5 + formIndex * 1.2
    geometry = new THREE.TorusGeometry(innerRadius, outerRadius - innerRadius, 16, 64)
  }

  const isMetallic = formIndex < 3
  const color = isMetallic ? METALLIC_COLORS[formIndex % METALLIC_COLORS.length] : MATTE_COLORS[formIndex % MATTE_COLORS.length]
  const metalness = isMetallic ? 0.8 : 0.1
  const roughness = isMetallic ? 0.05 : 0.9

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    flatShading: isMetallic ? false : true,
  })

  const mesh = new THREE.Mesh(geometry, material)

  // Sophisticated positioning - organized but organic
  const radius = 6 + (index % 3) * 2.5
  const polarAngle = (index * 0.523) + (Math.random() * 0.3)
  const azimuthalAngle = (index * 0.785) + (Math.random() * 0.3)
  const polarOffset = (index % 2 === 0) ? -1 : 1

  mesh.position.set(
    radius * Math.sin(polarAngle) * Math.cos(azimuthalAngle) * polarOffset,
    radius * Math.cos(polarAngle) * polarOffset,
    radius * 0.5 * Math.sin(azimuthalAngle) * polarOffset
  )

  // Elegant, subtle rotation
  mesh.rotation.set(
    (index * 0.2) + Math.random() * 0.1,
    (index * 0.3) + Math.random() * 0.1,
    (index * 0.15) + Math.random() * 0.1
  )

  // User data for interaction
  mesh.userData = {
    formIndex,
    isMetallic,
    driftSpeed: 0.001 + (Math.random() * 0.0005),
    rotMult: 0.5 + formIndex * 0.2,
    interactionStrength: 0,
  }

  return mesh
}

export default function Scene({ mousePos, scrollProgress, prefersReducedMotion, pointerDistance }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const gridRef = useRef<THREE.Group>(null)

  // =============================================
  // A. PRIMARY FORMS - Large architectural geometric forms
  // =============================================
  const primaryForms = useMemo(() => {
    const elements = []
    for (let i = 0; i < 8; i++) {
      const mesh = createPrimaryForm(i)
      elements.push(mesh)
    }
    return elements
  }, [])

  // =============================================
  // B. SECONDARY PARTICLES - Sparse field of tiny particles
  // =============================================
  const particleCount = 150
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // Sparse distribution with depth
      const radius = 5 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = radius * Math.cos(theta)
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi) * 0.5
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Subtle, sophisticated particle material
    const material = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
      depthWrite: false,
    })

    return { geometry, material }
  }, [])

  // =============================================
  // C. GRID - Subtle perspective grid, depth establisher
  // =============================================
  const gridGeometry = useMemo(() => {
    const positions: number[] = []
    const size = 30
    const divisions = 30
    const step = size / divisions
    const half = size / 2

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step
      positions.push(-half, -0.5, pos, half, -0.5, pos)
      positions.push(pos, -0.5, -half, pos, -0.5, half)
    }
    return positions
  }, [])

  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.02,
      depthWrite: false,
    })
  }, [])

  const gridGroup = useMemo(() => {
    const group = new THREE.Group()
    group.position.y = -0.4
    return group
  }, [])

  // Add grid lines to group
  useEffect(() => {
    if (gridRef.current) {
      const lines = new THREE.LineSegments(
        new THREE.BufferGeometry().setAttribute('position', new Float32Array(gridGeometry)),
        gridMaterial
      )
      gridRef.current.add(lines)
    }
  }, [gridGeometry, gridMaterial])

  // =============================================
  // D. HERO OBJECT - Recognizable centerpiece with slow rotation
  // =============================================
  const heroObject = useMemo(() => {
    // A striking central object - a combination form
    const geometry = new THREE.BoxGeometry(2.5, 0.5, 2.5)
    const material = new THREE.MeshStandardMaterial({
      color: 0x7dcffd,
      metalness: 0.9,
      roughness: 0.08,
      flatShading: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 1.2, 0)
    mesh.rotation.y = Math.PI / 4
    // Slow, elegant rotation
    mesh.userData = {
      heroSpeed: 0.008,
      interactionStrength: 0,
    }
    return mesh
  }, [])

  // =============================================
  // Initialize Three.js objects
  // =============================================
  const groupRefCallback = (group: THREE.Group | null) => {
    groupRef.current = group
  }

  const particlesRefCallback = (points: THREE.Points | null) => {
    particlesRef.current = points
  }

  // =============================================
  // Animate all elements
  // =============================================
  useFrame((state) => {
    if (prefersReducedMotion) return

    const t = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Primary forms - organized rotation with subtle drift
      groupRef.current.children.forEach((child, i) => {
        if (child.userData.formIndex !== undefined) {
          const floatSpeed = child.userData.driftSpeed
          const rotMult = child.userData.rotMult

          // Continuous gentle rotation
          child.rotation.y += 0.001 * rotMult
          child.rotation.x += 0.0005 * rotMult
          child.position.y += Math.sin(t * floatSpeed + i * 0.5) * 0.001
        }
      })
    }

    // Hero object - slow elegant rotation
    if (heroObject) {
      heroObject.rotation.y += 0.008
      heroObject.position.y = 1.2 + Math.sin(t * 0.5) * 0.02
    }

    // Secondary particles - subtle rotation and pointer interaction
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.01
      particlesRef.current.rotation.x = t * 0.005

      // React to pointer distance if available
      if (pointerDistance !== undefined) {
        const strength = Math.max(0, 1 - pointerDistance / 10)
        particlesRef.current.rotation.y += strength * 0.002
      }
    }

    // Grid subtle reaction
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        if (child.isGridLine) {
          child.rotation.y += 0.0001
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Fog for depth - softer, more cinematic */}
      <fog attach="fog" args={['#050505', 15, 50]} />

      {/* Ambient light - more cinematic */}
      <ambientLight intensity={0.15} />

      {/* Key light - stronger, more directional */}
      <directionalLight position={[10, 12, 8]} intensity={0.4} />
      <directionalLight position={[-8, 5, -6]} intensity={0.3} />
      <directionalLight position={[0, 2, -10]} intensity={0.15} />

      {/* Hemisphere light - natural ambient */}
      <hemisphereLight intensity={0.25} />

      {/* Camera rig for mouse and scroll interaction */}
      <CameraRig
        mousePos={mousePos}
        scrollProgress={scrollProgress}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Hero object - centerpiece */}
      {heroObject && <primitive object={heroObject} />}

      {/* Primary forms - organized architectural objects */}
      <group>
        {primaryForms.map((mesh, i) => (
          <primitive key={i} object={mesh} />
        ))}
      </group>

      {/* Secondary particles - sparse, depth-aware field */}
      <points ref={particlesRef} geometry={particles.geometry} material={particles.material} />

      {/* Grid - subtle perspective, depth establisher */}
      {pointerDistance !== undefined && pointerDistance < 8 && (
        <lineSegments ref={gridRef} geometry={new THREE.BufferGeometry().setAttribute('position', new Float32Array(gridGeometry))} material={gridMaterial} />
      )}
    </group>
  )
}