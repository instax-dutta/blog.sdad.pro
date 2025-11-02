import { BlogPost } from '@/lib/blog'
import { calculateWordCount, calculateReadingTime } from '@/lib/seo'

export function BlogPostJsonLd({ post }: { post: BlogPost }) {
  const postUrl = `https://blog.sdad.pro/posts/${post.slug}`
  const wordCount = calculateWordCount(post.content)
  const readingTime = calculateReadingTime(post.content)
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    description: post.excerpt || post.title,
    author: {
      '@type': 'Person',
      name: post.author || 'SDAD',
      url: 'https://sdad.pro',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SDAD',
      url: 'https://sdad.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.sdad.pro/favicon.svg',
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`,
    articleSection: post.tags?.[0] || 'Technology',
    ...(post.image && {
      image: {
        '@type': 'ImageObject',
        url: post.image,
      },
    }),
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.join(', '),
      articleSection: post.tags[0],
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
    name: 'ML Matters',
    alternateName: 'ML Matters Blog',
    url: 'https://blog.sdad.pro',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    publisher: {
      '@type': 'Organization',
      name: 'SDAD',
      url: 'https://sdad.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.sdad.pro/favicon.svg',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://blog.sdad.pro?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SDAD',
    url: 'https://sdad.pro',
    logo: {
      '@type': 'ImageObject',
      url: 'https://blog.sdad.pro/favicon.svg',
    },
    sameAs: [
      'https://github.com/instax-dutta',
      'https://www.linkedin.com/in/sdabhishekdash/',
    ],
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
    name: 'ML Matters',
    url: 'https://blog.sdad.pro',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    publisher: {
      '@type': 'Organization',
      name: 'SDAD',
      url: 'https://sdad.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.sdad.pro/favicon.svg',
      },
    },
    inLanguage: 'en-US',
    blogPost: {
      '@type': 'BlogPosting',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

