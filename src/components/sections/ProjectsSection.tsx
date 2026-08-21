type Project = {
  id: string
  title: string
  slug: string
  category: string
  year: string
  shortDesc: string
  fullDesc?: string | null
  thumbnail: string
  heroImage?: string | null
  gallery?: string | null
  video?: string | null
  technologies: string
  liveUrl?: string | null
  caseStudy?: string | null
  featured: boolean
  published: boolean
  order: number
}

type ProjectsSectionProps = {
  data: Project[]
}

export default async function ProjectsSection({ data }: ProjectsSectionProps) {
  return (
    <section id="work" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p className="label text-text-muted mb-4 reveal-up">SELECTED WORK</p>
            <h2 className="font-display text-display-md text-text-primary reveal-up">PROJECTS</h2>
          </div>
          <p className="body-sm text-text-muted reveal-up hidden md:block">
            {String(data.length).padStart(2, '0')} — {String(data.length).padStart(2, '0')}
          </p>
        </div>
        <div className="space-y-24 md:space-y-48">
          {data.map((project, i) => {
            const href = project.caseStudy || project.liveUrl || '#'
            return (
              <div key={project.id} className="group relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-2">
                    <p className="font-display text-display-sm text-text-muted group-hover:text-accent transition-colors duration-500 reveal-up">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="font-display text-display-md text-text-primary mb-4 group-hover:text-accent transition-colors duration-500 reveal-up">
                      {project.title}
                    </h3>
                    <p className="body-md text-text-secondary mb-2 reveal-up">{project.category}</p>
                    <p className="body-sm text-text-muted reveal-up">{project.year}</p>
                  </div>
                  <div className="md:col-span-2 md:text-right">
                    <a
                      href={href}
                      className="label text-text-muted group-hover:text-accent transition-colors duration-500 reveal-up"
                    >
                      VIEW PROJECT
                    </a>
                  </div>
                </div>
                <div className="mt-8 md:mt-12 w-full aspect-video bg-surface-elevated border border-border-subtle overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-foreground opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="label text-text-muted">PROJECT VISUAL</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
