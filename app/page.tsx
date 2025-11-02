import Link from 'next/link'
import { format } from 'date-fns'
import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { WebsiteJsonLd, BlogJsonLd } from '@/app/json-ld'

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
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-cyan">
              ML Matters
            </h1>
          </Link>
          <p className="text-sci-fi-cyan text-lg md:text-xl max-w-2xl mx-auto">
            Welcome to my blog - exploring AI, Machine Learning, and the latest technology innovations
          </p>
          <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-sci-fi-accent to-transparent"></div>
        </header>

        {/* Blog Posts Grid */}
        <section className="mt-16">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 sci-fi-border rounded-lg">
                <p className="text-sci-fi-cyan text-xl mb-4">No posts yet</p>
                <p className="text-sci-fi-purple">The first post is coming soon...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group sci-fi-border rounded-lg p-6 hover:shadow-sci-fi-glow transition-all duration-300 block"
                >
                  <div className="mb-4">
                    <time className="text-sci-fi-purple text-sm">
                      {format(new Date(post.date), 'MMMM dd, yyyy')}
                    </time>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-sci-fi-accent transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sci-fi-cyan/70 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded border border-sci-fi-accent/30 text-sci-fi-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 text-sci-fi-accent text-sm group-hover:translate-x-2 transition-transform inline-block">
                    Read more →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center py-8 border-t border-sci-fi-accent/20">
          <p className="text-sci-fi-cyan/60">
            Powered by{' '}
            <a
              href="https://sdad.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sci-fi-accent hover:glow-cyan"
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

