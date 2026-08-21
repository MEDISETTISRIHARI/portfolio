'use client'

import { Suspense } from 'react'
import CinematicIntro from '@/components/CinematicIntro'
import CustomCursor from '@/components/CustomCursor'
import Navigation from '@/components/Navigation'
import ScrollProvider from '@/components/ScrollProvider'
import Hero from '@/components/Hero'

export default function RootPage() {
  return (
    <ScrollProvider>
      <Suspense fallback={null}>
        <CinematicIntro />
      </Suspense>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </main>
    </ScrollProvider>
  )
}

function AboutSection() {
  return (
    <section id="about" className="py-32 md:py-48">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          <div className="md:col-span-4">
            <p className="label text-text-muted mb-4 reveal-up">ABOUT</p>
            <div className="w-16 h-px bg-border-default mb-8 reveal-up" />
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-display-md text-text-primary mb-12 reveal-up">
              I DESIGN.<br />
              I BUILD.<br />
              I EXPERIMENT.
            </h2>
            <div className="max-w-2xl">
              <p className="body-lg text-text-secondary mb-8 reveal-up">
                I'm Alex, a creative web designer and developer focused on building modern digital experiences.
              </p>
              <p className="body-md text-text-secondary reveal-up">
                I combine design, technology and motion to create interfaces that are visually distinctive and genuinely usable. Every project is an opportunity to push boundaries and craft something memorable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  return (
    <section id="skills" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {['DESIGN', 'DEVELOPMENT', 'MOTION', 'EXPERIENCE'].map((category, i) => (
            <div key={category} className="reveal-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="label text-text-muted mb-6">{category}</p>
              <ul className="space-y-3">
                {category === 'DESIGN' && <>
                  <li className="body-md text-text-primary">UI / UX</li>
                  <li className="body-md text-text-primary">Visual Design</li>
                  <li className="body-md text-text-primary">Design Systems</li>
                  <li className="body-md text-text-primary">Responsive Design</li>
                </>}
                {category === 'DEVELOPMENT' && <>
                  <li className="body-md text-text-primary">HTML</li>
                  <li className="body-md text-text-primary">CSS</li>
                  <li className="body-md text-text-primary">JavaScript</li>
                  <li className="body-md text-text-primary">React</li>
                  <li className="body-md text-text-primary">TypeScript</li>
                </>}
                {category === 'MOTION' && <>
                  <li className="body-md text-text-primary">GSAP</li>
                  <li className="body-md text-text-primary">Scroll Animation</li>
                  <li className="body-md text-text-primary">Interaction Design</li>
                </>}
                {category === 'EXPERIENCE' && <>
                  <li className="body-md text-text-primary">Creative Development</li>
                  <li className="body-md text-text-primary">Performance</li>
                  <li className="body-md text-text-primary">Deployment</li>
                </>}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section id="work" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p className="label text-text-muted mb-4 reveal-up">SELECTED WORK</p>
            <h2 className="font-display text-display-md text-text-primary reveal-up">PROJECTS</h2>
          </div>
          <p className="body-sm text-text-muted reveal-up hidden md:block">01 — 04</p>
        </div>
        <div className="space-y-24 md:space-y-48">
          {[
            { num: '01', title: 'NOVA INSURANCE', cat: 'Insurance / Digital Platform', year: '2024' },
            { num: '02', title: 'AETHER FINANCE', cat: 'Fintech / Dashboard', year: '2024' },
            { num: '03', title: 'LUMINA STUDIOS', cat: 'Creative Agency', year: '2023' },
            { num: '04', title: 'TERRA ARCHITECTS', cat: 'Architecture', year: '2023' },
          ].map((project, i) => (
            <div key={project.num} className="group relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-2">
                  <p className="font-display text-display-sm text-text-muted group-hover:text-accent transition-colors duration-500 reveal-up">
                    {project.num}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-display text-display-md text-text-primary mb-4 group-hover:text-accent transition-colors duration-500 reveal-up">
                    {project.title}
                  </h3>
                  <p className="body-md text-text-secondary mb-2 reveal-up">{project.cat}</p>
                  <p className="body-sm text-text-muted reveal-up">{project.year}</p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <span className="label text-text-muted group-hover:text-accent transition-colors duration-500 reveal-up">
                    VIEW PROJECT
                  </span>
                </div>
              </div>
              <div className="mt-8 md:mt-12 w-full aspect-video bg-surface-elevated border border-border-subtle overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-foreground opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="label text-text-muted">PROJECT VISUAL</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <p className="label text-text-muted mb-16 reveal-up">TESTIMONIALS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            { name: 'Sarah Chen', role: 'CEO', company: 'Nova Insurance', quote: 'The attention to detail is extraordinary. Every pixel, every transition feels intentional and premium.' },
            { name: 'Marcus Webb', role: 'CTO', company: 'Aether Finance', quote: 'Not just beautiful — deeply functional. The performance is outstanding and animations never feel like filler.' },
            { name: 'Elena Rossi', role: 'Creative Director', company: 'Lumina Studios', quote: 'They understood our vision immediately and elevated it beyond what we imagined.' },
          ].map((t, i) => (
            <div key={t.name} className="surface p-8 md:p-10 reveal-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <p className="body-md text-text-secondary mb-8 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="body-sm text-text-primary font-medium">{t.name}</p>
                <p className="body-sm text-text-muted">{t.role}, {t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <p className="label text-text-muted mb-6 reveal-up">CONTACT</p>
          <h2 className="font-display text-display-md text-text-primary mb-8 reveal-up">
            HAVE AN IDEA?
          </h2>
          <h3 className="font-display text-display-sm text-text-secondary mb-16 reveal-up">
            LET'S BUILD SOMETHING<br />WORTH REMEMBERING.
          </h3>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="reveal-up">
                <label className="label text-text-muted block mb-3">NAME</label>
                <input
                  type="text"
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                  placeholder="Your name"
                />
              </div>
              <div className="reveal-up">
                <label className="label text-text-muted block mb-3">EMAIL</label>
                <input
                  type="email"
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="reveal-up">
                <label className="label text-text-muted block mb-3">PROJECT TYPE</label>
                <select className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300">
                  <option value="">Select project type</option>
                  <option value="website">Website</option>
                  <option value="webapp">Web Application</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="reveal-up">
                <label className="label text-text-muted block mb-3">BUDGET</label>
                <select className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300">
                  <option value="">Select budget range</option>
                  <option value="5k-10k">$5,000 — $10,000</option>
                  <option value="10k-25k">$10,000 — $25,000</option>
                  <option value="25k-50k">$25,000 — $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
            </div>
            <div className="reveal-up">
              <label className="label text-text-muted block mb-3">MESSAGE</label>
              <textarea
                rows={6}
                className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <div className="pt-4 reveal-up">
              <button
                type="submit"
                className="px-10 py-4 bg-text-primary text-background text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300"
              >
                START A PROJECT
              </button>
            </div>
          </form>

          <div className="mt-24 pt-12 border-t border-border-subtle">
            <p className="body-sm text-text-muted">
              Or email directly at{' '}
              <a href="mailto:hello@example.com" className="text-text-primary hover:text-accent transition-colors duration-300">
                hello@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-16 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <p className="font-display text-display-sm text-text-primary mb-2">SRIHARI</p>
            <p className="body-sm text-text-muted">DIGITAL EXPERIENCES</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://instagram.com/demo.creator" className="body-sm text-text-muted hover:text-text-primary transition-colors duration-300">Instagram</a>
            <a href="https://github.com/demo.developer" className="body-sm text-text-muted hover:text-text-primary transition-colors duration-300">GitHub</a>
            <a href="https://linkedin.com/in/demo.designer" className="body-sm text-text-muted hover:text-text-primary transition-colors duration-300">LinkedIn</a>
          </div>
          <p className="body-sm text-text-muted">© 2026</p>
        </div>
      </div>
    </footer>
  )
}
