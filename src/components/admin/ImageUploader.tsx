'use client'

import { ChangeEvent, useRef, useState } from 'react'

type Props = {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({
  value = '',
  onChange,
  label = 'IMAGE',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function upload(file: File) {
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB.')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
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
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (file) {
      upload(file)
    }

    event.target.value = ''
  }

  return (
    <div className="space-y-4">
      <label className="block text-xs tracking-[0.2em] text-white/50">
        {label}
      </label>

      {value && (
        <div className="relative overflow-hidden border border-white/10 bg-white/5">
          <img
            src={value}
            alt="Preview"
            className="block w-full max-h-72 object-contain"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border border-white/20 px-4 py-3 text-xs tracking-[0.15em] hover:bg-white hover:text-black transition"
        >
          {uploading
            ? 'UPLOADING...'
            : 'UPLOAD FROM DEVICE'}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="border border-red-400/30 px-4 py-3 text-xs tracking-[0.15em] text-red-300 hover:bg-red-400 hover:text-black transition"
          >
            REMOVE
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"
      />

      <p className="text-xs text-white/40">
        JPG, PNG, WEBP or GIF · Maximum 10MB
      </p>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
