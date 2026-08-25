'use client'

import { useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function ImageUpload({
  value,
  onChange,
  label = 'IMAGE',
}: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function chooseFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please select an image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB.')
      return
    }

    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)

      const response = await fetch(
        '/api/admin/upload',
        {
          method: 'POST',
          body: form,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Upload failed'
        )
      }

      onChange(data.url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed'
      )
    } finally {
      setUploading(false)

      if (input.current) {
        input.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">

      <label className="block text-xs tracking-[0.2em] text-white/50">
        {label}
      </label>

      {value && (
        <div className="overflow-hidden border border-white/10 bg-white/5">
          <img
            src={value}
            alt="Selected image"
            className="max-h-72 w-full object-contain"
          />
        </div>
      )}

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={chooseFile}
        className="hidden"
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        className="border border-white/20 px-5 py-3 text-xs tracking-[0.15em] text-white transition hover:bg-white hover:text-black disabled:opacity-50"
      >
        {uploading
          ? 'UPLOADING...'
          : 'UPLOAD FROM GALLERY'}
      </button>

      <div className="text-xs text-white/30">
        JPG · PNG · WEBP · GIF · Maximum 10MB
      </div>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Or paste image URL..."
        className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  )
}
