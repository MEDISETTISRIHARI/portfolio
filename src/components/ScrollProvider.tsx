'use client'

import { useEffect } from 'react'

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const revealElements = new Set<Element>()

    const reveal = (element: Element) => {
      element.classList.add('visible')
      revealElements.delete(element)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 100px 0px',
      }
    )

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-up')

      elements.forEach((element) => {
        if (
          !element.classList.contains('visible') &&
          !revealElements.has(element)
        ) {
          revealElements.add(element)
          observer.observe(element)
        }
      })
    }

    // Observe content that already exists.
    observeElements()

    // Watch for content rendered later by React/API data.
    const mutationObserver = new MutationObserver(() => {
      observeElements()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Safety fallback: never leave content invisible.
    const safetyTimer = window.setTimeout(() => {
      document
        .querySelectorAll('.reveal-up:not(.visible)')
        .forEach((element) => {
          element.classList.add('visible')
        })
    }, 3000)

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      window.clearTimeout(safetyTimer)
      revealElements.clear()
    }
  }, [])

  return <>{children}</>
}