import Link from 'next/link'
import { format } from 'date-fns'
import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { WebsiteJsonLd, BlogJsonLd } from '@/app/json-ld'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'ML Matters | AI & Machine Learning Blog',
  description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
  keywords: ['AI', 'machine learning', 'artificial intelligence', 'deep learning', 'technology', 'innovation', 'tech blog', 'ML', 'neural networks', 'data science', 'SDAD'],
  authors: [{ name: 'SDAD' }],
  creator: 'SDAD',
  publisher: 'SDAD',
  alternates: {
    canonical: 'https://blog.sdad.pro',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.sdad.pro',
    title: 'ML Matters | AI & Machine Learning Blog',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    siteName: 'ML Matters',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ML Matters | AI & Machine Learning Blog',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function Home() {
  const posts = await getBlogPosts()

  return (
    <>
      <WebsiteJsonLd />
      <BlogJsonLd />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-pink relative">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ML Matters
              </span>
            </h1>
          </Link>
          <p className="text-sci-fi-accent/90 text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Welcome to my blog - exploring AI, Machine Learning, and the latest technology innovations
          </p>
          <div className="mt-8 h-px w-40 mx-auto bg-gradient-to-r from-transparent via-pink-500 via-purple-500 via-cyan-500 to-transparent"></div>
        </header>

        {/* Blog Posts Grid */}
        <section className="mt-16">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 glass rounded-2xl">
                <p className="text-sci-fi-accent text-xl mb-4">No posts yet</p>
                <p className="text-sci-fi-accent/70">The first post is coming soon...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group glass rounded-2xl p-6 glass-hover transition-all duration-300 block relative overflow-hidden"
                >
                  <div className="mb-4">
                    <time className="text-sci-fi-accent/80 text-sm">
                      {format(new Date(post.date), 'MMMM dd, yyyy')}
                    </time>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 transition-all group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-white/70 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-sm group-hover:translate-x-2 transition-transform inline-block font-semibold">
                    Read more →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center py-8 border-t border-white/10">
          <p className="text-white/60">
            Powered by{' '}
            <a
              href="https://sdad.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-cyan-400 hover:via-yellow-400 hover:to-pink-400 transition-all"
            >
              SDAD
            </a>
          </p>
        </footer>
      </div>
    </main>
    </>
  )
}

