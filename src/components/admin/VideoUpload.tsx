'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'

type VideoUploadProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function VideoUpload({
  value,
  onChange,
  label = 'VIDEO',
}: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setError('')

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file.')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be smaller than 100MB.')
      return
    }

    setUploading(true)

    try {
      const filename = `portfolio-hero-${Date.now()}-${file.name}`

      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        clientPayload: JSON.stringify({
          type: 'hero-video',
        }),
        multipart: true,
        onUploadProgress: (progress) => {
          console.log(
            `Video upload: ${progress.percentage}%`
          )
        },
      })

      if (!blob?.url) {
        throw new Error(
          'Upload succeeded but no video URL was returned.'
        )
      }

      onChange(blob.url)
    } catch (err) {
      console.error('VIDEO UPLOAD ERROR:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Video upload failed.'
      )
    } finally {
      setUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  function removeVideo() {
    onChange('')
    setError('')
  }

  return (
    <div className="space-y-4">

      <div>
        <p className="text-xs tracking-[0.2em] text-white/40">
          {label}
        </p>

        <p className="mt-2 text-xs text-white/25">
          Upload the cinematic background video
          used in the customer Hero section.
        </p>
      </div>

      {value && (
        <div className="overflow-hidden border border-white/10 bg-black">
          <video
            src={value}
            controls
            muted
            playsInline
            preload="metadata"
            className="max-h-[420px] w-full object-contain"
          />
        </div>
      )}

      <label
        className={`
          block
          border
          border-dashed
          border-white/20
          bg-white/[0.03]
          p-8
          text-center
          transition
          ${
            uploading
              ? 'cursor-wait opacity-60'
              : 'cursor-pointer hover:bg-white/[0.06]'
          }
        `}
      >
        <span className="block text-sm tracking-wide text-white/70">
          {uploading
            ? 'UPLOADING VIDEO…'
            : 'CHOOSE VIDEO FILE'}
        </span>

        <span className="mt-3 block text-xs text-white/30">
          MP4 · WebM · MOV · Maximum 100MB
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          disabled={uploading}
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {value && (
        <div className="space-y-3">
          <p className="text-xs tracking-[0.15em] text-white/30">
            VIDEO URL
          </p>

          <input
            type="text"
            value={value}
            onChange={event =>
              onChange(event.target.value)
            }
            className="
              w-full
              border
              border-white/10
              bg-white/[0.03]
              px-4
              py-3
              text-sm
              text-white/70
              outline-none
              transition
              focus:border-white/30
            "
            placeholder="/uploads/hero-video.mp4"
          />
        </div>
      )}

      {value && !uploading && (
        <button
          type="button"
          onClick={removeVideo}
          className="
            border
            border-red-500/20
            px-4
            py-2
            text-xs
            tracking-[0.15em]
            text-red-400
            transition
            hover:border-red-500/40
            hover:bg-red-500/10
          "
        >
          REMOVE VIDEO
        </button>
      )}

      {error && (
        <div className="border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

    </div>
  )
}