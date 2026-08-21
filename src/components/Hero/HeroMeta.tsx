type HeroMetaProps = {
  description: string
}

export default function HeroMeta({ description }: HeroMetaProps) {
  return (
    <div className="overflow-hidden">
      <p className="body-lg text-text-secondary max-w-2xl mx-auto hero-reveal" style={{ animationDelay: '1.8s' }}>
        {description}
      </p>
    </div>
  )
}
