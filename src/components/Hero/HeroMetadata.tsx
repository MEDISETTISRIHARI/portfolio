type HeroMetadataProps = {
  className?: string
}

export default function HeroMetadata({ className }: HeroMetadataProps) {
  return (
    <div className={`hero-metadata border-t border-border-subtle pt-8 ${className || ''}`}>
      <div className="container mx-auto px-6 flex items-center justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <span className="caption text-text-muted">SCROLL TO EXPLORE</span>
          <span className="w-px h-3.5 bg-border-default" />
        </div>
        <div className="flex items-center gap-8">
          <span className="caption text-text-muted">2026</span>
          <span className="caption text-text-muted">INDIA</span>
        </div>
      </div>
    </div>
  )
}