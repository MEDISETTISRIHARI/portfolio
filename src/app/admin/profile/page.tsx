'use client'

import { FormEvent } from 'react'
import {
  AdminShell,
  Area,
  Field,
  ImageUpload,
  Notice,
  SaveButton,
  emptyProfile,
  useAdminData,
  ProfileData,
} from '@/components/admin/AdminUI'

export default function ProfileAdmin() {
  const editor = useAdminData<ProfileData>(
    'profile',
    emptyProfile
  )

  const profile = editor.data

  function update(
    key: keyof ProfileData,
    value: string
  ) {
    editor.setData({
      ...profile,
      [key]: value,
    })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    await editor.save(profile)
  }

  if (editor.loading) {
    return (
      <AdminShell
        title="Profile"
        description="Manage your personal details."
      >
        <p className="text-white/40">
          Loading profile…
        </p>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Profile"
      description="Manage your personal details."
    >
      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <Field
          label="Name"
          value={profile.name}
          onChange={v => update('name', v)}
          placeholder="Your name"
        />

        <Field
          label="Role"
          value={profile.role}
          onChange={v => update('role', v)}
          placeholder="Software Developer"
        />

        <Field
          label="Tagline"
          value={profile.tagline}
          onChange={v => update('tagline', v)}
          placeholder="Building modern digital experiences."
        />

        <Area
          label="Bio"
          value={profile.bio}
          onChange={v => update('bio', v)}
          placeholder="Tell visitors about yourself..."
          rows={10}
        />

        <Field
          label="Location"
          value={profile.location}
          onChange={v => update('location', v)}
          placeholder="Andhra Pradesh, India"
        />

        <Field
          label="Email"
          type="email"
          value={profile.email}
          onChange={v => update('email', v)}
          placeholder="you@example.com"
        />

        <Field
          label="Availability"
          value={profile.availability ?? ""}
          onChange={v => update('availability', v)}
          placeholder="Available for opportunities"
        />

        <ImageUpload
          label="Profile image"
          value={profile.image ?? ""}
          onChange={v => update('image', v)}
        />

        <Notice
          error={editor.error}
          message={editor.message}
        />

        <SaveButton saving={editor.saving}>
          SAVE PROFILE
        </SaveButton>
      </form>
    </AdminShell>
  )
}
