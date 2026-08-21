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

type AboutSectionProps = {
  data: Profile
}

export default async function AboutSection({ data }: AboutSectionProps) {
  return (
    <section id="about" className="py-32 md:py-48">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          <div className="md:col-span-4">
            <p className="label text-text-muted mb-4 reveal-up">ABOUT</p>
            <div className="w-16 h-px bg-border-default mb-8 reveal-up" />
            {data.availability && (
              <p className="body-sm text-accent mb-4 reveal-up">{data.availability}</p>
            )}
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-display-md text-text-primary mb-12 reveal-up">
              {data.tagline || data.name}
            </h2>
            <div className="max-w-2xl">
              <p className="body-lg text-text-secondary mb-8 reveal-up">
                {data.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
