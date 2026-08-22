'use client'

import { useState, useEffect, useCallback } from 'react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

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
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

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
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>
            <a href="#" className="font-display text-sm tracking-widest text-text-primary hover:text-accent transition-colors duration-300">
              SRIHARI
            </a>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`caption relative transition-colors duration-300 ${isActive(item.href) ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
                  )}
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2 border border-border-default text-text-primary text-xs font-medium tracking-wide hover:border-accent hover:text-accent transition-all duration-300"
              >
                LET&apos;S TALK
              </a>
            </div>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
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
      >
        <nav className="flex flex-col items-center gap-8">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="font-display text-display-sm text-text-primary hover:text-accent transition-colors duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMobileOpen(false)}
            className="mt-8 px-8 py-4 bg-text-primary text-background text-sm font-medium tracking-wide"
          >
            LET&apos;S TALK
          </a>
        </nav>
      </div>
    </>
  )
}
