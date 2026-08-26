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
  role: string
  company: string
  quote: string
  image: string
  visible: number
  order: number
  createdAt: string
  updatedAt: string
}

export default function AdminReviewsPage() {
  const router = useRouter()

  const [admin, setAdmin] =
    useState<AdminUser | null>(null)

  const [checking, setChecking] =
    useState(true)

  const [reviews, setReviews] =
    useState<Review[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

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

  async function loadReviews() {
    try {
      setLoading(true)
      setError('')

      const res = await fetch(
        '/api/admin/content?resource=reviews',
        {
          cache: 'no-store',
        }
      )

      if (res.status === 401) {
        router.replace('/admin/login')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to fetch reviews'
        )
      }

      setReviews(
        Array.isArray(data.data)
          ? data.data
          : []
      )
    } catch (err) {
      console.error(
        'ADMIN REVIEWS LOAD ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch reviews'
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
      loadReviews()
    }
  }, [checking, admin])

  async function logout() {
    try {
      await fetch(
        '/api/auth/logout',
        {
          method: 'POST',
        }
      )
    } finally {
      router.replace('/admin/login')
      router.refresh()
    }
  }

  async function deleteReview(
    id: string
  ) {
    const confirmed =
      window.confirm(
        'Delete this review permanently?'
      )

    if (!confirmed) return

    try {
      setError('')

      const res = await fetch(
        `/api/admin/content?resource=reviews&id=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      )

      const data = await res.json()

      if (res.status === 401) {
        router.replace('/admin/login')
        return
      }

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Failed to delete review'
        )
      }

      setReviews((current) =>
        current.filter(
          (review) => review.id !== id
        )
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
    }
  }

  async function toggleVisibility(
    review: Review
  ) {
    try {
      setError('')

      const res = await fetch(
        '/api/admin/content?resource=reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id: review.id,
            name: review.name,
            role: review.role,
            company: review.company,
            quote: review.quote,
            image: review.image,
            order: review.order,
            visible:
              review.visible === 1
                ? false
                : true,
          }),
        }
      )

      const data = await res.json()

      if (res.status === 401) {
        router.replace('/admin/login')
        return
      }

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Failed to update review'
        )
      }

      setReviews((current) =>
        current.map((item) =>
          item.id === review.id
            ? {
                ...item,
                visible:
                  item.visible === 1
                    ? 0
                    : 1,
              }
            : item
        )
      )
    } catch (err) {
      console.error(
        'ADMIN REVIEW VISIBILITY ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update review'
      )
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
              SRIHARI PORTFOLIO
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Client Reviews
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-white/50">
              Manage reviews and feedback
              submitted by visitors and shown
              on your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadReviews}
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

        {/* ERROR */}

        {error && (
          <div className="mt-6 border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* CONTENT */}

        <section className="mt-8">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-xs tracking-[0.25em] text-white/40">
                REVIEWS
              </p>

              <h2 className="mt-2 text-2xl">
                Visitor feedback
              </h2>
            </div>

            <p className="text-sm text-white/40">
              {reviews.length}{' '}
              {reviews.length === 1
                ? 'review'
                : 'reviews'}
            </p>

          </div>

          {loading ? (
            <div className="border border-white/10 bg-white/[0.02] p-10">
              <p className="text-sm tracking-[0.2em] text-white/40">
                LOADING REVIEWS…
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-10">

              <p className="text-xs tracking-[0.25em] text-white/40">
                NO REVIEWS
              </p>

              <h2 className="mt-3 text-2xl">
                No client reviews yet.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50">
                Reviews submitted through the
                customer-facing portfolio will
                appear here.
              </p>

            </div>
          ) : (
            <div className="grid gap-4">

              {reviews.map((review) => (

                <article
                  key={review.id}
                  className="border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                        {review.image ? (
                          <img
                            src={review.image}
                            alt={review.name}
                            className="h-14 w-14 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                            <span className="text-sm text-white/40">
                              {review.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                '?'}
                            </span>
                          </div>
                        )}

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

                            <h3 className="text-lg font-medium">
                              {review.name}
                            </h3>

                            <span
                              className={
                                review.visible === 1
                                  ? 'text-xs tracking-[0.15em] text-white/60'
                                  : 'text-xs tracking-[0.15em] text-red-300/70'
                              }
                            >
                              {review.visible === 1
                                ? 'VISIBLE'
                                : 'HIDDEN'}
                            </span>

                          </div>

                          {(review.role ||
                            review.company) && (
                            <p className="mt-1 text-sm text-white/40">
                              {[
                                review.role,
                                review.company,
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                            </p>
                          )}

                        </div>

                      </div>

                      <blockquote className="mt-6 border-l border-white/20 pl-5 text-sm leading-7 text-white/70">
                        “{review.quote}”
                      </blockquote>

                      <p className="mt-5 text-xs text-white/25">
                        {review.createdAt
                          ? `Submitted ${review.createdAt}`
                          : ''}
                      </p>

                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 lg:w-48 lg:flex-col">

                      <button
                        type="button"
                        onClick={() =>
                          toggleVisibility(
                            review
                          )
                        }
                        className="border border-white/15 px-4 py-3 text-xs tracking-[0.15em] transition hover:bg-white hover:text-black active:scale-[0.99]"
                      >
                        {review.visible === 1
                          ? 'HIDE REVIEW'
                          : 'SHOW REVIEW'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteReview(
                            review.id
                          )
                        }
                        className="border border-red-400/20 px-4 py-3 text-xs tracking-[0.15em] text-red-300/80 transition hover:bg-red-400 hover:text-black active:scale-[0.99]"
                      >
                        DELETE REVIEW
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

        {/* FOOTER */}

        <footer className="mt-12 border-t border-white/10 pt-6">

          <p className="text-xs text-white/30">
            Admin panel • Public portfolio
            remains unchanged
          </p>

        </footer>

      </div>
    </main>
  )
}