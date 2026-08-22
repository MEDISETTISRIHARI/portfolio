import { Suspense } from 'react'
import CinematicIntro from '@/components/CinematicIntro'
import CustomCursor from '@/components/CustomCursor'
import Navigation from '@/components/Navigation'
import ScrollExperience from '@/components/ScrollExperience'
import Hero from '@/components/Hero'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/sections/Footer'
import { getHero, getProfile, getProjects, getSkills, getServices, getTestimonials, getSocials } from '@/lib/data'

export default async function RootPage() {
  const [hero, profile, projects, skills, services, testimonials, socials] = await Promise.all([
    getHero(),
    getProfile(),
    getProjects(),
    getSkills(),
    getServices(),
    getTestimonials(),
    getSocials(),
  ])

  return (
    <>
      <Suspense fallback={null}>
        <CinematicIntro />
      </Suspense>
      <CustomCursor />
      <Navigation />
      <ScrollExperience>
        <main>
          <Hero
            data={{
              headline: hero.headline,
              subtitle: hero.subtitle,
              description: hero.description,
              image: hero.image,
              video: hero.video,
              visualMode: hero.visualMode,
              ctaText: hero.ctaText,
              ctaLink: hero.ctaLink,
              secondaryCta: hero.secondaryCta,
              secondaryLink: hero.secondaryLink,
            }}
            role={profile.role}
          />
          <AboutSection data={profile} />
          <SkillsSection data={skills} />
          <ServicesSection data={services} />
          <ProjectsSection data={projects} />
          <TestimonialsSection data={testimonials} />
          <ContactSection email={profile.email} />
          <Footer socials={socials} profile={profile} />
        </main>
      </ScrollExperience>
    </>
  )
}
