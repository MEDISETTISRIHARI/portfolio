import Link from 'next/link'

type SocialLink = {
  id: string
  platform: string
  username: string
  url: string
  icon?: string | null
  visible: boolean
  order: number
}

type Profile = {
  id: string
  name: string
  role: string
  tagline?: string | null
  bio: string
  location?: string | null
  email: string
  availability?: string | null
  image?: string | null
}

type FooterProps = {
  socials: SocialLink[]
  profile?: Profile
}

export default function Footer({ socials, profile }: FooterProps) {
  return (
    <footer data-scroll-section="footer" className="py-16 border-t border-border-subtle relative">
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <p className="font-display text-display-sm text-text-primary mb-2" data-scroll-reveal>
              {profile?.name || 'SRIHARI'}
            </p>
            <p className="body-sm text-text-muted" data-scroll-reveal>
              {profile?.role || 'DIGITAL EXPERIENCES'}
            </p>
          </div>
          <div className="flex items-center gap-8">
            {socials.map((social) => {
              const isExternal = social.url.startsWith('http')
              return (
                <Link
                  key={social.id}
                  href={social.url}
                  className="body-sm text-text-muted hover:text-text-primary transition-colors duration-300"
                  data-scroll-reveal
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {social.platform}
                </Link>
              )
            })}
          </div>
          <p className="body-sm text-text-muted" data-scroll-reveal>© 2026</p>
        </div>
      </div>
    </footer>
  )
}
