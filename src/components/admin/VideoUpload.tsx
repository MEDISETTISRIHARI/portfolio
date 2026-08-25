'use client'

import { useRef, useState } from 'react'

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

    /*
     * Make sure the selected file is actually a video.
     */
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file.')
      return
    }

    /*
     * Maximum video size: 100 MB.
     */
    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be smaller than 100MB.')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()

      formData.append('file', file)

      const response = await fetch(
        '/api/admin/upload',
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Video upload failed.'
        )
      }

      if (!data.url) {
        throw new Error(
          'Upload succeeded but no video URL was returned.'
        )
      }

      /*
       * Send the uploaded video URL back
       * to the Hero admin form.
       */
      onChange(data.url)

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Video upload failed.'
      )
    } finally {
      setUploading(false)

      /*
       * Reset the file input so the same file
       * can be selected again if necessary.
       */
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

      {/* LABEL */}

      <div>
        <p className="text-xs tracking-[0.2em] text-white/40">
          {label}
        </p>

        <p className="mt-2 text-xs text-white/25">
          Upload the cinematic background video
          used in the customer Hero section.
        </p>
      </div>


      {/* CURRENT VIDEO PREVIEW */}

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


      {/* UPLOAD BUTTON */}

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
          accept="video/*"
          disabled={uploading}
          onChange={handleFileChange}
          className="sr-only"
        />

      </label>


      {/* CURRENT URL */}

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


      {/* REMOVE BUTTON */}

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


      {/* ERROR */}

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