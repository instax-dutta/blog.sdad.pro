import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 py-6 sm:py-8 md:px-6 lg:px-8 xl:px-12 flex items-center justify-center font-terminal">
      <div className="text-center max-w-2xl mx-auto">
        <pre className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-mono text-terminal-fg mb-6 sm:mb-8">
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
          $ error: file not found
        </p>
        <p className="text-terminal-fg-dim mb-6 sm:mb-8 text-xs sm:text-sm font-mono px-4">
          $ echo &quot;The blog post you&apos;re looking for doesn&apos;t exist or has been removed.&quot;
        </p>
        <Link
          href="/"
          className="inline-block terminal-border px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 hover:shadow-terminal-glow transition-all"
          aria-label="Go to homepage"
        >
          <span className="text-terminal-fg-bright font-mono text-xs sm:text-sm">
            $ cd ~ && ls
          </span>
        </Link>
      </div>
    </main>
  )
}
