type HeroMetaProps = {
  description: string
}

export default function HeroMeta({ description }: HeroMetaProps) {
  return (
    <div className="overflow-hidden">
      <p className="body-lg text-text-secondary max-w-2xl mx-auto hero-reveal md:max-w-[560px] md:mx-0" style={{ animationDelay: '1.8s', lineHeight: '1.6', letterSpacing: '-0.005em' }}>
        {description}
      </p>
    </div>
  )
}
