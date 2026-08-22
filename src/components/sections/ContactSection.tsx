'use client'

import { useState } from 'react'

type ContactSectionProps = {
  email?: string
}

export default function ContactSection({ email }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      projectType: formData.get('projectType') as string,
      budget: formData.get('budget') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to send message')

      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" data-scroll-section="contact" className="py-32 md:py-48 border-t border-border-subtle relative">
      {/* Section continuity line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50" />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <p className="label text-text-muted mb-6" data-scroll-reveal>CONTACT</p>
          <h2 className="font-display text-display-md text-text-primary mb-8" data-scroll-reveal>
            HAVE AN IDEA?
          </h2>
          <h3 className="font-display text-display-sm text-text-secondary mb-16" data-scroll-reveal>
            LET'S BUILD SOMETHING<br />WORTH REMEMBERING.
          </h3>

          {status === 'success' && (
            <p className="body-md text-accent mb-8">Message sent successfully. I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="body-md text-red-400 mb-8">Failed to send message. Please try again.</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-scroll-reveal>
                <label className="label text-text-muted block mb-3">NAME</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                  placeholder="Your name"
                />
              </div>
              <div data-scroll-reveal>
                <label className="label text-text-muted block mb-3">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-scroll-reveal>
                <label className="label text-text-muted block mb-3">PROJECT TYPE</label>
                <select name="projectType" className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300">
                  <option value="">Select project type</option>
                  <option value="website">Website</option>
                  <option value="webapp">Web Application</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div data-scroll-reveal>
                <label className="label text-text-muted block mb-3">BUDGET</label>
                <select name="budget" className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300">
                  <option value="">Select budget range</option>
                  <option value="5k-10k">$5,000 — $10,000</option>
                  <option value="10k-25k">$10,000 — $25,000</option>
                  <option value="25k-50k">$25,000 — $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
            </div>
            <div data-scroll-reveal>
              <label className="label text-text-muted block mb-3">MESSAGE</label>
              <textarea
                name="message"
                rows={6}
                required
                className="w-full border-b border-border-default bg-transparent py-3 text-text-primary focus:border-accent transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <div className="pt-4" data-scroll-reveal>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-text-primary text-background text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SENDING...' : 'START A PROJECT'}
              </button>
            </div>
          </form>

          <div className="mt-24 pt-12 border-t border-border-subtle">
            <p className="body-sm text-text-muted">
              Or email directly at{' '}
              <a href={`mailto:${email || 'hello@example.com'}`} className="text-text-primary hover:text-accent transition-colors duration-300">
                {email || 'hello@example.com'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
