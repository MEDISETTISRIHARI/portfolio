'use client'

import { useState } from 'react'

type Service = {
  id: string
  title: string
  desc: string
  order: number
  visible: boolean
}

type ServicesSectionProps = {
  data: Service[]
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="services" data-scroll-section="services" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <p className="label text-text-muted mb-16" data-scroll-reveal>SERVICES</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {data.map((service, i) => {
            const isHovered = hoveredIndex === i
            return (
              <div
                key={service.id}
                className="group relative cursor-pointer"
                data-scroll-reveal
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-baseline gap-4 mb-6">
                  <span
                    className="font-display text-display-sm transition-all duration-500"
                    style={{
                      color: isHovered ? '#7dd3fc' : '#626262',
                      transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="h-px transition-all duration-500"
                    style={{
                      width: isHovered ? '32px' : '0px',
                      backgroundColor: '#7dd3fc',
                    }}
                  />
                </div>
                <h3
                  className="font-display text-heading-md text-text-primary mb-4 transition-all duration-500"
                  style={{
                    letterSpacing: isHovered ? '-0.02em' : '-0.01em',
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="body-md text-text-secondary transition-all duration-500"
                  style={{
                    opacity: isHovered ? 1 : 0.7,
                    transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                  }}
                >
                  {service.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
