'use client'

import { useState } from 'react'

type Skill = {
  id: string
  category: string
  title: string
  items: string
  order: number
  visible: boolean
}

type SkillsSectionProps = {
  data: Skill[]
}

export default function SkillsSection({ data }: SkillsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="skills" data-scroll-section="skills" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {data.map((skill, i) => {
            const isHovered = hoveredIndex === i
            return (
              <div
                key={skill.id}
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
                <p
                  className="label text-text-muted mb-6 transition-all duration-500"
                  style={{
                    letterSpacing: isHovered ? '0.2em' : '0.1em',
                    color: isHovered ? '#F4F4F0' : '#626262',
                  }}
                >
                  {skill.category}
                </p>
                <ul
                  className="space-y-3 overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isHovered ? '200px' : '0px',
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  {skill.items.split('\n').map((item, j) => (
                    <li
                      key={j}
                      className="body-md text-text-primary transition-all duration-300"
                      style={{
                        transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                        opacity: isHovered ? 1 : 0,
                        transitionDelay: isHovered ? `${j * 0.05}s` : '0s',
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
