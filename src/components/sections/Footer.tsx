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
    <footer className="py-16 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <p className="font-display text-display-sm text-text-primary mb-2">
              {profile?.name || 'SRIHARI'}
            </p>
            <p className="body-sm text-text-muted">
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
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {social.platform}
                </Link>
              )
            })}
          </div>
          <p className="body-sm text-text-muted">© 2026</p>
        </div>
      </div>
    </footer>
  )
}
