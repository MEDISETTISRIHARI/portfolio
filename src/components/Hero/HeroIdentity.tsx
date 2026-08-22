'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type HeroIdentityProps = {
  role?: string
  isInView: boolean
}

export default function HeroIdentity({ role, isInView }: HeroIdentityProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !isInView) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 })

      // Brand mark reveal
      tl.fromTo('.identity-mark',
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
      )

      // Role reveal
      tl.fromTo('.identity-role',
        { opacity: 0, y: 15, filter: 'blur(2px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      )

      // Tagline reveal
      tl.fromTo('.identity-tagline',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )

      // Divider reveal
      tl.fromTo('.identity-divider',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )

      // Meta items reveal
      tl.fromTo('.identity-meta',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [isInView])

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Brand mark - strongest weight */}
      <div className="identity-mark">
        <p
          className="font-display text-[clamp(1.5rem,2.5vw,2rem)] text-text-primary"
          style={{
            letterSpacing: '-0.03em',
            lineHeight: '1',
            fontWeight: 600,
          }}
        >
          SRIHARI
        </p>
      </div>

      {/* Role - medium weight, more tracking */}
      {role && (
        <p
          className="identity-role text-[clamp(0.65rem,1vw,0.75rem)] text-text-muted/70 uppercase tracking-[0.35em]"
          style={{ letterSpacing: '0.35em', fontWeight: 500 }}
        >
          {role}
        </p>
      )}

      {/* Tagline - lightest weight, most tracking */}
      <p
        className="identity-tagline text-[clamp(0.6rem,0.9vw,0.7rem)] text-text-muted/50 uppercase"
        style={{ letterSpacing: '0.45em', fontWeight: 400 }}
      >
        DESIGN &times; CODE &times; MOTION
      </p>

      {/* Divider */}
      <div
        className="identity-divider h-px bg-border-default origin-left"
        style={{ width: '48px' }}
      />

      {/* Meta information - lightest weight */}
      <div className="space-y-2">
        <p className="identity-meta text-meta text-text-muted" style={{ letterSpacing: '0.15em' }}>
          CREATIVE DEVELOPER
        </p>
        <p className="identity-meta text-meta text-text-muted" style={{ letterSpacing: '0.15em' }}>
          INDIA — 2026
        </p>
      </div>
    </div>
  )
}
