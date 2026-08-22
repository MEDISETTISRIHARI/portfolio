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
}

const PRIMARY_COLORS = [0x0d0d0d, 0x1a1a1a, 0x262626, 0x333333, 0x101010]
const ACCENT_COLOR = 0x7dcffd
const METALLIC_COLORS = [0x7dcffd, 0x5b8def, 0x3b82f6, 0x06b6d4, 0x0891b2]
const MATTE_COLORS = [0x0d0d0d, 0x1a1a1a, 0x262626, 0x333333, 0x101010]

function createPrimaryForm(index: number): THREE.Mesh {
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
  const metalness = isMetallic ? 0.8 : 0.1
  const roughness = isMetallic ? 0.05 : 0.9

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    flatShading: isMetallic ? false : true,
  })

  const mesh = new THREE.Mesh(geometry, material)

  const radius = 6 + (index % 3) * 2.5
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
  }

  return mesh
}

export default function Scene({ mousePos, scrollProgress, prefersReducedMotion, pointerDistance }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const heroObjectRef = useRef<THREE.Group>(null)
  const targetScaleVec = useRef(new THREE.Vector3(1, 1, 1))

  const { gl, scene } = useThree()

  // Setup cinematic tone mapping
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.85
    gl.outputColorSpace = THREE.SRGBColorSpace

    scene.fog = new THREE.Fog('#050505', 15, 50)
  }, [gl, scene])

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
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [])

  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.02,
      depthWrite: false,
    })
  }, [])

  // =============================================
  // D. HERO OBJECT - Recognizable centerpiece
  // =============================================
  const heroObject = useMemo(() => {
    const group = new THREE.Group()

    // Central monolith
    const monolithGeo = new THREE.BoxGeometry(2.5, 0.5, 2.5)
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x7dcffd,
      metalness: 0.9,
      roughness: 0.08,
    })
    const monolith = new THREE.Mesh(monolithGeo, monolithMat)
    monolith.position.set(0, 0, 0)
    group.add(monolith)

    // Two torus rings
    const ring1Geo = new THREE.TorusGeometry(1.8, 0.03, 16, 64)
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x5b8def,
      metalness: 0.85,
      roughness: 0.1,
    })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI / 2
    ring1.position.set(0, 0, 0)
    group.add(ring1)

    const ring2Geo = new THREE.TorusGeometry(2.2, 0.02, 16, 64)
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.9,
      roughness: 0.05,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI / 3
    ring2.position.set(0, 0, 0)
    group.add(ring2)

    // Small accent sphere
    const sphereGeo = new THREE.SphereGeometry(0.15, 32, 32)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.3,
      roughness: 0.2,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.set(0, 0, 0)
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

    // Primary forms - organized rotation with subtle drift
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child.userData.formIndex !== undefined) {
          const floatSpeed = child.userData.driftSpeed
          const rotMult = child.userData.rotMult

          child.rotation.y += 0.001 * rotMult
          child.rotation.x += 0.0005 * rotMult
          child.position.y += Math.sin(t * floatSpeed + i * 0.5) * 0.001

          // Pointer interaction with proper proximity falloff
          if (pointerDistance !== undefined) {
            const strength = Math.max(0, 1 - pointerDistance / 2)
            child.rotation.y += strength * 0.003
            child.position.y += strength * 0.002
            child.scale.setScalar(1 + strength * 0.02)
          } else {
            child.scale.setScalar(1)
          }
        }
      })
    }

    // Hero object - slow elegant rotation with pointer response
    if (heroObjectRef.current) {
      heroObjectRef.current.rotation.y += 0.008
      
      // Proximity-based interaction
      let proximity = 0
      if (pointerDistance !== undefined) {
        proximity = Math.max(0, 1 - pointerDistance / 3)
      }
      
      // Subtle scale pulse based on proximity (reusing vector to avoid allocation)
      targetScaleVec.current.setScalar(1 + proximity * 0.08)
      heroObjectRef.current.scale.lerp(targetScaleVec.current, 0.05)
      
      // Position float with proximity influence
      heroObjectRef.current.position.y = 1.2 + Math.sin(t * 0.5) * 0.02 + proximity * 0.05
      
      // Rotation speedup when pointer is close
      heroObjectRef.current.rotation.y += proximity * 0.01
      heroObjectRef.current.rotation.x = Math.sin(t * 0.3) * proximity * 0.15
    }

    // Secondary particles - subtle rotation and pointer reaction
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.01
      particlesRef.current.rotation.x = t * 0.005

      if (pointerDistance !== undefined) {
        const strength = Math.max(0, 1 - pointerDistance / 4)
        particlesRef.current.rotation.y += strength * 0.002
        // Subtle scale pulse based on proximity
        const particleScale = 1 + strength * 0.15
        particlesRef.current.scale.setScalar(particleScale)
      } else {
        particlesRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <group>
      {/* Cinematic lighting system */}
      {/* Soft key light */}
      <directionalLight position={[10, 12, 8]} intensity={0.4} color="#ffffff" />

      {/* Low-intensity fill */}
      <directionalLight position={[-8, 5, -6]} intensity={0.3} color="#ffffff" />

      {/* Rim light */}
      <directionalLight position={[0, 2, -10]} intensity={0.15} color="#7dcffd" />

      {/* Subtle blue/cool accent light */}
      <pointLight position={[0, 3, 5]} intensity={0.2} color="#3b82f6" distance={15} />

      {/* Ambient light */}
      <ambientLight intensity={0.15} />

      {/* Hemisphere light - natural ambient */}
      <hemisphereLight intensity={0.25} />

      {/* Camera rig for mouse and scroll interaction */}
      <CameraRig
        mousePos={mousePos}
        scrollProgress={scrollProgress}
        prefersReducedMotion={prefersReducedMotion}
        pointerDistance={pointerDistance}
      />

      {/* Hero object - centerpiece */}
      <group ref={heroObjectRef}>
        {heroObject && <primitive object={heroObject} />}
      </group>

      {/* Primary forms - organized architectural objects */}
      <group ref={groupRef}>
        {primaryForms.map((mesh, i) => (
          <primitive key={i} object={mesh} />
        ))}
      </group>

      {/* Secondary particles - sparse, depth-aware field */}
      <points ref={particlesRef} geometry={particles.geometry} material={particles.material} />

      {/* Grid - subtle perspective, depth establisher */}
      <lineSegments geometry={gridGeometry} material={gridMaterial} />
    </group>
  )
}