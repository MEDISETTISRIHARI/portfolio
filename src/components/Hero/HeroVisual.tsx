'use client'

import { useEffect, useRef } from 'react'

type HeroVisualProps = {
  hero?: any
  mousePos: {
    x: number
    y: number
  }
  scrollProgress: number
}

export default function HeroVisual({
  hero,
  mousePos,
  scrollProgress,
}: HeroVisualProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null)

  const video =
    typeof hero?.video === 'string'
      ? hero.video.trim()
      : ''

  const image =
    typeof hero?.image === 'string'
      ? hero.image.trim()
      : ''

  const visualMode =
    typeof hero?.visualMode === 'string'
      ? hero.visualMode
          .toLowerCase()
          .trim()
      : 'video'

  const showVideo =
    Boolean(video) &&
    (
      visualMode === 'video' ||
      visualMode === 'auto' ||
      visualMode === ''
    )

  const showImage =
    Boolean(image) &&
    !showVideo

  useEffect(() => {
    const videoElement =
      videoRef.current

    if (!videoElement || !showVideo) {
      return
    }

    videoElement.muted = true
    videoElement.defaultMuted = true
    videoElement.playsInline = true

    const playVideo = async () => {
      try {
        await videoElement.play()
      } catch {
        // Browser may block autoplay until interaction.
      }
    }

    void playVideo()

    return () => {
      videoElement.pause()
    }
  }, [video, showVideo])

  const translateX =
    mousePos.x * 10

  const translateY =
    mousePos.y * 8 -
    scrollProgress * 20

  const scale =
    1.05 +
    scrollProgress * 0.025

  return (
    <div
      className="hero-canvas pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
          transition:
            'transform 0.15s ease-out',
        }}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            key={video}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : showImage ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/80" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}