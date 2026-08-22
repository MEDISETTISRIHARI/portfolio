'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type ContactSectionProps = {
  email?: string
}

export default function ContactSection({ email }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isInView, setIsInView] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const magneticRef = useRef<HTMLAnchorElement>(null)

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
      { threshold: 0.15 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  useEffect(() => {
    if (!isInView) return

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.contact-header')
      if (header && !prefersReducedMotion) {
        gsap.fromTo(header,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        )
      } else if (header && prefersReducedMotion) {
        gsap.set(header, { opacity: 1, y: 0 })
      }

      const title = sectionRef.current?.querySelector('.contact-title')
      if (title && !prefersReducedMotion) {
        gsap.fromTo(title,
          { opacity: 0, y: 80, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power3.out', delay: 0.2 }
        )
      } else if (title && prefersReducedMotion) {
        gsap.set(title, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' })
      }

      const cta = sectionRef.current?.querySelector('.contact-cta')
      if (cta && !prefersReducedMotion) {
        gsap.fromTo(cta,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 }
        )
      } else if (cta && prefersReducedMotion) {
        gsap.set(cta, { opacity: 1, y: 0 })
      }

      const form = sectionRef.current?.querySelector('.contact-form')
      if (form && !prefersReducedMotion) {
        gsap.fromTo(form,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
        )
      } else if (form && prefersReducedMotion) {
        gsap.set(form, { opacity: 1, y: 0 })
      }

      const dividers = sectionRef.current?.querySelectorAll('.contact-divider')
      if (dividers && !prefersReducedMotion) {
        gsap.fromTo(dividers,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
        )
      } else if (dividers && prefersReducedMotion) {
        gsap.set(dividers, { scaleX: 1 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, prefersReducedMotion])

  useEffect(() => {
    if (!magneticRef.current) return
    const domElement = magneticRef.current

    const xTo = gsap.quickTo(domElement, 'x', { duration: 0.4, ease: 'power2.out' })
    const yTo = gsap.quickTo(domElement, 'y', { duration: 0.4, ease: 'power2.out' })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = domElement.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.2
      const y = (e.clientY - rect.top - rect.height / 2) * 0.2
      xTo(x)
      yTo(y)
    }

    const handleMouseLeave = () => {
      gsap.to(domElement, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    }

    domElement.addEventListener('mousemove', handleMouseMove)
    domElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      domElement.removeEventListener('mousemove', handleMouseMove)
      domElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isInView])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      projectType: formData.get('projectType') as string,
      budget: formData.get('budget') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to send message')

      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" data-scroll-section="contact" className="py-24 md:py-48 border-t border-border-subtle relative" ref={sectionRef}>
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />

      {/* Background depth - subtle grain */}
      <div data-depth="background" className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Animated background lines */}
      <div data-depth="background" className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border-subtle to-transparent opacity-30" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border-subtle to-transparent opacity-30" />
      </div>

      {/* Architectural line for final wow moment */}
      <div className="wow-architectural-line absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent origin-left opacity-0" style={{ transform: 'scaleX(0)' }} />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="contact-header mb-12 md:mb-24">
          <p className="label text-text-muted mb-4" data-scroll-reveal>CONTACT</p>
          <div className="contact-divider h-px bg-accent origin-left" style={{ width: '48px' }} />
        </div>

        {/* Hero-level typography */}
        <div className="contact-title mb-12 md:mb-24" data-scroll-reveal>
          <h2
            className="font-display text-[clamp(2.5rem,7vw,7rem)] text-text-primary leading-[0.9]"
            style={{ letterSpacing: '-0.04em' }}
          >
            LET&apos;S TALK
          </h2>
          <h3
            className="font-display text-[clamp(1.25rem,2.5vw,2.5rem)] text-text-secondary mt-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            HAVE AN IDEA? LET&apos;S BUILD SOMETHING WORTH REMEMBERING.
          </h3>
        </div>

        {/* Large email CTA - magnetic */}
        <div className="contact-cta mb-12 md:mb-24" data-scroll-reveal>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
            <a
              ref={magneticRef}
              href={`mailto:${email || 'hello@example.com'}`}
              className="group relative px-8 md:px-10 py-4 md:py-5 bg-text-primary text-background text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background max-w-full"
              style={{ borderRadius: '2px' }}
              aria-label={`Send email to ${email || 'hello@example.com'}`}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="truncate">{email || 'hello@example.com'}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <p className="body-sm text-text-muted">
              Or fill out the form below
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="contact-form max-w-4xl">
          {status === 'success' && (
            <p className="body-md text-accent mb-8" role="status">Message sent successfully. I&apos;ll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="body-md text-red-400 mb-8" role="alert">Failed to send message. Please try again.</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-scroll-reveal>
                <label htmlFor="contact-name" className="label text-text-muted block mb-3">NAME</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-300"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div data-scroll-reveal>
                <label htmlFor="contact-email" className="label text-text-muted block mb-3">EMAIL</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-300"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-scroll-reveal>
                <label htmlFor="contact-type" className="label text-text-muted block mb-3">PROJECT TYPE</label>
                <select id="contact-type" name="projectType" className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-300">
                  <option value="">Select project type</option>
                  <option value="website">Website</option>
                  <option value="webapp">Web Application</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div data-scroll-reveal>
                <label htmlFor="contact-budget" className="label text-text-muted block mb-3">BUDGET</label>
                <select id="contact-budget" name="budget" className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-300">
                  <option value="">Select budget range</option>
                  <option value="5k-10k">$5,000 — $10,000</option>
                  <option value="10k-25k">$10,000 — $25,000</option>
                  <option value="25k-50k">$25,000 — $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
            </div>
            <div data-scroll-reveal>
              <label htmlFor="contact-message" className="label text-text-muted block mb-3">MESSAGE</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                required
                className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <div className="pt-4" data-scroll-reveal>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-text-primary text-background text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              >
                {isSubmitting ? 'SENDING...' : 'START A PROJECT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
