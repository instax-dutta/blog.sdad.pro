import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.sdad.pro'
  
  let posts
  try {
    posts = await getBlogPosts()
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    posts = []
  }

  // Filter only published posts
  const publishedPosts = posts.filter(post => post.published !== false && post.slug && post.title)

  const postUrls = publishedPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...postUrls,
  ]
}

