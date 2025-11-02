import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { BlogPostJsonLd, BreadcrumbJsonLd } from '@/app/json-ld'
import { calculateReadingTime, calculateWordCount } from '@/lib/seo'

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
    title: `${post.title} | ML Matters`,
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
      siteName: 'ML Matters',
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

  const readingTime = calculateReadingTime(post.content)
  const wordCount = calculateWordCount(post.content)

  return (
    <>
      <BlogPostJsonLd post={post} />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 xl:px-24 font-terminal">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-block mb-8 terminal-border px-6 py-3 hover:shadow-terminal-glow transition-all"
          >
            <span className="text-terminal-fg-bright font-mono text-sm">
              $ cd .. && ls
            </span>
          </Link>
        </header>

        {/* Article */}
        <article className="terminal-border p-8 md:p-12">
          {/* Post Header */}
          <header className="mb-8 pb-6 border-b border-terminal-fg-dim">
            <div className="mb-4">
              <pre className="text-xs text-terminal-fg-dim font-mono">
{`$ cat ${post.slug}.md`}
              </pre>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-fg font-mono">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-terminal-fg-dim font-mono">
              <span>$ date: {format(new Date(post.date), 'yyyy-MM-dd')}</span>
              <span className="text-terminal-fg-dim">|</span>
              <span>$ reading_time: {readingTime}min</span>
              <span className="text-terminal-fg-dim">|</span>
              <span>$ word_count: {wordCount.toLocaleString()}</span>
              {post.author && (
                <>
                  <span className="text-terminal-fg-dim">|</span>
                  <span>$ author: {post.author}</span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-terminal-fg-dim text-xs font-mono">$ tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs border border-terminal-fg-dim text-terminal-fg-dim font-mono uppercase"
                  >
                    [{tag}]
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none font-mono">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 mt-8 pb-2 border-b border-terminal-fg-dim text-terminal-fg">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mb-3 mt-6 pb-2 border-b border-terminal-fg-dim text-terminal-fg">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold mb-2 mt-4 text-terminal-fg-bright">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-terminal-fg-dim leading-relaxed text-sm">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-fg-bright hover:text-terminal-fg underline underline-offset-2 transition-colors"
                  >
                    {children}
                  </a>
                ),
                code: ({ children, className, ...props }: any) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="px-2 py-1 bg-terminal-bg border border-terminal-fg-dim text-terminal-fg-bright text-xs font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block p-4 bg-terminal-bg border border-terminal-border overflow-x-auto text-xs text-terminal-fg font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children, ...props }: any) => (
                  <pre className="p-4 bg-terminal-bg border border-terminal-border overflow-x-auto mb-4 font-mono text-xs" {...props}>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-3 border-terminal-fg pl-4 ml-4 my-4 italic text-terminal-fg-dim bg-terminal-bg p-4">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-none ml-0 mb-4 text-terminal-fg-dim space-y-2 text-sm">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 mb-4 text-terminal-fg-dim space-y-2 text-sm">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed before:content-['▸_'] before:text-terminal-fg">{children}</li>
                ),
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src || ''}
                    alt={alt || ''}
                    className="border border-terminal-border my-6 max-w-full h-auto"
                  />
                ),
                hr: () => (
                  <hr className="my-8 border-0 border-t border-terminal-fg-dim" />
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-terminal-fg">{children}</strong>
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
            className="inline-block terminal-border px-6 py-3 hover:shadow-terminal-glow transition-all"
          >
            <span className="text-terminal-fg-bright font-mono text-sm">
              $ cd .. && ls
            </span>
          </Link>
        </footer>
      </div>
    </main>
    </>
  )
}
