type Testimonial = {
  id: string
  name: string
  role?: string | null
  company?: string | null
  quote: string
  image?: string | null
  visible: boolean
  order: number
}

type TestimonialsSectionProps = {
  data: Testimonial[]
}

export default async function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" data-scroll-section="testimonials" className="py-32 md:py-48 border-t border-border-subtle relative">
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />
      <div className="container mx-auto px-6">
        <p className="label text-text-muted mb-16" data-scroll-reveal>TESTIMONIALS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {data.map((t, i) => (
            <div key={t.id} className="surface p-8 md:p-10" data-scroll-reveal>
              <p className="body-md text-text-secondary mb-8 italic" style={{ lineHeight: '1.6' }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="body-sm text-text-primary font-medium">{t.name}</p>
                <p className="body-sm text-text-muted">
                  {t.role}
                  {t.role && t.company ? ', ' : ''}
                  {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
