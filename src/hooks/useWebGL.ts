'use client'

import { useState, useEffect } from 'react'

export default function useWebGL() {
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      setIsSupported(!!gl)
    } catch {
      setIsSupported(false)
    }
  }, [])

  return isSupported
}