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

export default async function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <section id="services" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <p className="label text-text-muted mb-16 reveal-up">SERVICES</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {data.map((service, i) => (
            <div key={service.id} className="reveal-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <h3 className="font-display text-heading-md text-text-primary mb-4">{service.title}</h3>
              <p className="body-md text-text-secondary">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
