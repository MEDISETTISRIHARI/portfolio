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
        <p className="text-[clamp(0.8rem,3vw,1rem)] text-text-muted/80 mb-6 tracking-widest hero-role" style={{ letterSpacing: '0.2em' }}>
          {role.toUpperCase()}
        </p>
      )}
      <div className="hero-title-wrapper">
        <h1
          className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-none tracking-tighter"
          style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
        >
          {headline}
        </h1>
      </div>
      {subtitleLines.map((line, i) => (
        <div key={i} className="hero-title-wrapper">
          <h1
            className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-none tracking-tighter"
            style={{ lineHeight: '0.9', letterSpacing: '-0.04em' }}
          >
            {line}
          </h1>
        </div>
      ))}
    </>
  )
}