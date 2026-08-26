'use client'

import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'

export type ProfileData = {
  id?: string
  name: string
  role: string
  tagline: string
  bio: string
  location: string
  email: string
  availability: string
  image: string
}

export type HeroData = {
  id?: string
  headline: string
  subtitle: string
  description: string
  image: string
  video: string
  visualMode: string
  ctaText: string
  ctaLink: string
  secondaryCta: string
  secondaryLink: string
}

export type ProjectData = {
  id?: string
  title: string
  slug: string
  category: string
  year: string
  shortDesc: string
  fullDesc: string
  thumbnail: string
  heroImage: string
  gallery: string
  video: string
  technologies: string
  liveUrl: string
  caseStudy: string
  featured: boolean
  published: boolean
  order: number
}

export type SkillData = {
  id?: string
  category: string
  title: string
  items: string
  order: number
  visible: boolean
}

export type ServiceData = {
  id?: string
  title: string
  desc: string
  order: number
  visible: boolean
}

export type SocialData = {
  id?: string
  platform: string
  username: string
  url: string
  icon: string
  order: number
  visible: boolean
}

export const emptyProfile: ProfileData = {
  name: '',
  role: '',
  tagline: '',
  bio: '',
  location: '',
  email: '',
  availability: '',
  image: '',
}

export const emptyHero: HeroData = {
  headline: '',
  subtitle: '',
  description: '',
  image: '',
  video: '',
  visualMode: 'image',
  ctaText: '',
  ctaLink: '',
  secondaryCta: '',
  secondaryLink: '',
}

export const emptyProject: ProjectData = {
  title: '',
  slug: '',
  category: '',
  year: '',
  shortDesc: '',
  fullDesc: '',
  thumbnail: '',
  heroImage: '',
  gallery: '',
  video: '',
  technologies: '',
  liveUrl: '',
  caseStudy: '',
  featured: false,
  published: true,
  order: 0,
}

export const emptySkill: SkillData = {
  category: '',
  title: '',
  items: '',
  order: 0,
  visible: true,
}

export const emptyService: ServiceData = {
  title: '',
  desc: '',
  order: 0,
  visible: true,
}

export const emptySocial: SocialData = {
  platform: '',
  username: '',
  url: '',
  icon: '',
  order: 0,
  visible: true,
}

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-black text-white px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">

        <button
          type="button"
          onClick={() => {
            window.location.href = '/admin'
          }}
          className="mb-10 text-sm text-white/50 transition hover:text-white"
        >
          ← BACK TO ADMIN
        </button>

        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-white/40">
            ADMIN PANEL
          </p>

          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 text-base text-white/50 sm:text-lg">
            {description}
          </p>
        </div>

        {children}
      </div>
    </main>
  )
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.2em] text-white/40">
        {label.toUpperCase()}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-white/15 bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-white/50"
      />
    </label>
  )
}

export function ImageUpload({
  label,
  value,
  onChange,
  multiple = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiple?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function compressImage(file: File): Promise<File> {
    if (file.type === 'image/gif') {
      return file
    }

    const bitmap = await createImageBitmap(file)

    const maxSize = 1600

    let width = bitmap.width
    let height = bitmap.height

    if (width > maxSize || height > maxSize) {
      const scale = Math.min(
        maxSize / width,
        maxSize / height
      )

      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      bitmap.close()
      return file
    }

    ctx.drawImage(
      bitmap,
      0,
      0,
      width,
      height
    )

    bitmap.close()

    const blob = await new Promise<Blob | null>(
      resolve =>
        canvas.toBlob(
          resolve,
          'image/webp',
          0.82
        )
    )

    if (!blob) {
      return file
    }

    return new File(
      [blob],
      `${file.name.replace(/\.[^.]+$/, '')}.webp`,
      {
        type: 'image/webp',
        lastModified: Date.now(),
      }
    )
  }

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const uploaded: string[] = []

      for (const originalFile of Array.from(files)) {
        const file = await compressImage(originalFile)

        console.log(
          `Image compressed: ${Math.round(originalFile.size / 1024)}KB → ${Math.round(file.size / 1024)}KB`
        )

        const form = new FormData()
        form.append('file', file)

        const response = await fetch(
          '/api/admin/upload',
          {
            method: 'POST',
            body: form,
            credentials: 'include',
          }
        )

        const result = await response.json()

        if (
          !response.ok ||
          !result.ok ||
          !result.url
        ) {
          throw new Error(
            result.error ||
              'Image upload failed'
          )
        }

        uploaded.push(result.url)
      }

      if (multiple) {
        const existing = value
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)

        onChange(
          [...existing, ...uploaded].join(', ')
        )
      } else {
        onChange(uploaded[0] || '')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Image upload failed'
      )
    } finally {
      setUploading(false)
    }
  }

  function removeImage() {
    onChange('')
    setError('')
  }

  return (
    <div className="space-y-3">

      <span className="block text-xs tracking-[0.2em] text-white/40">
        {label.toUpperCase()}
      </span>

      <label
        className={`block border border-dashed border-white/20 bg-white/[0.03] p-6 text-center transition ${
          uploading
            ? 'cursor-wait opacity-60'
            : 'cursor-pointer hover:bg-white/[0.06]'
        }`}
      >
        <span className="block text-sm text-white/70">
          {uploading
            ? 'OPTIMIZING & UPLOADING…'
            : multiple
              ? 'CHOOSE IMAGE FILES'
              : 'CHOOSE IMAGE FILE'}
        </span>

        <span className="mt-2 block text-xs text-white/30">
          Images are automatically resized and compressed
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          disabled={uploading}
          onChange={event => {
            void upload(event.target.files)
            event.currentTarget.value = ''
          }}
          className="sr-only"
        />
      </label>

      {value && (
        <div className="space-y-3">

          <div className="break-all border border-white/10 bg-white/[0.02] p-3 text-xs text-white/40">
            {value}
          </div>

          {!multiple && (
            <img
              src={value}
              alt={label}
              className="max-h-72 w-full object-contain border border-white/10 bg-black"
            />
          )}

          {multiple && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {value
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
                .map((url, index) => (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`${label} ${index + 1}`}
                    className="aspect-video w-full object-cover border border-white/10"
                  />
                ))}
            </div>
          )}

          <button
            type="button"
            onClick={removeImage}
            disabled={uploading}
            className="w-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs tracking-[0.2em] text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            REMOVE IMAGE
          </button>

        </div>
      )}

      {error && (
        <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  )
}

export function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.2em] text-white/40">
        {label.toUpperCase()}
      </span>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full resize-y border border-white/15 bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-white/50"
      />
    </label>
  )
}

export function Check({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-5 w-5"
      />

      <span className="text-sm text-white/80">
        {label}
      </span>
    </label>
  )
}

export function SaveButton({
  saving,
  children = 'SAVE CHANGES',
}: {
  saving: boolean
  children?: ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="w-full border border-white/20 bg-white px-5 py-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? 'SAVING…' : children}
    </button>
  )
}

export function Notice({
  error,
  message,
}: {
  error: string
  message: string
}) {
  return (
    <>
      {error && (
        <div className="border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-300">
          {message}
        </div>
      )}
    </>
  )
}

export function useAdminData<T>(
  resource: string,
  initial: T
) {
  const router = useRouter()

  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `/api/admin/content?resource=${resource}`,
        {
          cache: 'no-store',
        }
      )

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      const result = await res.json()

      if (!res.ok) {
        throw new Error(
          result.error || 'Failed to load'
        )
      }

      setData(result.data ?? initial)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [resource])

  async function save(payload: unknown) {
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(
        `/api/admin/content?resource=${resource}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (res.status === 401) {
        router.push('/admin/login')
        return false
      }

      const result = await res.json()

      if (!res.ok) {
        throw new Error(
          result.error || 'Failed to save'
        )
      }

      setMessage('Saved successfully.')
      await load()

      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save'
      )

      return false
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setError('')
    setMessage('')

    try {
      const res = await fetch(
        `/api/admin/content?resource=${resource}&id=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      )

      if (res.status === 401) {
        router.push('/admin/login')
        return false
      }

      const result = await res.json()

      if (!res.ok) {
        throw new Error(
          result.error || 'Failed to delete'
        )
      }

      setMessage('Deleted successfully.')
      await load()

      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete'
      )

      return false
    }
  }

  return {
    data,
    setData,
    loading,
    saving,
    error,
    message,
    save,
    remove,
    reload: load,
  }
}