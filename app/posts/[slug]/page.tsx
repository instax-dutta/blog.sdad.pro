import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { BlogPostJsonLd } from '@/app/json-ld'

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
  
  return {
    title: `${post.title} | SDAD Blog`,
    description: post.excerpt || post.title,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author || 'SDAD' }],
    creator: post.author || 'SDAD',
    publisher: 'SDAD',
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      url: postUrl,
      publishedTime: post.date,
      authors: [post.author || 'SDAD'],
      tags: post.tags,
      siteName: 'SDAD Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
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

  return (
    <>
      <BlogPostJsonLd post={post} />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-block mb-8 text-sci-fi-accent hover:glow-cyan transition-all"
          >
            ← Back to Blog
          </Link>
        </header>

        {/* Article */}
        <article className="sci-fi-border rounded-lg p-8 md:p-12">
          {/* Post Header */}
          <header className="mb-8 pb-6 border-b border-sci-fi-accent/20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-cyan">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-sci-fi-cyan/70">
              <time className="text-sci-fi-purple">
                {format(new Date(post.date), 'MMMM dd, yyyy')}
              </time>
              {post.author && (
                <>
                  <span className="text-sci-fi-accent/30">•</span>
                  <span>By {post.author}</span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded border border-sci-fi-accent/30 text-sci-fi-accent"
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
                  <h1 className="text-3xl font-bold mb-4 mt-8 pb-2 border-b border-sci-fi-accent/30">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mb-3 mt-6 pb-2 border-b border-sci-fi-accent/20">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-sci-fi-cyan/80 leading-relaxed">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sci-fi-accent hover:glow-cyan underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                code: ({ children, className, ...props }: any) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="px-1.5 py-0.5 rounded bg-sci-fi-darker border border-sci-fi-accent/20 text-sci-fi-accent text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block p-4 rounded bg-sci-fi-darker border border-sci-fi-accent/20 overflow-x-auto text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children, ...props }: any) => (
                  <pre className="p-4 rounded bg-sci-fi-darker border border-sci-fi-accent/20 overflow-x-auto mb-4" {...props}>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-sci-fi-accent pl-4 ml-4 my-4 italic text-sci-fi-cyan/70">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-6 mb-4 text-sci-fi-cyan/80 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 mb-4 text-sci-fi-cyan/80 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={src || ''}
                    alt={alt || ''}
                    className="rounded-lg border border-sci-fi-accent/20 my-6 max-w-full h-auto"
                  />
                ),
                hr: () => (
                  <hr className="my-8 border-0 border-t border-sci-fi-accent/20" />
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-sci-fi-accent">{children}</strong>
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
            className="inline-block sci-fi-border rounded-lg px-6 py-3 text-sci-fi-accent hover:shadow-sci-fi-glow transition-all"
          >
            ← Back to All Posts
          </Link>
        </footer>
      </div>
    </main>
    </>
  )
}

