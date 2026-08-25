'use client'

import { FormEvent } from 'react'
import {
  AdminShell,
  Area,
  Field,
  ImageUpload,
  Notice,
  SaveButton,
  emptyHero,
  useAdminData,
  HeroData,
} from '@/components/admin/AdminUI'

export default function HeroAdmin() {
  const editor = useAdminData<HeroData>(
    'hero',
    emptyHero
  )

  const hero = editor.data

  function update(
    key: keyof HeroData,
    value: string
  ) {
    editor.setData({
      ...hero,
      [key]: value,
    })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    await editor.save(hero)
  }

  if (editor.loading) {
    return (
      <AdminShell
        title="Hero"
        description="Manage your hero section."
      >
        <p className="text-white/40">
          Loading hero…
        </p>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Hero"
      description="Manage your hero section."
    >
      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <Field
          label="Headline"
          value={hero.headline}
          onChange={v => update('headline', v)}
          placeholder="I build digital experiences."
        />

        <Field
          label="Subtitle"
          value={hero.subtitle}
          onChange={v => update('subtitle', v)}
          placeholder="Software Developer"
        />

        <Area
          label="Description"
          value={hero.description}
          onChange={v => update('description', v)}
          placeholder="Short introduction..."
          rows={7}
        />

        <Field
          label="Visual mode"
          value={hero.visualMode}
          onChange={v => update('visualMode', v)}
          placeholder="image"
        />

        <ImageUpload
          label="Hero image"
          value={hero.image}
          onChange={v => update('image', v)}
        />

        <Field
          label="Hero video"
          value={hero.video}
          onChange={v => update('video', v)}
          placeholder="/videos/hero.mp4"
        />

        <div className="border-t border-white/10 pt-8">
          <p className="mb-5 text-xs tracking-[0.25em] text-white/40">
            PRIMARY CTA
          </p>

          <div className="space-y-6">
            <Field
              label="Button text"
              value={hero.ctaText}
              onChange={v => update('ctaText', v)}
              placeholder="VIEW MY WORK"
            />

            <Field
              label="Button link"
              value={hero.ctaLink}
              onChange={v => update('ctaLink', v)}
              placeholder="/projects"
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="mb-5 text-xs tracking-[0.25em] text-white/40">
            SECONDARY CTA
          </p>

          <div className="space-y-6">
            <Field
              label="Button text"
              value={hero.secondaryCta}
              onChange={v => update('secondaryCta', v)}
              placeholder="CONTACT ME"
            />

            <Field
              label="Button link"
              value={hero.secondaryLink}
              onChange={v => update('secondaryLink', v)}
              placeholder="/contact"
            />
          </div>
        </div>

        <Notice
          error={editor.error}
          message={editor.message}
        />

        <SaveButton saving={editor.saving}>
          SAVE HERO
        </SaveButton>
      </form>
    </AdminShell>
  )
}
