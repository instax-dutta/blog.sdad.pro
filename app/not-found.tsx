import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 flex items-center justify-center relative z-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 glow-pink">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <p className="text-2xl md:text-3xl mb-8 text-white/90">
          Post Not Found
        </p>
        <p className="text-white/70 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block glass rounded-xl px-8 py-4 glass-hover transition-all"
        >
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
            ← Back to Blog
          </span>
        </Link>
      </div>
    </main>
  )
}

