'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 flex items-center justify-center font-terminal">
      <div className="text-center max-w-2xl mx-auto">
        <pre className="text-2xl sm:text-3xl md:text-4xl font-mono text-terminal-fg mb-6 sm:mb-8">
{`
██╗  ██╗ ██████╗ ██████╗ ██████╗ 
╚██╗██╔╝██╔═══██╗██╔══██╗██╔══██╗
 ╚███╔╝ ██║   ██║██║  ██║██████╔╝
 ██╔██╗ ██║   ██║██║  ██║██╔══██╗
██╔╝ ██╗╚██████╔╝██████╔╝██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ 
`}
        </pre>
        <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 text-terminal-fg font-mono">
          $ error: application error
        </p>
        <p className="text-terminal-fg-dim mb-6 sm:mb-8 text-xs sm:text-sm font-mono px-4">
          $ echo &quot;Something went wrong. The error has been logged and we&apos;re working on it.&quot;
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="terminal-border px-6 py-3 hover:shadow-terminal-glow transition-all text-terminal-fg-bright font-mono text-xs sm:text-sm"
            aria-label="Try again"
          >
            $ retry
          </button>
          <Link
            href="/"
            className="terminal-border px-6 py-3 hover:shadow-terminal-glow transition-all text-terminal-fg-bright font-mono text-xs sm:text-sm"
            aria-label="Go to homepage"
          >
            $ cd ~ && ls
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 sm:mt-8 text-terminal-fg-dim text-xs font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}

