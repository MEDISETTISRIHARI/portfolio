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
    <section id="testimonials" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <p className="label text-text-muted mb-16 reveal-up">TESTIMONIALS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {data.map((t, i) => (
            <div key={t.id} className="surface p-8 md:p-10 reveal-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <p className="body-md text-text-secondary mb-8 italic">&ldquo;{t.quote}&rdquo;</p>
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
