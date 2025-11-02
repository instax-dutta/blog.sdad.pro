import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 flex items-center justify-center font-terminal">
      <div className="text-center max-w-2xl mx-auto">
        <pre className="text-4xl md:text-6xl font-mono text-terminal-fg mb-8">
{`
██╗  ██╗ ██████╗ ██████╗ ██████╗ 
╚██╗██╔╝██╔═══██╗██╔══██╗██╔══██╗
 ╚███╔╝ ██║   ██║██║  ██║██████╔╝
 ██╔██╗ ██║   ██║██║  ██║██╔══██╗
██╔╝ ██╗╚██████╔╝██████╔╝██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ 
`}
        </pre>
        <p className="text-xl md:text-2xl mb-8 text-terminal-fg font-mono">
          $ error: file not found
        </p>
        <p className="text-terminal-fg-dim mb-8 text-sm font-mono">
          $ echo &quot;The blog post you&apos;re looking for doesn&apos;t exist or has been removed.&quot;
        </p>
        <Link
          href="/"
          className="inline-block terminal-border px-8 py-4 hover:shadow-terminal-glow transition-all"
        >
          <span className="text-terminal-fg-bright font-mono text-sm">
            $ cd ~ && ls
          </span>
        </Link>
      </div>
    </main>
  )
}
