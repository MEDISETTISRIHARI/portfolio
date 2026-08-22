type HeroContentProps = {
  headline: string
  subtitle: string
  role?: string
}

export default function HeroContent({ headline, subtitle, role }: HeroContentProps) {
  const subtitleLines = subtitle.split('\n')

  return (
    <>
      {role && (
        <p className="text-[clamp(0.75rem,2.5vw,0.875rem)] text-text-muted/70 mb-8 tracking-[0.25em] uppercase hero-role font-medium" style={{ letterSpacing: '0.25em' }}>
          {role}
        </p>
      )}
      <div className="hero-title-wrapper overflow-hidden">
        <h1
          className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-[0.9] tracking-[-0.04em]"
          style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
        >
          {headline}
        </h1>
      </div>
      {subtitleLines.map((line, i) => (
        <div key={i} className="hero-title-wrapper overflow-hidden">
          <h1
            className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-[0.9] tracking-[-0.04em]"
            style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
          >
            {line}
          </h1>
        </div>
      ))}
    </>
  )
}