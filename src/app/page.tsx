'use client'

import { normalizeExternalUrl } from '@/lib/externalUrl'
import { Suspense } from 'react'

import CinematicIntro from '@/components/CinematicIntro'
import CustomCursor from '@/components/CustomCursor'
import Navigation from '@/components/Navigation'
import ScrollProvider from '@/components/ScrollProvider'
import Hero from '@/components/Hero'

import { usePortfolioContent } from '@/lib/usePortfolioContent'

export default function RootPage() {
  const content = usePortfolioContent()

  return (
    <ScrollProvider>

      <Suspense fallback={null}>
        <CinematicIntro />
      </Suspense>

      <CustomCursor />

      <Navigation />

      <main>

        {/*
          IMPORTANT:

          The existing Hero component is intentionally
          preserved here.

          We are NOT replacing your 3D / cinematic system.
        */}
        <Hero />

        <AboutSection profile={content.profile} />

        <SkillsSection skills={content.skills} />

        <ProjectsSection projects={content.projects} />

        <ServicesSection services={content.services} />

        <TestimonialsSection
          testimonials={content.testimonials}
        />

        <ContactSection
          profile={content.profile}
        />

        <Footer
          profile={content.profile}
          socials={content.socials}
        />

      </main>

    </ScrollProvider>
  )
}


/* ================================================
   ABOUT
================================================ */

function AboutSection({
  profile,
}: {
  profile: any
}) {
  const name =
    profile?.name || 'Creative Developer'

  const role =
    profile?.role ||
    'Creative web designer and developer'

  const bio =
    profile?.bio ||
    'I combine design, technology and motion to create interfaces that are visually distinctive and genuinely usable.'

  return (
    <section
      id="about"
      className="py-32 md:py-48"
    >
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">

          <div className="md:col-span-4">

            <p className="label text-text-muted mb-4 reveal-up">
              ABOUT
            </p>

            <div className="w-16 h-px bg-border-default mb-8 reveal-up" />

            {profile?.location && (
              <p className="body-sm text-text-muted reveal-up">
                {profile.location}
              </p>
            )}

          </div>

          <div className="md:col-span-8">

            <h2 className="font-display text-display-md text-text-primary mb-12 reveal-up">

              {name.toUpperCase()}

            </h2>

            <div className="max-w-2xl">

              <p className="body-lg text-text-secondary mb-8 reveal-up">
                {role}
              </p>

              <p className="body-md text-text-secondary reveal-up">
                {bio}
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}


/* ================================================
   SKILLS
================================================ */

function SkillsSection({
  skills,
}: {
  skills: any[]
}) {
  if (!skills.length) {
    return null
  }

  return (
    <section
      id="skills"
      className="py-32 md:py-48 border-t border-border-subtle"
    >
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">

          {skills.map((skill, index) => {

            let items: string[] = []

            if (Array.isArray(skill.items)) {
              items = skill.items
            } else if (typeof skill.items === 'string') {
              try {
                const parsed = JSON.parse(skill.items)

                if (Array.isArray(parsed)) {
                  items = parsed
                } else {
                  items = skill.items
                    .split(',')
                    .map((item: string) => item.trim())
                    .filter(Boolean)
                }
              } catch {
                items = skill.items
                  .split(',')
                  .map((item: string) => item.trim())
                  .filter(Boolean)
              }
            }

            return (
              <div
                key={skill.id || index}
                className="reveal-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >

                <p className="label text-text-muted mb-6">
                  {skill.category || skill.title}
                </p>

                <ul className="space-y-3">

                  {items.map(
                    (item: string, itemIndex: number) => (
                      <li
                        key={`${item}-${itemIndex}`}
                        className="body-md text-text-primary"
                      >
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}


/* ================================================
   PROJECTS
================================================ */

function ProjectsSection({
  projects,
}: {
  projects: any[]
}) {
  if (!projects.length) {
    return null
  }

  return (
    <section
      id="work"
      className="py-32 md:py-48 border-t border-border-subtle"
    >
      <div className="container mx-auto px-6">

        <div className="flex items-end justify-between mb-16 md:mb-24">

          <div>

            <p className="label text-text-muted mb-4 reveal-up">
              SELECTED WORK
            </p>

            <h2 className="font-display text-display-md text-text-primary reveal-up">
              PROJECTS
            </h2>

          </div>

          <p className="body-sm text-text-muted reveal-up hidden md:block">
            {String(projects.length).padStart(2, '0')} PROJECTS
          </p>

        </div>

        <div className="space-y-24 md:space-y-48">

          {projects.map((project, index) => (

            <article
              key={project.id || project.slug || index}
              className="group relative reveal-up"
            >

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">

                <div className="md:col-span-2">

                  <p className="font-display text-display-sm text-text-muted group-hover:text-accent transition-colors duration-500">

                    {String(index + 1).padStart(2, '0')}

                  </p>

                </div>

                <div className="md:col-span-8">

                  <h3 className="font-display text-display-md text-text-primary mb-4 group-hover:text-accent transition-colors duration-500">

                    {project.title}

                  </h3>

                  {project.category && (
                    <p className="body-md text-text-secondary mb-2">
                      {project.category}
                    </p>
                  )}

                  {project.year && (
                    <p className="body-sm text-text-muted">
                      {project.year}
                    </p>
                  )}

                  {project.shortDesc && (
                    <p className="body-md text-text-secondary mt-6 max-w-2xl">
                      {project.shortDesc}
                    </p>
                  )}

                </div>

                <div className="md:col-span-2 md:text-right">

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="label text-text-muted group-hover:text-accent transition-colors duration-500"
                    >
                      VIEW PROJECT
                    </a>
                  ) : (
                    <span className="label text-text-muted group-hover:text-accent transition-colors duration-500">
                      PROJECT
                    </span>
                  )}

                </div>

              </div>

              <div className="mt-8 md:mt-12 w-full aspect-video bg-surface-elevated border border-border-subtle overflow-hidden relative">

                {project.heroImage ||
                project.thumbnail ? (

                  <img
                    src={
                      project.heroImage ||
                      project.thumbnail
                    }
                    alt={project.title || 'Project'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                ) : (

                  <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-foreground opacity-50" />

                )}

              </div>

            </article>

          ))}

        </div>

      </div>
    </section>
  )
}


/* ================================================
   SERVICES
================================================ */

function ServicesSection({
  services,
}: {
  services: any[]
}) {
  if (!services.length) {
    return null
  }

  return (
    <section
      id="services"
      className="py-32 md:py-48 border-t border-border-subtle"
    >
      <div className="container mx-auto px-6">

        <p className="label text-text-muted mb-16 reveal-up">
          SERVICES
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {services.map((service, index) => (

            <div
              key={service.id || index}
              className="surface p-8 md:p-10 reveal-up"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >

              <h3 className="font-display text-display-sm text-text-primary mb-6">
                {service.title}
              </h3>

              <p className="body-md text-text-secondary">
                {service.desc}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  )
}


/* ================================================
   TESTIMONIALS
================================================ */

function TestimonialsSection({
  testimonials,
}: {
  testimonials: any[]
}) {
  if (!testimonials.length) {
    return null
  }

  return (
    <section
      id="testimonials"
      className="py-32 md:py-48 border-t border-border-subtle"
    >
      <div className="container mx-auto px-6">

        <p className="label text-text-muted mb-16 reveal-up">
          TESTIMONIALS
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {testimonials.map((testimonial, index) => (

            <div
              key={testimonial.id || index}
              className="surface p-8 md:p-10 reveal-up"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            >

              <p className="body-md text-text-secondary mb-8 italic">
                &ldquo;
                {testimonial.quote}
                &rdquo;
              </p>

              <div>

                <p className="body-sm text-text-primary font-medium">
                  {testimonial.name}
                </p>

                {(testimonial.role ||
                  testimonial.company) && (

                  <p className="body-sm text-text-muted">

                    {testimonial.role}

                    {testimonial.role &&
                    testimonial.company
                      ? ', '
                      : ''}

                    {testimonial.company}

                  </p>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  )
}


/* ================================================
   CONTACT
================================================ */

function ContactSection({
  profile,
}: {
  profile: any
}) {
  async function submitContact(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form =
      event.currentTarget

    const formData =
      new FormData(form)

    const payload = {
      name:
        formData.get('name') || '',
      email:
        formData.get('email') || '',
      projectType:
        formData.get('projectType') || '',
      budget:
        formData.get('budget') || '',
      message:
        formData.get('message') || '',
    }

    try {
      const response = await fetch(
        '/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to send message'
        )
      }

      form.reset()

      alert(
        'Thanks! Your message has been sent.'
      )
    } catch (error) {
      console.error(error)

      alert(
        'Unable to send your message right now.'
      )
    }
  }

  return (
    <section
      id="contact"
      className="py-32 md:py-48 border-t border-border-subtle"
    >
      <div className="container mx-auto px-6">

        <div className="max-w-4xl">

          <p className="label text-text-muted mb-6 reveal-up">
            CONTACT
          </p>

          <h2 className="font-display text-display-md text-text-primary mb-8 reveal-up">
            HAVE AN IDEA?
          </h2>

          <h3 className="font-display text-display-sm text-text-secondary mb-16 reveal-up">
            LET&apos;S BUILD SOMETHING
            <br />
            WORTH REMEMBERING.
          </h3>

          <form
            className="space-y-8"
            onSubmit={submitContact}
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="reveal-up">

                <label className="label text-text-muted block mb-3">
                  NAME
                </label>

                <input
                  name="name"
                  required
                  type="text"
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                  placeholder="Your name"
                />

              </div>

              <div className="reveal-up">

                <label className="label text-text-muted block mb-3">
                  EMAIL
                </label>

                <input
                  name="email"
                  required
                  type="email"
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                  placeholder={
                    profile?.email ||
                    'your@email.com'
                  }
                />

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="reveal-up">

                <label className="label text-text-muted block mb-3">
                  PROJECT TYPE
                </label>

                <select
                  name="projectType"
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                >
                  <option value="">
                    Select project type
                  </option>

                  <option value="website">
                    Website
                  </option>

                  <option value="webapp">
                    Web Application
                  </option>

                  <option value="ecommerce">
                    E-commerce
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>

              <div className="reveal-up">

                <label className="label text-text-muted block mb-3">
                  BUDGET
                </label>

                <select
                  name="budget"
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                >

                  <option value="">
                    Select budget range
                  </option>

                  <option value="5k-10k">
                    $5,000 — $10,000
                  </option>

                  <option value="10k-25k">
                    $10,000 — $25,000
                  </option>

                  <option value="25k-50k">
                    $25,000 — $50,000
                  </option>

                  <option value="50k+">
                    $50,000+
                  </option>

                </select>

              </div>

            </div>

            <div className="reveal-up">

              <label className="label text-text-muted block mb-3">
                MESSAGE
              </label>

              <textarea
                name="message"
                required
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

              <a
                href={`mailto:${
                  profile?.email ||
                  'hello@example.com'
                }`}
                className="text-text-primary hover:text-accent transition-colors duration-300"
              >
                {profile?.email ||
                  'hello@example.com'}
              </a>

            </p>

          </div>

        </div>

      </div>
    </section>
  )
}


/* ================================================
   FOOTER
================================================ */

function Footer({
  profile,
  socials,
}: {
  profile: any
  socials: any[]
}) {
  return (
    <footer className="border-t border-border-subtle py-12">

      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between gap-8">

          <p className="body-sm text-text-muted">
            © {new Date().getFullYear()}{' '}
            {profile?.name ||
              'Portfolio'}
          </p>

          {socials.length > 0 && (

            <div className="flex flex-wrap gap-6">

              {socials.map(
                (
                  social,
                  index
                ) => (

                  <a
                    key={
                      social.id ||
                      index
                    }
                    href={normalizeExternalUrl(social.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="body-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {social.platform ||
                      social.username}
                  </a>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </footer>
  )
}