import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicContent } from '@/lib/publicContent'

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const content = await getPublicContent()

  const project = content.projects.find(
    (item: any) => item.slug === slug && item.published
  )

  if (!project) {
    notFound()
  }

  const gallery = Array.isArray(project.gallery)
    ? project.gallery
    : []

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : []

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="container mx-auto px-6 py-10 md:px-10 lg:px-16">

        <Link
          href="/#work"
          className="label text-text-muted hover:text-text-primary transition-colors"
        >
          ← BACK TO PROJECTS
        </Link>

        <header className="max-w-5xl pt-20 md:pt-32">
          <p className="label text-text-muted mb-5">
            {project.category}
            {project.year ? ` / ${project.year}` : ''}
          </p>

          <h1 className="font-display text-display-lg text-text-primary">
            {project.title}
          </h1>

          {project.shortDesc && (
            <p className="body-lg text-text-secondary mt-8 max-w-3xl">
              {project.shortDesc}
            </p>
          )}
        </header>

        {project.heroImage && (
          <div className="mt-16 md:mt-24 w-full overflow-hidden border border-border-subtle">
            <img
              src={project.heroImage}
              alt={`${project.title} hero`}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 py-20 md:py-32">

          <div className="md:col-span-8">
            <p className="label text-text-muted mb-6">
              ABOUT THE PROJECT
            </p>

            <div className="body-lg text-text-secondary whitespace-pre-line">
              {project.fullDesc || project.shortDesc}
            </div>
          </div>

          <aside className="md:col-span-4">

            {technologies.length > 0 && (
              <div>
                <p className="label text-text-muted mb-5">
                  TECHNOLOGIES
                </p>

                <div className="flex flex-wrap gap-2">
                  {technologies.map((technology: string, index: number) => (
                    <span
                      key={`${technology}-${index}`}
                      className="border border-border-subtle px-3 py-2 body-sm text-text-secondary"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-10 label text-text-primary hover:text-accent transition-colors"
              >
                VISIT LIVE WEBSITE →
              </a>
            )}

          </aside>
        </section>

        {gallery.length > 0 && (
          <section className="pb-20 md:pb-32">

            <p className="label text-text-muted mb-8">
              PROJECT GALLERY
            </p>

            <div className="space-y-10">
              {gallery.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="w-full overflow-hidden border border-border-subtle"
                >
                  <img
                    src={image}
                    alt={`${project.title} gallery ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>

          </section>
        )}

        {project.video && (
          <section className="pb-20 md:pb-32">
            <p className="label text-text-muted mb-8">
              PROJECT VIDEO
            </p>

            <video
              src={project.video}
              controls
              className="w-full border border-border-subtle"
            />
          </section>
        )}

      </div>
    </main>
  )
}