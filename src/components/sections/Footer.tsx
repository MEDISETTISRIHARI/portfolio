'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

type SocialLink = {
  id: string
  platform: string
  username: string
  url: string
  icon?: string | null
  visible: boolean
  order: number
}

type Profile = {
  id: string
  name: string
  role: string
  tagline?: string | null
  bio: string
  location?: string | null
  email: string
  availability?: string | null
  image?: string | null
}

type FooterProps = {
  socials: SocialLink[]
  profile?: Profile
}

export default function Footer({ socials, profile }: FooterProps) {
  const [isInView, setIsInView] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    const ctx = gsap.context(() => {
      const divider = footerRef.current?.querySelector('.footer-divider')
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: 'power3.out' }
        )
      }

      const brand = footerRef.current?.querySelector('.footer-brand')
      if (brand) {
        gsap.fromTo(brand,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
        )
      }

      const links = footerRef.current?.querySelectorAll('.footer-link')
      if (links) {
        gsap.fromTo(links,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out', delay: 0.4 }
        )
      }

      const meta = footerRef.current?.querySelector('.footer-meta')
      if (meta) {
        gsap.fromTo(meta,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 }
        )
      }
    }, footerRef)

    return () => ctx.revert()
  }, [isInView])

  return (
    <footer data-scroll-section="footer" className="py-20 md:py-32 border-t border-border-subtle relative" ref={footerRef}>
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />

      {/* Animated divider */}
      <div className="footer-divider h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left mb-16 md:mb-32" style={{ transform: 'scaleX(0)' }} />

      <div className="container mx-auto px-6">
        {/* Large brand statement */}
        <div className="footer-brand mb-16 md:mb-32">
          <h2
            className="font-display text-[clamp(2.5rem,5vw,5rem)] text-text-primary leading-[0.9]"
            style={{ letterSpacing: '-0.03em' }}
            data-scroll-reveal
          >
            {profile?.name || 'SRIHARI'}
          </h2>
          <p
            className="font-display text-[clamp(1.25rem,2vw,2rem)] text-text-muted mt-4"
            style={{ letterSpacing: '-0.01em' }}
            data-scroll-reveal
          >
            {profile?.role || 'DIGITAL EXPERIENCES'}
          </p>
          {profile?.tagline && (
            <p
              className="body-lg text-text-secondary mt-6 max-w-2xl"
              style={{ lineHeight: '1.6' }}
              data-scroll-reveal
            >
              {profile.tagline}
            </p>
          )}
        </div>

        {/* Navigation + Socials */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-32">
          {/* Navigation */}
          <div className="md:col-span-6">
            <p className="label text-text-muted mb-6">NAVIGATION</p>
            <nav className="flex flex-col gap-4">
              <Link href="#work" className="footer-link group inline-flex items-center gap-3">
                <span className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-300">WORK</span>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-6" />
              </Link>
              <Link href="#about" className="footer-link group inline-flex items-center gap-3">
                <span className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-300">ABOUT</span>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-6" />
              </Link>
              <Link href="#skills" className="footer-link group inline-flex items-center gap-3">
                <span className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-300">SKILLS</span>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-6" />
              </Link>
              <Link href="#contact" className="footer-link group inline-flex items-center gap-3">
                <span className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-300">CONTACT</span>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-6" />
              </Link>
            </nav>
          </div>

          {/* Social + Contact */}
          <div className="md:col-span-6">
            <p className="label text-text-muted mb-6">CONNECT</p>
            <div className="flex flex-col gap-4">
              {socials.map((social) => {
                const isExternal = social.url.startsWith('http')
                return (
                  <Link
                    key={social.id}
                    href={social.url}
                    className="footer-link group inline-flex items-center gap-3"
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={`${social.platform} — ${social.username}`}
                  >
                    <span className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-300">{social.platform}</span>
                    <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-6" />
                  </Link>
                )
              })}
              <a
                href={`mailto:${profile?.email || 'hello@example.com'}`}
                className="footer-link group inline-flex items-center gap-3"
                aria-label={`Send email to ${profile?.email || 'hello@example.com'}`}
              >
                <span className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-300">EMAIL</span>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom metadata */}
        <div className="footer-meta flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-12 border-t border-border-subtle">
          <p className="body-sm text-text-muted">
            {profile?.location ? `${profile.location} — ` : ''}2026
          </p>
          <p className="body-sm text-text-muted">
            DESIGN × CODE × MOTION
          </p>
        </div>
      </div>
    </footer>
  )
}
