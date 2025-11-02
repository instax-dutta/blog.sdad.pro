import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { put, head, list } from '@vercel/blob'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')
const BLOB_STORAGE_KEY = 'blog-posts.json'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt?: string
  content: string
  tags?: string[]
  author?: string
  image?: string
  published?: boolean
}

// Ensure posts directory exists
function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// Get all blog posts - reads from both file system and Blob storage
export async function getBlogPosts(): Promise<BlogPost[]> {
  ensurePostsDirectory()
  
  const posts: BlogPost[] = []

  // Read posts from file system (static posts)
  if (fs.existsSync(postsDirectory)) {
    try {
      const fileNames = fs.readdirSync(postsDirectory)
      const fileSystemPosts = fileNames
        .filter((name) => name.endsWith('.md'))
        .map((fileName) => {
          const slug = fileName.replace(/\.md$/, '')
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data, content } = matter(fileContents)

          return {
            slug,
            content,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            author: data.author || 'SDAD',
            image: data.image,
            published: data.published !== false,
          } as BlogPost
        })
        .filter((post) => post.published)
      
      posts.push(...fileSystemPosts)
    } catch (error) {
      console.error('Error reading blog posts from file system:', error)
    }
  }

  // Read posts from Blob storage (dynamic posts created via API)
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Check if the blob exists
      try {
        const { blobs } = await list({ prefix: BLOB_STORAGE_KEY })
        if (blobs.length > 0) {
          // Fetch the blob content
          const response = await fetch(blobs[0].url)
          const blobPosts: BlogPost[] = await response.json()
          if (Array.isArray(blobPosts)) {
            const publishedPosts = blobPosts.filter((post) => post.published !== false)
            posts.push(...publishedPosts)
          }
        }
      } catch (error) {
        // Blob doesn't exist yet, that's fine - just means no dynamic posts yet
        console.log('No blob storage found yet, will be created on first post')
      }
    }
  } catch (error) {
    console.error('Error reading blog posts from Blob storage:', error)
    // Continue without Blob posts - only file system posts will be shown
  }

  // Sort by date (newest first)
  posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })

  return posts
}

// Get blog post by slug - checks both file system and Blob storage
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  ensurePostsDirectory()
  
  // First try Blob storage (dynamic posts)
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list({ prefix: BLOB_STORAGE_KEY })
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url)
        const blobPosts: BlogPost[] = await response.json()
        if (Array.isArray(blobPosts)) {
          const post = blobPosts.find((p) => p.slug === slug && p.published !== false)
          if (post) {
            return post
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading post ${slug} from Blob storage:`, error)
  }

  // Then try file system (static posts)
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        author: data.author || 'SDAD',
        image: data.image,
        published: data.published !== false,
      } as BlogPost
    }
  } catch (error) {
    console.error('Error reading blog post from file system:', error)
  }

  return null
}

// Create blog post - stores in Blob storage (not file system for Vercel compatibility)
export async function createBlogPost(post: Omit<BlogPost, 'slug' | 'content'> & { content: string }): Promise<BlogPost> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Vercel Blob is not configured. Please create a Blob store in Vercel and connect it to your project.')
  }

  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const date = post.date || new Date().toISOString()

  const blogPost: BlogPost = {
    slug,
    title: post.title,
    date,
    excerpt: post.excerpt || '',
    content: post.content,
    tags: Array.isArray(post.tags) ? post.tags : post.tags ? [post.tags] : [],
    author: post.author || 'SDAD',
    image: post.image || undefined,
    published: post.published !== false,
  }

  // Get existing posts from Blob
  let existingPosts: BlogPost[] = []
  try {
    const { blobs } = await list({ prefix: BLOB_STORAGE_KEY })
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url)
      existingPosts = await response.json()
      if (!Array.isArray(existingPosts)) {
        existingPosts = []
      }
    }
  } catch (error) {
    console.log('No existing posts found, starting fresh')
    existingPosts = []
  }

  // Update posts array (replace if slug exists, otherwise append)
  const updatedPosts = [...existingPosts.filter((p) => p.slug !== slug), blogPost]

  // Store updated posts array in Blob
  try {
    const blob = await put(BLOB_STORAGE_KEY, JSON.stringify(updatedPosts), {
      access: 'public',
      contentType: 'application/json',
    })
    console.log('Blog post stored in Blob:', blob.url)
  } catch (error) {
    console.error('Error storing blog post in Blob:', error)
    throw new Error(`Failed to store blog post: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure Vercel Blob is configured.`)
  }

  return blogPost
}
