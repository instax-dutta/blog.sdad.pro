import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
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
  let posts
  try {
    posts = await getBlogPosts()
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    posts = [] // Fallback to empty array on error
  }

  // Filter out any invalid posts
  const validPosts = posts.filter(post => 
    post && 
    post.slug && 
    post.title && 
    post.content &&
    post.published !== false
  )

  return (
    <>
      <WebsiteJsonLd />
      <BlogJsonLd />
      <main className="min-h-screen px-4 py-6 sm:py-8 md:px-6 lg:px-8 xl:px-12 font-terminal">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-terminal-fg font-mono">
              ML MATTERS
            </h1>
          </Link>
          <p className="text-terminal-fg-dim text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-4 font-mono px-4">
            $ echo &quot;Welcome to my blog - exploring AI, Machine Learning, and the latest technology innovations&quot;
          </p>
          <div className="mt-6 sm:mt-8 border-t border-terminal-border"></div>
        </header>

        {/* Blog Posts Grid */}
        <section className="mt-8 sm:mt-12 md:mt-16" aria-label="Blog posts">
          {validPosts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 terminal-border p-6 sm:p-8 mx-4 sm:mx-0">
              <p className="text-terminal-fg text-sm sm:text-base mb-4 font-mono">$ status: no posts found</p>
              <p className="text-terminal-fg-dim text-xs sm:text-sm font-mono">awaiting content...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {validPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group terminal-border p-4 sm:p-6 transition-all duration-200 block hover:shadow-terminal-glow"
                >
                  <div className="mb-4">
                    <time className="text-terminal-fg-dim text-xs font-mono">
                      $ date: {format(new Date(post.date), 'yyyy-MM-dd')}
                    </time>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-terminal-fg font-mono group-hover:text-terminal-fg-bright transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-terminal-fg-dim mb-3 sm:mb-4 line-clamp-3 text-xs sm:text-sm leading-relaxed font-mono">
                      {post.excerpt.replace(/^#+\s*/, '').substring(0, 150)}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 sm:py-1 text-xs border border-terminal-fg-dim text-terminal-fg-dim font-mono uppercase"
                        >
                          [{tag}]
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 sm:mt-4 text-terminal-fg-bright text-xs font-mono group-hover:text-terminal-fg transition-colors">
                    $ read_more →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 md:mt-24 text-center py-6 sm:py-8 border-t border-terminal-fg-dim px-4">
          <p className="text-terminal-fg-dim text-xs font-mono">
            $ powered_by{' '}
            <a
              href="https://sdad.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-fg-bright hover:text-terminal-fg transition-colors"
              aria-label="Visit SDAD portfolio website"
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
