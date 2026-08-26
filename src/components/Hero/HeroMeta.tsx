type HeroMetaProps = {
  hero?: any
}

export default function HeroMeta({
  hero,
}: HeroMetaProps) {
  const description =
    typeof hero?.description === 'string' &&
    hero.description.trim()
      ? hero.description.trim()
      : 'I create high-quality websites, interfaces and interactive digital experiences where design, technology and motion work together.'

  return (
    <div className="overflow-hidden">
      <p
        className="body-lg text-text-secondary max-w-2xl mx-auto hero-reveal"
        style={{ animationDelay: '1.8s' }}
      >
        {description}
      </p>
    </div>
  )
}