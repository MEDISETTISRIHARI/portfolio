import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import AccessibilityEnhancements from '@/components/AccessibilityEnhancements'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SRIHARI — Digital Experiences',
  description: 'I design and build premium digital experiences where design, technology and motion work together.',
  keywords: ['web design', 'creative development', 'UX', 'UI', 'motion design', 'Three.js', 'React'],
  authors: [{ name: 'Alex Varma' }],
  openGraph: {
    title: 'SRIHARI — Digital Experiences',
    description: 'Premium cinematic digital experiences.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050505',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
          <AccessibilityEnhancements />
        </ErrorBoundary>
        <div className="vignette" />
        <div className="grain" />
      </body>
    </html>
  )
}
