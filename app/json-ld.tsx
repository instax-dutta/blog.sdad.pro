import { BlogPost } from '@/lib/blog'

export function BlogPostJsonLd({ post }: { post: BlogPost }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    author: {
      '@type': 'Person',
      name: post.author || 'SDAD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SDAD',
      url: 'https://sdad.pro',
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.sdad.pro/posts/${post.slug}`,
    },
    url: `https://blog.sdad.pro/posts/${post.slug}`,
    ...(post.image && {
      image: post.image,
    }),
    ...(post.tags && {
      keywords: post.tags.join(', '),
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SDAD Blog',
    url: 'https://blog.sdad.pro',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    publisher: {
      '@type': 'Organization',
      name: 'SDAD',
      url: 'https://sdad.pro',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BlogJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SDAD Blog',
    url: 'https://blog.sdad.pro',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    publisher: {
      '@type': 'Organization',
      name: 'SDAD',
      url: 'https://sdad.pro',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

