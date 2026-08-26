type HeroContentProps = {
  hero?: any
}

function splitHeadline(headline: string): string[] {
  const value = headline.trim()

  if (!value) {
    return [
      'I DESIGN',
      'DIGITAL',
      'EXPERIENCES.',
    ]
  }

  const explicitLines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (explicitLines.length > 1) {
    return explicitLines
  }

  const words = value.split(/\s+/)

  if (words.length <= 3) {
    return [value]
  }

  const lines: string[] = []
  const targetLines = Math.min(3, words.length)

  const wordsPerLine = Math.ceil(
    words.length / targetLines
  )

  for (let index = 0; index < words.length; index += wordsPerLine) {
    lines.push(
      words
        .slice(index, index + wordsPerLine)
        .join(' ')
    )
  }

  return lines
}

export default function HeroContent({
  hero,
}: HeroContentProps) {
  const subtitle =
    typeof hero?.subtitle === 'string' &&
    hero.subtitle.trim()
      ? hero.subtitle.trim()
      : 'CREATIVE WEB DESIGNER & DEVELOPER'

  const headline =
    typeof hero?.headline === 'string'
      ? hero.headline
      : ''

  const lines = splitHeadline(headline)

  return (
    <>
      {/* Role - subtle, feels part of the cinematic scene */}
      <p className="text-[clamp(0.8rem,3vw,1rem)] text-text-muted/80 mb-6 tracking-wider hero-role">
        {subtitle}
      </p>

      {lines.map((line, index) => (
        <div
          key={`${line}-${index}`}
          className="hero-title-wrapper overflow-hidden"
        >
          <h1
            className="font-display text-[clamp(3.5rem,8vw,9rem)] text-text-primary hero-title-line leading-none tracking-tight"
            style={{ lineHeight: '0.95' }}
          >
            {line}
          </h1>
        </div>
      ))}
    </>
  )
}