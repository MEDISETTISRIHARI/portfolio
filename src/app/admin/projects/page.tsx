'use client'

import { FormEvent, useState } from 'react'
import {
  AdminShell,
  Area,
  Check,
  Field,
  ImageUpload,
  Notice,
  SaveButton,
  emptyProject,
  useAdminData,
  ProjectData,
} from '@/components/admin/AdminUI'

export default function ProjectsAdmin() {
  const editor = useAdminData<ProjectData[]>(
    'projects',
    []
  )

  const [editing, setEditing] =
    useState<ProjectData | null>(null)

  function newProject() {
    setEditing({
      ...emptyProject,
      order: editor.data.length,
    })
  }

  function editProject(project: ProjectData) {
    setEditing({
      ...emptyProject,
      ...project,
      gallery: normaliseList(project.gallery),
      technologies: normaliseList(project.technologies),
    })
  }

  function normaliseList(value: unknown) {
    if (!value) return ''

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    const text = String(value)

    try {
      const parsed = JSON.parse(text)

      if (Array.isArray(parsed)) {
        return parsed.join(', ')
      }
    } catch {}

    return text
  }

  async function submit(e: FormEvent) {
    e.preventDefault()

    if (!editing) return

    const payload = {
      ...editing,
      gallery: editing.gallery
        .split(',')
        .map(x => x.trim())
        .filter(Boolean),

      technologies: editing.technologies
        .split(',')
        .map(x => x.trim())
        .filter(Boolean),
    }

    const ok = await editor.save(payload)

    if (ok) {
      setEditing(null)
    }
  }

  async function remove(project: ProjectData) {
    if (!project.id) return

    const confirmed = window.confirm(
      `Delete "${project.title}"?`
    )

    if (!confirmed) return

    await editor.remove(project.id)
  }

  if (editor.loading) {
    return (
      <AdminShell
        title="Projects"
        description="Manage your portfolio projects."
      >
        <p className="text-white/40">
          Loading projects…
        </p>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Projects"
      description="Add, edit, publish and remove your portfolio projects."
    >
      <div className="space-y-6">

        <Notice
          error={editor.error}
          message={editor.message}
        />

        {!editing && (
          <>
            <button
              type="button"
              onClick={newProject}
              className="w-full border border-white/20 bg-white px-5 py-4 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + ADD NEW PROJECT
            </button>

            {editor.data.length === 0 && (
              <div className="border border-white/10 p-8 text-center text-white/40">
                No projects yet.
              </div>
            )}

            {editor.data.map(project => (
              <div
                key={project.id}
                className="border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-white/40">
                      {project.category}
                    </p>

                    <h2 className="mt-2 text-2xl font-medium">
                      {project.title}
                    </h2>

                    <p className="mt-2 text-sm text-white/50">
                      {project.shortDesc}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="border border-white/10 px-3 py-1 text-white/50">
                        {project.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>

                      {project.featured && (
                        <span className="border border-white/10 px-3 py-1 text-white/50">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                      className="border border-white/20 px-4 py-3 text-sm hover:bg-white hover:text-black"
                    >
                      EDIT
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(project)}
                      className="border border-red-500/30 px-4 py-3 text-sm text-red-300 hover:bg-red-500 hover:text-white"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {editing && (
          <form
            onSubmit={submit}
            className="space-y-6"
          >
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm text-white/50 hover:text-white"
            >
              ← CANCEL
            </button>

            <Field
              label="Title"
              value={editing.title}
              onChange={v =>
                setEditing({
                  ...editing,
                  title: v,
                })
              }
              placeholder="Personal Portfolio & CMS Platform"
            />

            <Field
              label="Slug"
              value={editing.slug}
              onChange={v =>
                setEditing({
                  ...editing,
                  slug: v,
                })
              }
              placeholder="personal-portfolio-cms"
            />

            <Field
              label="Category"
              value={editing.category}
              onChange={v =>
                setEditing({
                  ...editing,
                  category: v,
                })
              }
              placeholder="Web Development"
            />

            <Field
              label="Year"
              value={editing.year}
              onChange={v =>
                setEditing({
                  ...editing,
                  year: v,
                })
              }
              placeholder="2026"
            />

            <Area
              label="Short description"
              value={editing.shortDesc}
              onChange={v =>
                setEditing({
                  ...editing,
                  shortDesc: v,
                })
              }
              rows={4}
            />

            <Area
              label="Full description"
              value={editing.fullDesc}
              onChange={v =>
                setEditing({
                  ...editing,
                  fullDesc: v,
                })
              }
              rows={9}
            />

            <ImageUpload
              label="Thumbnail"
              value={editing.thumbnail}
              onChange={v =>
                setEditing({
                  ...editing,
                  thumbnail: v,
                })
              }
            />

            <ImageUpload
              label="Hero image"
              value={editing.heroImage}
              onChange={v =>
                setEditing({
                  ...editing,
                  heroImage: v,
                })
              }
            />

            <ImageUpload
              label="Gallery images"
              value={editing.gallery}
              onChange={v =>
                setEditing({
                  ...editing,
                  gallery: v,
                })
              }
              multiple
            />

            <Field
              label="Video"
              value={editing.video}
              onChange={v =>
                setEditing({
                  ...editing,
                  video: v,
                })
              }
              placeholder="/videos/project.mp4"
            />

            <Area
              label="Technologies"
              value={editing.technologies}
              onChange={v =>
                setEditing({
                  ...editing,
                  technologies: v,
                })
              }
              placeholder="Next.js, React, TypeScript, SQLite"
              rows={4}
            />

            <Field
              label="Live URL"
              value={editing.liveUrl}
              onChange={v =>
                setEditing({
                  ...editing,
                  liveUrl: v,
                })
              }
              placeholder="https://example.com"
            />

            <Area
              label="Case study"
              value={editing.caseStudy}
              onChange={v =>
                setEditing({
                  ...editing,
                  caseStudy: v,
                })
              }
              rows={6}
            />

            <Field
              label="Order"
              type="number"
              value={editing.order}
              onChange={v =>
                setEditing({
                  ...editing,
                  order: Number(v || 0),
                })
              }
            />

            <Check
              label="Featured project"
              checked={editing.featured}
              onChange={v =>
                setEditing({
                  ...editing,
                  featured: v,
                })
              }
            />

            <Check
              label="Published"
              checked={editing.published}
              onChange={v =>
                setEditing({
                  ...editing,
                  published: v,
                })
              }
            />

            <Notice
              error={editor.error}
              message={editor.message}
            />

            <SaveButton saving={editor.saving}>
              SAVE PROJECT
            </SaveButton>
          </form>
        )}
      </div>
    </AdminShell>
  )
}
