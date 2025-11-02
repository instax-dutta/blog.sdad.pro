import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { BlogPostJsonLd, BreadcrumbJsonLd } from '@/app/json-ld'
import { calculateReadingTime, calculateWordCount, generateMetaDescription, getRelatedPosts } from '@/lib/seo'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const postUrl = `https://blog.sdad.pro/posts/${params.slug}`
  const optimizedDescription = generateMetaDescription(post.content, post.excerpt)
  const defaultImage = `https://blog.sdad.pro/og-image.png` // Default OG image
  
  return {
    title: `${post.title} | ML Matters`,
    description: optimizedDescription,
    keywords: post.tags?.join(', ') || 'AI, Machine Learning, Technology',
    authors: [{ name: post.author || 'SDAD', url: 'https://sdad.pro' }],
    creator: post.author || 'SDAD',
    publisher: 'SDAD',
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: optimizedDescription,
      type: 'article',
      url: postUrl,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author || 'SDAD'],
      tags: post.tags,
      siteName: 'ML Matters',
      images: [
        {
          url: post.image || defaultImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: optimizedDescription,
      images: [post.image || defaultImage],
      creator: '@SDAD',
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
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getBlogPosts()
  const relatedPosts = getRelatedPosts(post, allPosts, 3)
  const readingTime = calculateReadingTime(post.content)
  const wordCount = calculateWordCount(post.content)
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.sdad.pro' },
    { name: 'Blog', url: 'https://blog.sdad.pro' },
    { name: post.title, url: `https://blog.sdad.pro/posts/${post.slug}` },
  ]

  return (
    <>
      <BlogPostJsonLd post={post} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
            <li>
              <Link href="/" className="hover:text-white/90 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li>
              <Link href="/" className="hover:text-white/90 transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li className="text-white/80" aria-current="page">
              {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-block mb-8 glass rounded-xl px-6 py-3 glass-hover transition-all"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
              ← Back to Blog
            </span>
          </Link>
        </header>

        {/* Article */}
        <article className="glass rounded-2xl p-8 md:p-12">
          {/* Post Header */}
          <header className="mb-8 pb-6 border-b border-white/10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-pink text-white">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <time dateTime={post.date} className="text-white/80">
                {format(new Date(post.date), 'MMMM dd, yyyy')}
              </time>
              <span className="text-sci-fi-accent/30">•</span>
              <span>{readingTime} min read</span>
              <span className="text-sci-fi-accent/30">•</span>
              <span>{wordCount.toLocaleString()} words</span>
              {post.author && (
                <>
                  <span className="text-sci-fi-accent/30">•</span>
                  <span>By <span itemProp="author">{post.author}</span></span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full border border-cyan-400/40 bg-cyan-500/10 backdrop-blur-sm text-cyan-200 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-4 mt-8 pb-2 border-b border-white/20 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mb-3 mt-6 pb-2 border-b border-white/15 bg-gradient-to-r from-purple-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-white/95 leading-relaxed">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-cyan-400 hover:via-yellow-400 hover:to-pink-400 underline underline-offset-2 transition-all"
                  >
                    {children}
                  </a>
                ),
                code: ({ children, className, ...props }: any) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="px-2 py-1 rounded-md bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm backdrop-blur-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block p-4 rounded-lg bg-sci-fi-darker/80 backdrop-blur-md border border-white/10 overflow-x-auto text-sm text-white/90" {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children, ...props }: any) => (
                  <pre className="p-4 rounded-lg bg-sci-fi-darker/80 backdrop-blur-md border border-white/10 overflow-x-auto mb-4 glass" {...props}>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-pink-500 pl-4 ml-4 my-4 italic text-white/90 bg-white/5 backdrop-blur-sm rounded-r-lg p-4">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-6 mb-4 text-white/90 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 mb-4 text-white/90 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src || ''}
                    alt={alt || ''}
                    className="rounded-xl border border-white/20 my-6 max-w-full h-auto shadow-lg"
                  />
                ),
                hr: () => (
                  <hr className="my-8 border-0 border-t border-white/10" />
                ),
                strong: ({ children }) => (
                  <strong className="font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">{children}</strong>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Footer Navigation */}
        <footer className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block glass rounded-xl px-6 py-3 glass-hover transition-all"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
              ← Back to All Posts
            </span>
          </Link>
        </footer>
      </div>
    </main>
    </>
  )
}

