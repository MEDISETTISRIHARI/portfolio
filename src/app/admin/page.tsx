'use client'

import {
  FormEvent,
  useEffect,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

type AdminUser = {
  id: string
  email: string
}

export default function AdminDashboard() {
  const router = useRouter()

  const [admin, setAdmin] =
    useState<AdminUser | null>(null)

  const [checking, setChecking] =
    useState(true)

  const [editingAccount, setEditingAccount] =
    useState(false)

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [savingAccount, setSavingAccount] =
    useState(false)

  const [accountError, setAccountError] =
    useState('')

  const [accountMessage, setAccountMessage] =
    useState('')

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          '/api/auth/me',
          {
            cache: 'no-store',
          }
        )

        const data = await res.json()

        if (!data.authenticated) {
          router.replace(
            '/admin/login'
          )

          return
        }

        setAdmin(data.admin)
        setEmail(data.admin.email)
      } catch {
        router.replace(
          '/admin/login'
        )
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router])

  async function logout() {
    await fetch(
      '/api/auth/logout',
      {
        method: 'POST',
      }
    )

    router.replace(
      '/admin/login'
    )

    router.refresh()
  }

  function openAccountEditor() {
    if (!admin) return

    setEmail(admin.email)
    setPassword('')
    setConfirmPassword('')
    setAccountError('')
    setAccountMessage('')
    setEditingAccount(true)
  }

  function closeAccountEditor() {
    if (savingAccount) return

    setEditingAccount(false)
    setPassword('')
    setConfirmPassword('')
    setAccountError('')
    setAccountMessage('')
  }

  async function saveAccount(
    e: FormEvent
  ) {
    e.preventDefault()

    setAccountError('')
    setAccountMessage('')

    const cleanEmail =
      email.trim()

    if (!cleanEmail) {
      setAccountError(
        'Email is required.'
      )

      return
    }

    if (!cleanEmail.includes('@')) {
      setAccountError(
        'Please enter a valid email address.'
      )

      return
    }

    if (
      password &&
      password.length < 6
    ) {
      setAccountError(
        'Password must be at least 6 characters.'
      )

      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setAccountError(
        'Passwords do not match.'
      )

      return
    }

    if (
      !password &&
      cleanEmail === admin?.email
    ) {
      setAccountError(
        'Enter a new email or a new password.'
      )

      return
    }

    setSavingAccount(true)

    try {
      const res = await fetch(
        '/api/admin/account',
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email: cleanEmail,
            password:
              password || undefined,
          }),
        }
      )

      const data =
        await res
          .json()
          .catch(() => ({}))

      if (res.status === 401) {
        router.replace(
          '/admin/login'
        )

        return
      }

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Failed to update account.'
        )
      }

      setAdmin(data.admin)
      setEmail(data.admin.email)
      setPassword('')
      setConfirmPassword('')

      setAccountMessage(
        'Account updated successfully.'
      )

      setTimeout(() => {
        setEditingAccount(false)
        setAccountMessage('')
      }, 1200)
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : 'Failed to update account.'
      )
    } finally {
      setSavingAccount(false)
    }
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

        {/* HEADER */}

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
            type="button"
            onClick={logout}
            className="border border-white/15 px-5 py-3 text-sm hover:bg-white hover:text-black transition"
          >
            LOG OUT
          </button>

        </header>

        {/* SIGNED IN ACCOUNT */}

        <section className="mt-10">

          <div className="border border-white/10 bg-white/[0.03] p-6">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs tracking-[0.25em] text-white/40">
                  SIGNED IN AS
                </p>

                <p className="mt-3 text-lg">
                  {admin.email}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  openAccountEditor
                }
                className="border border-white/15 px-5 py-3 text-sm hover:bg-white hover:text-black transition"
              >
                EDIT ACCOUNT
              </button>

            </div>

          </div>

        </section>

        {/* ACCOUNT EDITOR */}

        {editingAccount && (
          <section className="mt-6">

            <form
              onSubmit={saveAccount}
              className="border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >

              <div className="flex items-start justify-between gap-6">

                <div>

                  <p className="text-xs tracking-[0.25em] text-white/40">
                    ADMIN ACCOUNT
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold">
                    Edit email & password
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={
                    closeAccountEditor
                  }
                  disabled={
                    savingAccount
                  }
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  CLOSE
                </button>

              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">

                  <label className="mb-2 block text-xs tracking-[0.2em] text-white/40">
                    EMAIL
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={e =>
                      setEmail(
                        e.target.value
                      )
                    }
                    disabled={
                      savingAccount
                    }
                    className="w-full border border-white/15 bg-white/5 px-4 py-3 outline-none focus:border-white/40"
                    placeholder="admin@example.com"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs tracking-[0.2em] text-white/40">
                    NEW PASSWORD
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={e =>
                      setPassword(
                        e.target.value
                      )
                    }
                    disabled={
                      savingAccount
                    }
                    className="w-full border border-white/15 bg-white/5 px-4 py-3 outline-none focus:border-white/40"
                    placeholder="Leave blank to keep current password"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs tracking-[0.2em] text-white/40">
                    CONFIRM PASSWORD
                  </label>

                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={e =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    disabled={
                      savingAccount
                    }
                    className="w-full border border-white/15 bg-white/5 px-4 py-3 outline-none focus:border-white/40"
                    placeholder="Repeat new password"
                  />

                </div>

              </div>

              {accountError && (
                <p className="mt-6 text-sm text-red-400">
                  {accountError}
                </p>
              )}

              {accountMessage && (
                <p className="mt-6 text-sm text-green-400">
                  {accountMessage}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={
                    savingAccount
                  }
                  className="border border-white/20 px-6 py-3 text-sm hover:bg-white hover:text-black transition disabled:opacity-50"
                >
                  {savingAccount
                    ? 'SAVING…'
                    : 'SAVE CHANGES'}
                </button>

                <button
                  type="button"
                  onClick={
                    closeAccountEditor
                  }
                  disabled={
                    savingAccount
                  }
                  className="border border-white/10 px-6 py-3 text-sm text-white/60 hover:text-white transition"
                >
                  CANCEL
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ADMIN SECTIONS */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* PROFILE */}

          <a
            href="/admin/profile"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
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

          {/* HERO */}

          <a
            href="/admin/hero"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
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

          {/* PROJECTS */}

          <a
            href="/admin/projects"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
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

          {/* SKILLS */}

          <a
            href="/admin/skills"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
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

          {/* SERVICES */}

          <a
            href="/admin/services"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
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

          {/* SOCIALS */}

          <a
            href="/admin/socials"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
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

          {/* REVIEWS */}

          <a
            href="/admin/reviews"
            className="block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >
            <p className="text-xs tracking-[0.2em] text-white/40">
              REVIEWS
            </p>

            <h2 className="mt-3 text-xl">
              Client reviews
            </h2>

            <p className="mt-2 text-sm text-white/50">
              View and manage reviews submitted by visitors.
            </p>
          </a>

          {/* CONNECTION */}

          <a
            href="/admin/connections"
            className="group block border border-white/10 p-6 transition hover:bg-white hover:text-black active:scale-[0.99]"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs tracking-[0.2em] text-white/40">
                  CONNECTION
                </p>

                <h2 className="mt-3 text-xl">
                  Project enquiries
                </h2>

              </div>

              <span className="text-xs tracking-[0.15em] text-white/20 transition group-hover:text-black/50">
                INBOX
              </span>

            </div>

            <p className="mt-2 text-sm text-white/50">
              View messages, project types, budgets and client contact details.
            </p>

          </a>

        </section>

        {/* FOOTER */}

        <footer className="mt-12 border-t border-white/10 pt-6">

          <p className="text-xs text-white/30">
            Admin panel • Public portfolio remains unchanged
          </p>

        </footer>

      </div>
    </main>
  )
}