'use client'

import {
  useEffect,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

type AdminUser = {
  id: string
  email: string
}

type Connection = {
  id: string
  name: string
  email: string
  projectType: string
  budget: string
  message: string
  status: string
  createdAt: string
}

export default function ConnectionsPage() {
  const router = useRouter()

  const [admin, setAdmin] =
    useState<AdminUser | null>(null)

  const [checking, setChecking] =
    useState(true)

  const [connections, setConnections] =
    useState<Connection[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  async function checkAuth() {
    try {
      const response = await fetch(
        '/api/auth/me',
        {
          cache: 'no-store',
        }
      )

      const data =
        await response.json()

      if (!data.authenticated) {
        router.replace(
          '/admin/login'
        )

        return
      }

      setAdmin(data.admin)
    } catch {
      router.replace(
        '/admin/login'
      )
    } finally {
      setChecking(false)
    }
  }

  async function loadConnections() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        '/api/admin/connections',
        {
          cache: 'no-store',
        }
      )

      if (response.status === 401) {
        router.replace(
          '/admin/login'
        )

        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to load connections.'
        )
      }

      setConnections(
        Array.isArray(data.data)
          ? data.data
          : []
      )
    } catch (err) {
      console.error(
        'CONNECTION LOAD ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load connections.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (!checking && admin) {
      loadConnections()
    }
  }, [checking, admin])

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

  async function updateStatus(
    connection: Connection,
    status: string
  ) {
    try {
      setError('')

      const response = await fetch(
        '/api/admin/connections',
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id: connection.id,
            status,
          }),
        }
      )

      if (response.status === 401) {
        router.replace(
          '/admin/login'
        )

        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to update connection.'
        )
      }

      setConnections(
        current =>
          current.map(item =>
            item.id === connection.id
              ? {
                  ...item,
                  status,
                }
              : item
          )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update connection.'
      )
    }
  }

  async function deleteConnection(
    id: string
  ) {
    const confirmed =
      window.confirm(
        'Delete this connection permanently?'
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      const response = await fetch(
        `/api/admin/connections?id=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      )

      if (response.status === 401) {
        router.replace(
          '/admin/login'
        )

        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to delete connection.'
        )
      }

      setConnections(
        current =>
          current.filter(
            item =>
              item.id !== id
          )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete connection.'
      )
    }
  }

  const newCount =
    connections.filter(
      item => item.status === 'new'
    ).length

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

        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <button
              type="button"
              onClick={() =>
                router.push('/admin')
              }
              className="mb-6 text-xs tracking-[0.2em] text-white/40 transition hover:text-white"
            >
              ← BACK TO ADMIN
            </button>

            <p className="text-xs tracking-[0.3em] text-white/40">
              CONNECTION
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Connections
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-white/50">
              Project enquiries submitted
              through your portfolio contact
              form.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={
                loadConnections
              }
              className="border border-white/15 px-5 py-3 text-sm transition hover:bg-white hover:text-black active:scale-[0.99]"
            >
              REFRESH
            </button>

            <button
              type="button"
              onClick={logout}
              className="border border-white/15 px-5 py-3 text-sm transition hover:bg-white hover:text-black active:scale-[0.99]"
            >
              LOG OUT
            </button>

          </div>

        </header>

        {/* SUMMARY */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs tracking-[0.25em] text-white/40">
              TOTAL CONNECTIONS
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {connections.length}
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs tracking-[0.25em] text-white/40">
              NEW
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {newCount}
            </p>
          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="mt-6 border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* CONNECTIONS */}

        <section className="mt-10">

          {loading ? (
            <div className="border border-white/10 bg-white/[0.02] p-10">
              <p className="text-sm tracking-[0.2em] text-white/40">
                LOADING CONNECTIONS…
              </p>
            </div>
          ) : connections.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-10">

              <p className="text-xs tracking-[0.25em] text-white/40">
                CONNECTION
              </p>

              <h2 className="mt-3 text-2xl">
                No project enquiries yet.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50">
                When someone uses the
                “START A PROJECT” form on
                your portfolio, their enquiry
                will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-5">

              {connections.map(
                connection => (

                  <article
                    key={connection.id}
                    className="border border-white/10 bg-white/[0.02] p-6 md:p-8 transition hover:border-white/20"
                  >

                    <div className="flex flex-col gap-8">

                      {/* TOP */}

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-2xl font-semibold">
                              {connection.name}
                            </h2>

                            <span
                              className={
                                connection.status ===
                                'new'
                                  ? 'border border-white/20 px-3 py-1 text-[10px] tracking-[0.2em] text-white'
                                  : 'border border-white/10 px-3 py-1 text-[10px] tracking-[0.2em] text-white/40'
                              }
                            >
                              {connection.status.toUpperCase()}
                            </span>

                          </div>

                          <a
                            href={`mailto:${connection.email}`}
                            className="mt-2 block text-sm text-white/50 transition hover:text-white"
                          >
                            {connection.email}
                          </a>

                        </div>

                        <p className="text-xs text-white/30">
                          {connection.createdAt}
                        </p>

                      </div>

                      {/* DETAILS */}

                      <div className="grid gap-6 border-y border-white/10 py-6 sm:grid-cols-2 lg:grid-cols-3">

                        <div>
                          <p className="text-xs tracking-[0.2em] text-white/30">
                            PROJECT TYPE
                          </p>

                          <p className="mt-2 text-sm text-white/80">
                            {connection.projectType ||
                              'Not specified'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs tracking-[0.2em] text-white/30">
                            BUDGET
                          </p>

                          <p className="mt-2 text-sm text-white/80">
                            {connection.budget ||
                              'Not specified'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs tracking-[0.2em] text-white/30">
                            CONTACT
                          </p>

                          <a
                            href={`mailto:${connection.email}`}
                            className="mt-2 block text-sm text-white/80 transition hover:text-white"
                          >
                            EMAIL CLIENT
                          </a>
                        </div>

                      </div>

                      {/* MESSAGE */}

                      <div>

                        <p className="text-xs tracking-[0.2em] text-white/30">
                          MESSAGE
                        </p>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/70">
                          {connection.message}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">

                        {connection.status !==
                          'new' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                connection,
                                'new'
                              )
                            }
                            className="border border-white/10 px-4 py-3 text-xs tracking-[0.15em] text-white/60 transition hover:bg-white hover:text-black"
                          >
                            MARK NEW
                          </button>
                        )}

                        {connection.status !==
                          'read' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                connection,
                                'read'
                              )
                            }
                            className="border border-white/15 px-4 py-3 text-xs tracking-[0.15em] transition hover:bg-white hover:text-black"
                          >
                            MARK READ
                          </button>
                        )}

                        {connection.status !==
                          'archived' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                connection,
                                'archived'
                              )
                            }
                            className="border border-white/10 px-4 py-3 text-xs tracking-[0.15em] text-white/60 transition hover:bg-white hover:text-black"
                          >
                            ARCHIVE
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteConnection(
                              connection.id
                            )
                          }
                          className="border border-red-400/20 px-4 py-3 text-xs tracking-[0.15em] text-red-300/80 transition hover:bg-red-400 hover:text-black"
                        >
                          DELETE
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

        </section>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/30">
            Admin panel • Customer
            connections remain private.
          </p>
        </footer>

      </div>
    </main>
  )
}