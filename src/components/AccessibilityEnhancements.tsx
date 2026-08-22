'use client'

import { useEffect } from 'react'

export default function AccessibilityEnhancements() {
  useEffect(() => {
    // Add skip link if not present
    const existingSkipLink = document.querySelector('.skip-link')
    if (!existingSkipLink) {
      const skipLink = document.createElement('a')
      skipLink.href = '#main-content'
      skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-text-primary focus:text-background focus:text-sm focus:font-medium'
      skipLink.textContent = 'Skip to main content'
      document.body.prepend(skipLink)
    }

    // Ensure main content has ID for skip link
    const mainContent = document.querySelector('main')
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content'
    }

    // Handle keyboard navigation for interactive elements
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes mobile menu
      if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('[aria-expanded]')
        if (mobileMenu) {
          mobileMenu.setAttribute('aria-expanded', 'false')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
