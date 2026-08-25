'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type AdminUser = {
  id: string
  email: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store',
        })

        const data = await res.json()

        if (!data.authenticated) {
          router.replace('/admin/login')
          return
        }

        setAdmin(data.admin)
      } catch {
        router.replace('/admin/login')
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router])

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    })

    router.replace('/admin/login')
    router.refresh()
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm tracking-[0.25em] text-white/50">
          LOADING ADMIN…
        </p>
      </main>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        <header className="flex items-center justify-between border-b border-white/10 pb-8">
          <div>
            <p className="text-xs tracking-[0.3em] text-white/40">
              SRIHARI PORTFOLIO
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-sm text-white/50">
              Manage your portfolio content from one place.
            </p>
          </div>

          <button
            onClick={logout}
            className="border border-white/15 px-5 py-3 text-sm hover:bg-white hover:text-black transition"
          >
            LOG OUT
          </button>
        </header>

        <section className="mt-10">
          <div className="border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs tracking-[0.25em] text-white/40">
              SIGNED IN AS
            </p>

            <p className="mt-3 text-lg">
              {admin.email}
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <a href="/admin/profile" className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]">
            <p className="text-xs tracking-[0.2em] text-white/40">
              PROFILE
            </p>
            <h2 className="mt-3 text-xl">
              Personal details
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Name, role, bio, location and profile image.
            </p>
          </a>

          <a href="/admin/hero" className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]">
            <p className="text-xs tracking-[0.2em] text-white/40">
              HERO
            </p>
            <h2 className="mt-3 text-xl">
              Hero section
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Headline, description, buttons and visual content.
            </p>
          </a>

          <a href="/admin/projects" className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]">
            <p className="text-xs tracking-[0.2em] text-white/40">
              PROJECTS
            </p>
            <h2 className="mt-3 text-xl">
              Portfolio projects
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Add, edit and publish projects.
            </p>
          </a>

          <a href="/admin/skills" className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]">
            <p className="text-xs tracking-[0.2em] text-white/40">
              SKILLS
            </p>
            <h2 className="mt-3 text-xl">
              Skills
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Manage skills and categories.
            </p>
          </a>

          <a href="/admin/services" className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]">
            <p className="text-xs tracking-[0.2em] text-white/40">
              SERVICES
            </p>
            <h2 className="mt-3 text-xl">
              Services
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Manage the services shown on the portfolio.
            </p>
          </a>

          <a href="/admin/socials" className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]">
            <p className="text-xs tracking-[0.2em] text-white/40">
              SOCIALS
            </p>
            <h2 className="mt-3 text-xl">
              Social links
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Manage your social profiles and links.
            </p>
          </a>

        </section>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/30">
            Admin panel • Public portfolio remains unchanged
          </p>
        </footer>

      </div>
    </main>
  )
}
