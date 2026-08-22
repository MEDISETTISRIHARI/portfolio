'use client'

import { useEffect, useRef, useId } from 'react'
import { gsap } from 'gsap'

type ProjectVisualProps = {
  category?: string
  title: string
  isActive: boolean
}

function getCategoryKey(category?: string): string {
  if (!category) return 'default'
  const lower = category.toLowerCase()
  if (lower.includes('insurance')) return 'insurance'
  if (lower.includes('fintech') || lower.includes('finance')) return 'fintech'
  if (lower.includes('creative') || lower.includes('agency')) return 'creative'
  if (lower.includes('architect')) return 'architecture'
  return 'default'
}

export default function ProjectVisual({ category, title, isActive }: ProjectVisualProps) {
  const visualRef = useRef<HTMLDivElement>(null)
  const categoryKey = getCategoryKey(category)
  const uniqueId = useId()
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!visualRef.current) return
    const el = visualRef.current

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1, scale: 1 })
        return
      }

      gsap.set(el, { opacity: 0, scale: 0.98 })

      if (isActive) {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
        })
      }
    }, visualRef)

    return () => ctx.revert()
  }, [isActive, prefersReducedMotion])

  useEffect(() => {
    if (!visualRef.current) return
    const el = visualRef.current

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return

      const shapeEl = el.querySelector('.pv-shape')
      const patternEl = el.querySelector('.pv-pattern')
      const lineEl = el.querySelector('.pv-line')
      const titleEl = el.querySelector('.pv-title')
      const depthLayer1 = el.querySelector('.pv-depth-1')
      const depthLayer2 = el.querySelector('.pv-depth-2')
      const depthLayer3 = el.querySelector('.pv-depth-3')

      if (shapeEl) {
        gsap.to(shapeEl, {
          x: isActive ? '0%' : '-5%',
          scale: isActive ? 1 : 0.9,
          duration: 1.4,
          ease: 'power3.out',
        })
      }

      if (patternEl) {
        gsap.to(patternEl, {
          opacity: isActive ? 0.6 : 0.2,
          x: isActive ? '0%' : '3%',
          duration: 1.6,
          ease: 'power2.out',
        })
      }

      if (lineEl) {
        gsap.to(lineEl, {
          scaleX: isActive ? 1 : 0,
          duration: 1,
          ease: 'power3.out',
        })
      }

      if (titleEl) {
        gsap.to(titleEl, {
          opacity: isActive ? 0.15 : 0,
          y: isActive ? 0 : 20,
          duration: 1,
          ease: 'power2.out',
        })
      }

      // Depth layers animate at different speeds
      if (depthLayer1) {
        gsap.to(depthLayer1, {
          x: isActive ? '0%' : '-3%',
          duration: 2,
          ease: 'power2.out',
        })
      }
      if (depthLayer2) {
        gsap.to(depthLayer2, {
          y: isActive ? '0%' : '-2%',
          duration: 1.8,
          ease: 'power2.out',
        })
      }
      if (depthLayer3) {
        gsap.to(depthLayer3, {
          scale: isActive ? 1 : 0.95,
          opacity: isActive ? 1 : 0.5,
          duration: 1.5,
          ease: 'power2.out',
        })
      }
    }, visualRef)

    return () => ctx.revert()
  }, [isActive, prefersReducedMotion])

  const renderVisual = () => {
    switch (categoryKey) {
      case 'insurance':
        return <InsuranceVisual isActive={isActive} title={title} />
      case 'fintech':
        return <FintechVisual isActive={isActive} title={title} uniqueId={uniqueId} />
      case 'creative':
        return <CreativeVisual isActive={isActive} title={title} />
      case 'architecture':
        return <ArchitectureVisual isActive={isActive} title={title} />
      default:
        return <DefaultVisual isActive={isActive} title={title} />
    }
  }

  return (
    <div
      ref={visualRef}
      className="project-visual absolute inset-0 overflow-hidden"
      style={{
        background: '#050505',
        willChange: 'transform, opacity',
      }}
    >
      {/* Depth layer - base atmosphere */}
      <div className="pv-depth-1 absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      {/* Unique visual composition */}
      {renderVisual()}

      {/* Animated accent lines */}
      <div className="pv-line absolute top-0 left-0 h-px origin-left"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.3), transparent)',
          transform: 'scaleX(0)',
        }}
      />
      <div className="pv-line absolute bottom-0 left-0 h-px origin-left"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.2), transparent)',
          transform: 'scaleX(0)',
        }}
      />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 transition-all duration-700"
        style={{
          opacity: isActive ? 0.2 : 0,
          background: 'linear-gradient(135deg, transparent 50%, rgba(125,211,252,0.1) 50%)',
        }}
      />

      {/* Center glow */}
      <div className="pv-depth-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 70%)',
          opacity: isActive ? 0.5 : 0.1,
          transform: `translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`,
        }}
      />

      {/* Title watermark */}
      <div className="pv-title absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span className="font-display text-[clamp(2rem,5vw,5rem)] tracking-tight select-none"
          style={{
            color: '#7dcffd',
            opacity: 0.15,
            transform: 'translateY(20px)',
          }}
        >
          {title}
        </span>
      </div>
    </div>
  )
}

function InsuranceVisual({ isActive, title }: { isActive: boolean; title: string }) {
  return (
    <div className="pv-shape absolute inset-0 transition-all duration-700" style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}>
      {/* Depth layer 3 - background texture */}
      <div className="pv-depth-3 absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(125,211,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Large structural form - grid */}
      <div className="pv-depth-2 absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: 'linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
          opacity: isActive ? 0.5 : 0.2,
        }}
      />

      {/* Interface layer - data cards */}
      <div className="pv-depth-1 absolute top-[15%] left-[10%] w-32 h-20 border border-white/5 bg-white/[0.02] backdrop-blur-none md:backdrop-blur-sm transition-all duration-1000"
        style={{ transform: `translateY(${isActive ? 0 : 10}px)`, opacity: isActive ? 0.6 : 0.3 }}
      />
      <div className="pv-depth-1 absolute top-[25%] left-[25%] w-40 h-24 border border-white/5 bg-white/[0.02] backdrop-blur-none md:backdrop-blur-sm transition-all duration-1000"
        style={{ transform: `translateY(${isActive ? 0 : 15}px)`, opacity: isActive ? 0.5 : 0.2, transitionDelay: '0.1s' }}
      />
      <div className="pv-depth-1 absolute top-[18%] right-[15%] w-36 h-16 border border-white/5 bg-white/[0.02] backdrop-blur-none md:backdrop-blur-sm transition-all duration-1000"
        style={{ transform: `translateY(${isActive ? 0 : 8}px)`, opacity: isActive ? 0.5 : 0.2, transitionDelay: '0.2s' }}
      />

      {/* Foreground detail - data surface lines */}
      <div className="pv-depth-3 absolute top-[45%] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000"
        style={{ transform: `scaleX(${isActive ? 1 : 0.8})`, opacity: isActive ? 0.4 : 0.1 }}
      />
      <div className="pv-depth-3 absolute top-[55%] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000"
        style={{ transform: `scaleX(${isActive ? 1 : 0.7})`, opacity: isActive ? 0.3 : 0.1, transitionDelay: '0.1s' }}
      />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(125,211,252,0.06) 0%, transparent 70%)',
          opacity: isActive ? 0.4 : 0.1,
        }}
      />
    </div>
  )
}

function FintechVisual({ isActive, title, uniqueId }: { isActive: boolean; title: string; uniqueId: string }) {
  const gradientId = `finGrad-${uniqueId.replace(/:/g, '')}`
  return (
    <div className="pv-shape absolute inset-0 transition-all duration-700" style={{ transform: isActive ? 'translateX(5%)' : 'translateX(0)' }}>
      {/* Depth layer 3 - background texture */}
      <div className="pv-depth-3 absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(91,141,239,0.03) 40px, rgba(91,141,239,0.03) 41px)',
        }}
      />

      {/* Large structural form - flowing data lines */}
      <svg className="pv-depth-2 absolute inset-0 w-full h-full opacity-30 transition-all duration-1000"
        viewBox="0 0 400 200" preserveAspectRatio="none"
        style={{ transform: isActive ? 'translateY(0)' : 'translateY(10px)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(91,141,239,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d={isActive ? 'M0,100 Q100,60 200,100 T400,100' : 'M0,100 Q100,140 200,100 T400,100'}
          stroke={`url(#${gradientId})`} strokeWidth="1" fill="none" className="transition-all duration-1000" />
        <path d={isActive ? 'M0,120 Q100,80 200,120 T400,120' : 'M0,120 Q100,160 200,120 T400,120'}
          stroke={`url(#${gradientId})`} strokeWidth="0.5" fill="none" className="transition-all duration-1000" style={{ transitionDelay: '0.2s' }} />
      </svg>

      {/* Interface layer - chart bars */}
      <div className="pv-depth-1 absolute bottom-[20%] left-[15%] flex items-end gap-1 h-24">
        {[40, 65, 45, 80, 55, 70, 50, 85].map((h, i) => (
          <div key={i} className="w-2 bg-gradient-to-t from-blue-500/20 to-blue-400/40 transition-all duration-500"
            style={{
              height: `${h}%`,
              transform: isActive ? 'scaleY(1)' : 'scaleY(0.8)',
              opacity: isActive ? 0.6 : 0.2,
              transitionDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Foreground detail - numerical indicators */}
      <div className="pv-depth-3 absolute top-[20%] right-[10%] text-right">
        <div className="text-[10px] text-blue-300/30 font-mono transition-all duration-500"
          style={{ opacity: isActive ? 0.6 : 0.2 }}>24.8K</div>
        <div className="text-[10px] text-blue-300/20 font-mono mt-1 transition-all duration-500"
          style={{ opacity: isActive ? 0.4 : 0.1, transitionDelay: '0.1s' }}>+12.5%</div>
      </div>

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(91,141,239,0.06) 0%, transparent 70%)',
          opacity: isActive ? 0.4 : 0.1,
        }}
      />
    </div>
  )
}

function CreativeVisual({ isActive, title }: { isActive: boolean; title: string }) {
  return (
    <div className="pv-shape absolute inset-0 transition-all duration-700" style={{ transform: isActive ? 'rotate(8deg) scale(1.1)' : 'rotate(0deg) scale(1)' }}>
      {/* Depth layer 3 - background texture */}
      <div className="pv-depth-3 absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(125,211,252,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Large structural form - abstract orbs */}
      <div className="pv-depth-2 absolute top-[20%] left-[15%] w-32 h-32 rounded-full blur-2xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(125,211,252,0.1) 0%, transparent 70%)',
          opacity: isActive ? 0.5 : 0.2,
          transform: isActive ? 'scale(1.2)' : 'scale(1)',
        }}
      />
      <div className="pv-depth-2 absolute bottom-[25%] right-[20%] w-40 h-40 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(91,141,239,0.08) 0%, transparent 70%)',
          opacity: isActive ? 0.4 : 0.1,
          transform: isActive ? 'scale(1.3)' : 'scale(1)',
          transitionDelay: '0.2s',
        }}
      />

      {/* Interface layer - typography overlay */}
      <div className="pv-depth-1 absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <span className="font-display text-[clamp(1.5rem,4vw,3rem)] text-white/5 select-none transition-all duration-700"
            style={{ transform: isActive ? 'translateY(0)' : 'translateY(20px)' }}>
            {title.split(' ')[0]}
          </span>
          <span className="absolute -top-2 -right-4 text-[10px] text-white/10 font-mono tracking-widest"
            style={{ opacity: isActive ? 0.3 : 0 }}>
            CREATE
          </span>
        </div>
      </div>

      {/* Foreground detail - geometric shapes */}
      <div className="pv-depth-3 absolute top-[30%] right-[25%] w-16 h-16 border border-white/5 rotate-45 transition-all duration-1000"
        style={{ transform: isActive ? 'rotate(90deg) scale(1.2)' : 'rotate(45deg) scale(1)', opacity: isActive ? 0.3 : 0.1 }}
      />
      <div className="pv-depth-3 absolute bottom-[35%] left-[30%] w-12 h-12 border border-white/5 rounded-full transition-all duration-1000"
        style={{ transform: isActive ? 'scale(1.3)' : 'scale(1)', opacity: isActive ? 0.3 : 0.1, transitionDelay: '0.15s' }}
      />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 70%)',
          opacity: isActive ? 0.4 : 0.1,
        }}
      />
    </div>
  )
}

function ArchitectureVisual({ isActive, title }: { isActive: boolean; title: string }) {
  return (
    <div className="pv-shape absolute inset-0 transition-all duration-700" style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}>
      {/* Depth layer 3 - background texture */}
      <div className="pv-depth-3 absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(156,163,175,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(156,163,175,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Large structural form - perspective planes */}
      <div className="pv-depth-2 absolute inset-0 overflow-hidden">
        {/* Horizontal planes with perspective */}
        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.9)', opacity: isActive ? 0.3 : 0.1 }}
        />
        <div className="absolute top-[35%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.85)', opacity: isActive ? 0.2 : 0.05, transitionDelay: '0.1s' }}
        />
        <div className="absolute top-[50%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.9)', opacity: isActive ? 0.3 : 0.1, transitionDelay: '0.2s' }}
        />
        <div className="absolute top-[65%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.85)', opacity: isActive ? 0.2 : 0.05, transitionDelay: '0.3s' }}
        />
        <div className="absolute top-[80%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.9)', opacity: isActive ? 0.3 : 0.1, transitionDelay: '0.4s' }}
        />

        {/* Vertical lines - architectural structure */}
        <div className="absolute top-0 bottom-0 left-[15%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleY(1)' : 'scaleY(0.9)', opacity: isActive ? 0.2 : 0.05 }}
        />
        <div className="absolute top-0 bottom-0 left-[35%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleY(1)' : 'scaleY(0.85)', opacity: isActive ? 0.15 : 0.05, transitionDelay: '0.1s' }}
        />
        <div className="absolute top-0 bottom-0 right-[25%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleY(1)' : 'scaleY(0.9)', opacity: isActive ? 0.2 : 0.05, transitionDelay: '0.2s' }}
        />
        <div className="absolute top-0 bottom-0 right-[10%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent transition-all duration-1000"
          style={{ transform: isActive ? 'scaleY(1)' : 'scaleY(0.85)', opacity: isActive ? 0.15 : 0.05, transitionDelay: '0.3s' }}
        />
      </div>

      {/* Interface layer - geometric forms */}
      <div className="pv-depth-1 absolute top-[15%] left-[20%] w-24 h-32 border border-white/5 transition-all duration-1000"
        style={{
          transform: isActive ? 'perspective(500px) rotateY(-5deg)' : 'perspective(500px) rotateY(-10deg)',
          opacity: isActive ? 0.2 : 0.05,
        }}
      />
      <div className="pv-depth-1 absolute top-[25%] right-[25%] w-20 h-28 border border-white/5 transition-all duration-1000"
        style={{
          transform: isActive ? 'perspective(500px) rotateY(5deg)' : 'perspective(500px) rotateY(10deg)',
          opacity: isActive ? 0.15 : 0.05,
          transitionDelay: '0.2s',
        }}
      />

      {/* Foreground detail - structural accents */}
      <div className="pv-depth-3 absolute bottom-[15%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000"
        style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0.8)', opacity: isActive ? 0.2 : 0.05 }}
      />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(156,163,175,0.06) 0%, transparent 70%)',
          opacity: isActive ? 0.3 : 0.1,
        }}
      />
    </div>
  )
}

function DefaultVisual({ isActive, title }: { isActive: boolean; title: string }) {
  return (
    <div className="pv-shape absolute inset-0 transition-all duration-700" style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}>
      {/* Depth layer 3 - background texture */}
      <div className="pv-depth-3 absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Large structural form - radial gradient */}
      <div className="pv-depth-2 absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(125,211,252,0.08) 0%, transparent 60%)`,
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
        }}
      />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(125,211,252,0.06) 0%, transparent 70%)',
          opacity: isActive ? 0.4 : 0.1,
        }}
      />
    </div>
  )
}
