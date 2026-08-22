'use client'

import { useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('srihari-intro-seen')

    if (hasSeenIntro) {
      // Returning visitor: show nav immediately
      setIntroComplete(true)
      return
    }

    const handleIntroComplete = () => {
      setIntroComplete(true)
      window.removeEventListener('intro-complete', handleIntroComplete)
    }

    window.addEventListener('intro-complete', handleIntroComplete)
    return () => window.removeEventListener('intro-complete', handleIntroComplete)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>
      setActiveSection(customEvent.detail?.sectionId || '')
    }
    window.addEventListener('scroll-section-change', handleSectionChange)
    return () => window.removeEventListener('scroll-section-change', handleSectionChange)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo('.mobile-nav-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
      )
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  // Entrance animation for nav
  useEffect(() => {
    if (!introComplete) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-item',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
      )
      gsap.fromTo('.nav-logo',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      )
    })

    return () => ctx.revert()
  }, [introComplete])

  const navItems = [
    { label: 'WORK', href: '#work' },
    { label: 'ABOUT', href: '#about' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'CONTACT', href: '#contact' },
  ]

  const isActive = (href: string) => {
    const id = href.replace('#', '')
    return activeSection === id
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border-subtle' : 'bg-transparent'
        } ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>
            <a href="#" className="font-display text-sm tracking-widest text-text-primary hover:text-accent transition-colors duration-300 nav-logo">
              SRIHARI
            </a>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`caption relative transition-colors duration-300 nav-item ${isActive(item.href) ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
                  )}
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2 border border-border-default text-text-primary text-xs font-medium tracking-wide hover:border-accent hover:text-accent transition-all duration-300 nav-item"
              >
                LET&apos;S TALK
              </a>
            </div>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 nav-item"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              <span className={`w-6 h-px bg-text-primary transition-all duration-300 ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-px bg-text-primary transition-all duration-300 ${isMobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-px bg-text-primary transition-all duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-30 bg-background/98 backdrop-blur-xl flex items-center justify-center transition-all duration-500 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileOpen}
      >
        <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="font-display text-display-sm text-text-primary hover:text-accent transition-colors duration-300 mobile-nav-item"
              style={{ opacity: 0 }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMobileOpen(false)}
            className="mt-8 px-8 py-4 bg-text-primary text-background text-sm font-medium tracking-wide mobile-nav-item"
            style={{ opacity: 0 }}
          >
            LET&apos;S TALK
          </a>
        </nav>
      </div>
    </>
  )
}
