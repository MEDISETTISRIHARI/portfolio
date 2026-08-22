'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CameraRig from './CameraRig'

type SceneProps = {
  mousePos: { x: number; y: number }
  scrollProgress: number
  prefersReducedMotion: boolean
  pointerDistance?: number
  isMobile?: boolean
}

const METALLIC_COLORS = [0x7dcffd, 0x5b8def, 0x3b82f6, 0x06b6d4, 0x0891b2]
const MATTE_COLORS = [0x0d0d0d, 0x1a1a1a, 0x262626, 0x333333, 0x101010]

function createPrimaryForm(index: number, depthLayer: 'background' | 'midground' | 'foreground'): THREE.Mesh {
  const isBlock = index % 4 !== 0
  const formIndex = index % 5

  let geometry: THREE.BufferGeometry

  if (isBlock) {
    const baseWidth = 3 + formIndex * 1.5
    const baseHeight = 0.2 + formIndex * 0.1
    const baseDepth = 1.5 + formIndex * 0.5
    geometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth)
  } else {
    const innerRadius = 0.5 + formIndex * 0.8
    const outerRadius = 1.5 + formIndex * 1.2
    geometry = new THREE.TorusGeometry(innerRadius, outerRadius - innerRadius, 16, 64)
  }

  const isMetallic = formIndex < 3
  const color = isMetallic ? METALLIC_COLORS[formIndex % METALLIC_COLORS.length] : MATTE_COLORS[formIndex % MATTE_COLORS.length]
  const metalness = isMetallic ? 0.85 : 0.05
  const roughness = isMetallic ? 0.12 : 0.95

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    flatShading: isMetallic ? false : true,
    transparent: true,
    opacity: depthLayer === 'background' ? 0.5 : depthLayer === 'foreground' ? 0.9 : 0.7,
  })

  const mesh = new THREE.Mesh(geometry, material)

  // Depth-based positioning
  const depthFactor = depthLayer === 'background' ? 2.5 : depthLayer === 'foreground' ? 0.7 : 1.2
  const radius = (6 + (index % 3) * 2.5) * depthFactor
  const polarAngle = (index * 0.523) + (Math.random() * 0.3)
  const azimuthalAngle = (index * 0.785) + (Math.random() * 0.3)
  const polarOffset = (index % 2 === 0) ? -1 : 1

  mesh.position.set(
    radius * Math.sin(polarAngle) * Math.cos(azimuthalAngle) * polarOffset,
    radius * Math.cos(polarAngle) * polarOffset,
    radius * 0.5 * Math.sin(azimuthalAngle) * polarOffset
  )

  mesh.rotation.set(
    (index * 0.2) + Math.random() * 0.1,
    (index * 0.3) + Math.random() * 0.1,
    (index * 0.15) + Math.random() * 0.1
  )

  mesh.userData = {
    formIndex,
    isMetallic,
    driftSpeed: 0.001 + (Math.random() * 0.0005),
    rotMult: 0.5 + formIndex * 0.2,
    interactionStrength: 0,
    baseY: mesh.position.y,
    depthLayer,
    baseScale: depthLayer === 'background' ? 0.7 : depthLayer === 'foreground' ? 1.3 : 1.0,
  }

  return mesh
}

export default function Scene({ mousePos, scrollProgress, prefersReducedMotion, pointerDistance, isMobile = false }: SceneProps) {
  const backgroundGroupRef = useRef<THREE.Group>(null)
  const midgroundGroupRef = useRef<THREE.Group>(null)
  const foregroundGroupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const heroObjectRef = useRef<THREE.Group>(null)
  const targetScaleVec = useRef(new THREE.Vector3(1, 1, 1))
  const ambientParticlesRef = useRef<THREE.Points>(null)

  const { gl, scene } = useThree()

  // Setup cinematic tone mapping
  useEffect(() => {
    gl.toneMapping = isMobile ? THREE.ReinhardToneMapping : THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = isMobile ? 1.1 : 0.85
    gl.outputColorSpace = THREE.SRGBColorSpace

    scene.fog = new THREE.Fog('#050505', isMobile ? 15 : 12, isMobile ? 50 : 45)
  }, [gl, scene, isMobile])

  // =============================================
  // A. DEPTH LAYERS - Foreground / Midground / Background
  // =============================================
  const backgroundForms = useMemo(() => {
    const count = isMobile ? 2 : 3
    const elements = []
    for (let i = 0; i < count; i++) {
      elements.push(createPrimaryForm(i, 'background'))
    }
    return elements
  }, [isMobile])

  const midgroundForms = useMemo(() => {
    const count = isMobile ? 2 : 3
    const elements = []
    for (let i = 0; i < count; i++) {
      elements.push(createPrimaryForm(i + 3, 'midground'))
    }
    return elements
  }, [isMobile])

  const foregroundForms = useMemo(() => {
    const count = isMobile ? 1 : 2
    const elements = []
    for (let i = 0; i < count; i++) {
      elements.push(createPrimaryForm(i + 6, 'foreground'))
    }
    return elements
  }, [isMobile])

  // =============================================
  // B. SECONDARY PARTICLES - Sparse field of tiny particles
  // =============================================
  const particleCount = isMobile ? 60 : 120
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = radius * Math.cos(theta)
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi) * 0.5
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
      depthWrite: false,
    })

    return { geometry, material }
  }, [])

  // =============================================
  // C. AMBIENT PARTICLES - Close floating dust
  // =============================================
  const ambientParticles = useMemo(() => {
    const count = isMobile ? 20 : 40
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      depthWrite: false,
    })

    return { geometry, material }
  }, [])

  // =============================================
  // D. GRID - Subtle perspective grid, depth establisher
  // =============================================
  const gridGeometry = useMemo(() => {
    const positions: number[] = []
    const size = 40
    const divisions = 40
    const step = size / divisions
    const half = size / 2

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step
      positions.push(-half, -0.6, pos, half, -0.6, pos)
      positions.push(pos, -0.6, -half, pos, -0.6, half)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [])

  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.015,
      depthWrite: false,
    })
  }, [])

  // =============================================
  // E. HERO OBJECT - Recognizable centerpiece
  // =============================================
  const heroObject = useMemo(() => {
    const group = new THREE.Group()

    // Central monolith - refined physical material
    const monolithGeo = new THREE.BoxGeometry(2.2, 0.45, 2.2)
    const monolithMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dcffd,
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    })
    const monolith = new THREE.Mesh(monolithGeo, monolithMat)
    monolith.position.set(0, 0, 0)
    group.add(monolith)

    // Outer torus ring
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.025, 16, 80)
    const ring1Mat = new THREE.MeshPhysicalMaterial({
      color: 0x5b8def,
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 0.2,
    })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI / 2
    ring1.position.set(0, 0, 0)
    group.add(ring1)

    // Inner torus ring
    const ring2Geo = new THREE.TorusGeometry(2.0, 0.018, 16, 80)
    const ring2Mat = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      metalness: 0.92,
      roughness: 0.06,
      clearcoat: 0.25,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI / 3
    ring2.position.set(0, 0, 0)
    group.add(ring2)

    // Subtle accent sphere
    const sphereGeo = new THREE.SphereGeometry(0.12, 32, 32)
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.15,
      clearcoat: 0.5,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.set(0, 0.25, 0)
    group.add(sphere)

    group.userData = {
      heroSpeed: 0.008,
      interactionStrength: 0,
    }

    return group
  }, [])

  // =============================================
  // Animate all elements
  // =============================================
  useFrame((state) => {
    if (prefersReducedMotion) return

    const t = state.clock.getElapsedTime()
    const motionScale = isMobile ? 0.6 : 1

    // Helper: animate a group of depth forms with choreographed movement
    const animateDepthGroup = (group: THREE.Group | null, layerSpeed: number, layerAmplitude: number, scrollInfluence: number) => {
      if (!group) return
      group.children.forEach((child, i) => {
        if (child.userData.formIndex !== undefined) {
          const floatSpeed = child.userData.driftSpeed
          const rotMult = child.userData.rotMult
          const baseY = child.userData.baseY || child.position.y
          const baseScale = child.userData.baseScale || 1
          const depthLayer = child.userData.depthLayer || 'midground'

          // Choreographed orbital-like rotation
          const rotOffset = i * 0.7
          child.rotation.y += (0.0004 + Math.sin(t * 0.1 + rotOffset) * 0.0002) * rotMult * layerSpeed * motionScale
          child.rotation.x += (0.0002 + Math.cos(t * 0.08 + rotOffset) * 0.0001) * rotMult * layerSpeed * motionScale
          child.rotation.z += Math.sin(t * 0.06 + rotOffset) * 0.0001 * layerSpeed * motionScale

          // Floating movement with depth-aware amplitude
          const floatAmp = depthLayer === 'foreground' ? 0.18 : depthLayer === 'background' ? 0.05 : 0.1
          child.position.y = baseY + Math.sin(t * floatSpeed + i * 0.5) * floatAmp * layerAmplitude * motionScale

          // Subtle orbital drift
          const orbitRadius = 0.3 * layerSpeed * motionScale
          child.position.x += Math.sin(t * 0.04 + i * 0.3) * orbitRadius * 0.01
          child.position.z += Math.cos(t * 0.03 + i * 0.2) * orbitRadius * 0.01

          // Scale based on depth
          child.scale.setScalar(baseScale)

          // Pointer interaction with proximity falloff
          if (pointerDistance !== undefined) {
            const strength = Math.max(0, 1 - pointerDistance / 2.5)
            const proximityBoost = depthLayer === 'foreground' ? 1.8 : depthLayer === 'background' ? 0.4 : 1.0
            child.rotation.y += strength * 0.003 * layerSpeed * proximityBoost * motionScale
            child.position.y += strength * 0.04 * layerAmplitude * proximityBoost * motionScale
            child.scale.setScalar(baseScale + strength * 0.02 * proximityBoost)
          }

          // Scroll-based depth movement
          child.position.z += scrollProgress * scrollInfluence * 0.15 * motionScale

          // Atmospheric perspective - fade distant objects
          const dist = child.position.length()
          if (dist > 8) {
            const fade = Math.max(0, 1 - (dist - 8) / 8)
            const mesh = child as THREE.Mesh
            const mat = mesh.material as THREE.MeshStandardMaterial
            mat.opacity = fade * 0.9 * (depthLayer === 'background' ? 0.4 : 0.7)
            mat.transparent = true
          }
        }
      })
    }

    // Animate each depth layer with different speeds and scroll influence
    animateDepthGroup(backgroundGroupRef.current, 0.3, 0.4, -0.5)
    animateDepthGroup(midgroundGroupRef.current, 0.6, 0.6, 0.2)
    animateDepthGroup(foregroundGroupRef.current, 1.0, 0.8, 0.6)

    // Hero object - slow elegant rotation with pointer response
    if (heroObjectRef.current) {
      heroObjectRef.current.rotation.y += 0.004 * motionScale
      heroObjectRef.current.rotation.z = Math.sin(t * 0.12) * 0.04 * motionScale
      heroObjectRef.current.rotation.x = Math.cos(t * 0.1) * 0.02 * motionScale

      // Proximity-based interaction
      let proximity = 0
      if (pointerDistance !== undefined) {
        proximity = Math.max(0, 1 - pointerDistance / 3.5)
      }

      // Subtle scale pulse based on proximity (reusing vector to avoid allocation)
      targetScaleVec.current.setScalar(1 + proximity * 0.04)
      heroObjectRef.current.scale.lerp(targetScaleVec.current, 0.02)

      // Position float with proximity influence
      heroObjectRef.current.position.y = 1.0 + Math.sin(t * 0.25) * 0.04 * motionScale + proximity * 0.02

      // Rotation speedup when pointer is close
      heroObjectRef.current.rotation.y += proximity * 0.005 * motionScale

      // Scroll-based subtle rotation
      heroObjectRef.current.rotation.x += scrollProgress * 0.015 * motionScale
    }

    // Secondary particles - subtle rotation and pointer reaction
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.005 * motionScale
      particlesRef.current.rotation.x = t * 0.002 * motionScale

      if (pointerDistance !== undefined) {
        const strength = Math.max(0, 1 - pointerDistance / 4)
        particlesRef.current.rotation.y += strength * 0.001 * motionScale
        const particleScale = 1 + strength * 0.06
        particlesRef.current.scale.setScalar(particleScale)
      } else {
        particlesRef.current.scale.setScalar(1)
      }
    }

    // Ambient particles - gentle floating motion
    if (ambientParticlesRef.current) {
      ambientParticlesRef.current.rotation.y = t * 0.0015 * motionScale
      ambientParticlesRef.current.position.y = Math.sin(t * 0.15) * 0.1 * motionScale
      ambientParticlesRef.current.position.x = Math.cos(t * 0.12) * 0.08 * motionScale
    }
  })

  return (
    <group>
      {/* Cinematic lighting system - restrained */}
      {/* Soft key light from upper right */}
      <directionalLight position={[8, 10, 6]} intensity={0.35} color="#ffffff" />

      {/* Low-intensity fill from left */}
      <directionalLight position={[-6, 4, -4]} intensity={0.25} color="#e8f4ff" />

      {/* Subtle rim/back light */}
      <directionalLight position={[0, 1, -8]} intensity={0.12} color="#7dcffd" />

      {/* Cool accent - tight area */}
      <pointLight position={[0, 2, 4]} intensity={0.15} color="#3b82f6" distance={12} />

      {/* Warm subtle fill for depth */}
      <pointLight position={[-4, -2, 2]} intensity={0.08} color="#f0f0f0" distance={10} />

      {/* Ambient light */}
      <ambientLight intensity={0.12} />

      {/* Hemisphere light - natural ambient */}
      <hemisphereLight intensity={0.2} />

      {/* Camera rig for mouse and scroll interaction */}
      <CameraRig
        mousePos={mousePos}
        scrollProgress={scrollProgress}
        prefersReducedMotion={prefersReducedMotion}
        pointerDistance={pointerDistance}
        isMobile={isMobile}
      />

      {/* Depth layers */}
      <group ref={backgroundGroupRef}>
        {backgroundForms.map((mesh, i) => (
          <primitive key={`bg-${i}`} object={mesh} />
        ))}
      </group>
      <group ref={midgroundGroupRef}>
        {midgroundForms.map((mesh, i) => (
          <primitive key={`mg-${i}`} object={mesh} />
        ))}
      </group>
      <group ref={foregroundGroupRef}>
        {foregroundForms.map((mesh, i) => (
          <primitive key={`fg-${i}`} object={mesh} />
        ))}
      </group>

      {/* Hero object - centerpiece */}
      <group ref={heroObjectRef}>
        {heroObject && <primitive object={heroObject} />}
      </group>

      {/* Secondary particles - sparse, depth-aware field */}
      <points ref={particlesRef} geometry={particles.geometry} material={particles.material} />

      {/* Ambient particles - close floating dust */}
      <points ref={ambientParticlesRef} geometry={ambientParticles.geometry} material={ambientParticles.material} />

      {/* Grid - subtle perspective, depth establisher */}
      <lineSegments geometry={gridGeometry} material={gridMaterial} />
    </group>
  )
}
