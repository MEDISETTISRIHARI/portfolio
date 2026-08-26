'use client'

type HeroPortraitProps = {
  image?: string
  role?: string
}

export default function HeroPortrait({
  image,
  role,
}: HeroPortraitProps) {
  const label =
    typeof role === 'string' &&
    role.trim()
      ? role.trim()
      : 'CREATIVE WEB DESIGNER'

  return (
    <div className="hero-portrait relative z-30 w-full max-w-[420px] mx-auto">
      <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-neutral-900">
        <img
          src={
            image ||
            '/images/srihari-profile.jpg'
          }
          alt="Portrait"
          className="absolute inset-0 h-full w-full object-cover grayscale-[20%] contrast-110 brightness-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />

        <div className="absolute bottom-4 left-4 max-w-[80%] text-[10px] tracking-[0.25em] text-white/60">
          {label}
        </div>
      </div>
    </div>
  )
}