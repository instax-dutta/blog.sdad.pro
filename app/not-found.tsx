import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 glow-cyan">
          404
        </h1>
        <p className="text-2xl md:text-3xl mb-8 text-sci-fi-cyan">
          Post Not Found
        </p>
        <p className="text-sci-fi-cyan/70 mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block sci-fi-border rounded-lg px-8 py-4 text-sci-fi-accent hover:shadow-sci-fi-glow transition-all"
        >
          ← Back to Blog
        </Link>
      </div>
    </main>
  )
}

