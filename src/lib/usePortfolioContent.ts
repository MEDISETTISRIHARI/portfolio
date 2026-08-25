'use client'

import { useEffect, useState } from 'react'

export type PortfolioContent = {
  profile: any | null
  hero: any | null
  projects: any[]
  skills: any[]
  services: any[]
  testimonials: any[]
  socials: any[]
}

const EMPTY_CONTENT: PortfolioContent = {
  profile: null,
  hero: null,
  projects: [],
  skills: [],
  services: [],
  testimonials: [],
  socials: [],
}

export function usePortfolioContent() {
  const [content, setContent] =
    useState<PortfolioContent>(EMPTY_CONTENT)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  async function load() {
    try {
      setError('')

      const response = await fetch(
        '/api/public/content',
        {
          cache: 'no-store',
        }
      )

      const json = await response.json()

      if (!response.ok || !json.ok) {
        throw new Error(
          json.error || 'Failed to load content'
        )
      }

      setContent(json.data)
    } catch (err) {
      console.error('PORTFOLIO CONTENT ERROR:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load content'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()

    const onFocus = () => load()

    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return {
    ...content,
    loading,
    error,
    refresh: load,
  }
}
