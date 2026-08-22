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
  const headline = data.tagline || data.name
  const words = headline.split(' ')
  const capabilities = ['DESIGN', 'DEVELOPMENT', 'MOTION', 'EXPERIENCE']

  return (
    <section id="about" data-scroll-section="about" className="py-32 md:py-48 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          <div className="md:col-span-4 relative">
            <p className="label text-text-muted mb-4" data-scroll-reveal data-scroll-parallax="0.1">01 — ABOUT</p>
            <div className="w-16 h-px bg-border-default mb-8" data-scroll-reveal />
            {data.availability && (
              <p className="body-sm text-accent mb-4" data-scroll-reveal>{data.availability}</p>
            )}
            <div className="space-y-2 mt-8">
              {capabilities.map((cap, i) => (
                <p
                  key={cap}
                  className="caption text-text-muted"
                  data-scroll-reveal
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {cap}
                </p>
              ))}
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="overflow-hidden mb-8">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                {words.map((word, i) => (
                  <span
                    key={i}
                    className="font-display text-display-md text-text-primary inline-block"
                    data-scroll-reveal
                    data-scroll-blur
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <div className="max-w-2xl" data-scroll-reveal data-scroll-parallax="0.2">
              <p className="body-lg text-text-secondary mb-8" style={{ lineHeight: '1.6' }}>
                {data.bio}
              </p>
            </div>
            <div className="w-24 h-px bg-border-default mt-12" data-scroll-reveal />
          </div>
        </div>
      </div>
    </section>
  )
}
