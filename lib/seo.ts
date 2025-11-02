// SEO utility functions
import { BlogPost } from './blog'

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 225 // Average reading speed
  const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags if any
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readingTime) // At least 1 minute
}

/**
 * Calculate word count from content
 */
export function calculateWordCount(content: string): number {
  const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags if any
  return text.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Generate optimized meta description from content
 * Max 155-160 characters for optimal SEO
 */
export function generateMetaDescription(content: string, excerpt?: string): string {
  if (excerpt && excerpt.length <= 160) {
    return excerpt
  }
  
  const text = content
    .replace(/[#*`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    .substring(0, 157)
  
  // Cut at last complete sentence or word
  const lastPeriod = text.lastIndexOf('.')
  const lastSpace = text.lastIndexOf(' ')
  
  const cutIndex = lastPeriod > 120 ? lastPeriod + 1 : lastSpace > 120 ? lastSpace : 157
  
  return text.substring(0, cutIndex).trim() + (cutIndex < content.length ? '...' : '')
}

/**
 * Get related posts based on tags
 */
export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit: number = 3): BlogPost[] {
  if (!currentPost.tags || currentPost.tags.length === 0) {
    // Return most recent posts if no tags
    return allPosts
      .filter(p => p.slug !== currentPost.slug && p.published !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }
  
  // Calculate relevance score based on shared tags
  const postsWithScores = allPosts
    .filter(p => p.slug !== currentPost.slug && p.published !== false)
    .map(post => {
      if (!post.tags) return { post, score: 0 }
      
      const sharedTags = post.tags.filter(tag => 
        currentPost.tags?.includes(tag)
      ).length
      
      return { post, score: sharedTags }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      // Sort by score first, then by date
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })
    .slice(0, limit)
    .map(({ post }) => post)
  
  // Fill remaining slots with recent posts if needed
  if (postsWithScores.length < limit) {
    const recentPosts = allPosts
      .filter(p => 
        p.slug !== currentPost.slug && 
        p.published !== false &&
        !postsWithScores.find(rp => rp.slug === p.slug)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit - postsWithScores.length)
    
    postsWithScores.push(...recentPosts)
  }
  
  return postsWithScores
}

