'use client'

import { Component, ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-6">
            <h1 className="font-display text-display-md text-text-primary mb-4">Something went wrong</h1>
            <p className="body-md text-text-secondary mb-8">We apologise for the inconvenience. Please refresh the page.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-8 py-4 bg-text-primary text-background text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300"
              style={{ borderRadius: '2px' }}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
