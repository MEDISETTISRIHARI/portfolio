'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-white/40">ADMIN</p>
          <h1 className="mt-3 text-4xl font-semibold">Sign in</h1>
        </div>

        <input
          className="w-full border border-white/15 bg-white/5 px-4 py-3 outline-none"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="w-full border border-white/15 bg-white/5 px-4 py-3 outline-none"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="w-full border border-white/20 px-4 py-3 hover:bg-white hover:text-black transition"
        >
          {loading ? 'Signing in…' : 'SIGN IN'}
        </button>
      </form>
    </main>
  )
}
