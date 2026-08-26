'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type AdminUser = {
  id: string
  email: string
}

type Review = {
  id: string
  name: string
  role: string | null
  company: string | null
  quote: string
  image: string | null
  visible: boolean
  order: number
  createdAt: string
  updatedAt: string | null
}

export default function AdminReviewsPage() {
  const router = useRouter()

  const [admin, setAdmin] =
    useState<AdminUser | null>(null)

  const [reviews, setReviews] =
    useState<Review[]>([])

  const [loading, setLoading] =
    useState(true)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const authResponse = await fetch(
          '/api/auth/me',
          {
            cache: 'no-store',
          }
        )

        const authData =
          await authResponse.json()

        if (!authData.authenticated) {
          router.replace('/admin/login')
          return
        }

        setAdmin(authData.admin)

        await loadReviews()
      } catch (err) {
        console.error(
          'ADMIN REVIEWS AUTH ERROR:',
          err
        )

        router.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoad()
  }, [router])

  async function loadReviews() {
    setError('')

    try {
      const response = await fetch(
        '/api/admin/reviews',
        {
          cache: 'no-store',
          credentials: 'include',
        }
      )

      if (response.status === 401) {
        router.replace('/admin/login')
        return
      }

      const result =
        await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
            'Failed to load reviews'
        )
      }

      setReviews(result.data || [])
    } catch (err) {
      console.error(
        'ADMIN REVIEWS LOAD ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load reviews'
      )
    }
  }

  async function deleteReview(
    review: Review
  ) {
    const confirmed = window.confirm(
      `Delete the review from ${review.name}?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(review.id)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        '/api/admin/reviews',
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: review.id,
          }),
        }
      )

      if (response.status === 401) {
        router.replace('/admin/login')
        return
      }

      const result =
        await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
            'Failed to delete review'
        )
      }

      setReviews(current =>
        current.filter(
          item => item.id !== review.id
        )
      )

      setMessage(
        'Review deleted successfully.'
      )
    } catch (err) {
      console.error(
        'ADMIN REVIEW DELETE ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete review'
      )
    } finally {
      setDeletingId(null)
    }
  }

  async function logout() {
    await fetch(
      '/api/auth/logout',
      {
        method: 'POST',
      }
    )

    router.replace('/admin/login')
    router.refresh()
  }

  function formatDate(
    value: string
  ) {
    if (!value) {
      return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString(
      undefined,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm tracking-[0.25em] text-white/50">
          LOADING REVIEWS…
        </p>
      </main>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              type="button"
              onClick={() => {
                router.push('/admin')
              }}
              className="mb-6 text-sm text-white/40 transition hover:text-white"
            >
              ← BACK TO ADMIN
            </button>

            <p className="text-xs tracking-[0.3em] text-white/40">
              ADMIN PANEL
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Reviews
            </h1>

            <p className="mt-3 text-sm text-white/50">
              Manage reviews submitted by visitors.
            </p>

          </div>

          <button
            type="button"
            onClick={logout}
            className="border border-white/15 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
          >
            LOG OUT
          </button>

        </header>


        {/* ACCOUNT */}

        <section className="mt-8">

          <div className="border border-white/10 bg-white/[0.03] p-5">

            <p className="text-xs tracking-[0.25em] text-white/40">
              SIGNED IN AS
            </p>

            <p className="mt-2 text-sm text-white/80">
              {admin.email}
            </p>

          </div>

        </section>


        {/* STATUS */}

        <section className="mt-8 space-y-3">

          {error && (
            <div className="border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-300">
              {message}
            </div>
          )}

        </section>


        {/* REVIEW COUNT */}

        <section className="mt-10">

          <div className="flex items-end justify-between gap-4">

            <div>
              <p className="text-xs tracking-[0.25em] text-white/40">
                STORED REVIEWS
              </p>

              <h2 className="mt-2 text-2xl font-medium">
                {reviews.length}{' '}
                {reviews.length === 1
                  ? 'Review'
                  : 'Reviews'}
              </h2>
            </div>

            <button
              type="button"
              onClick={loadReviews}
              className="border border-white/15 px-4 py-2 text-xs tracking-[0.15em] text-white/60 transition hover:border-white/40 hover:text-white"
            >
              REFRESH
            </button>

          </div>

        </section>


        {/* REVIEWS */}

        <section className="mt-8 pb-20">

          {reviews.length === 0 ? (

            <div className="border border-white/10 bg-white/[0.03] p-10 text-center">

              <p className="text-sm text-white/40">
                No reviews have been submitted yet.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {reviews.map(review => (

                <article
                  key={review.id}
                  className="border border-white/10 bg-white/[0.03] p-6 md:p-8"
                >

                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                    <div className="min-w-0 flex-1">

                      {/* REVIEW */}

                      <p className="text-base leading-7 text-white/75 md:text-lg">
                        “{review.quote}”
                      </p>


                      {/* PERSON */}

                      <div className="mt-7">

                        <p className="text-sm font-medium text-white">
                          {review.name}
                        </p>

                        {(review.role ||
                          review.company) && (

                          <p className="mt-1 text-sm text-white/40">

                            {review.role}

                            {review.role &&
                            review.company
                              ? ' · '
                              : ''}

                            {review.company}

                          </p>

                        )}

                      </div>


                      {/* DATE */}

                      <p className="mt-4 text-xs tracking-[0.12em] text-white/25">
                        SUBMITTED{' '}
                        {formatDate(
                          review.createdAt
                        )}
                      </p>

                    </div>


                    {/* DELETE */}

                    <div className="shrink-0">

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          review.id
                        }
                        onClick={() =>
                          deleteReview(
                            review
                          )
                        }
                        className="border border-red-500/30 px-5 py-3 text-xs tracking-[0.15em] text-red-300 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {deletingId ===
                        review.id
                          ? 'DELETING…'
                          : 'DELETE REVIEW'}
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>


        {/* FOOTER */}

        <footer className="border-t border-white/10 py-6">

          <p className="text-xs text-white/30">
            Reviews are permanently removed from the database when deleted.
          </p>

        </footer>

      </div>
    </main>
  )
}
