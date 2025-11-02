import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { put, head, list } from '@vercel/blob'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')
const BLOB_STORAGE_KEY = 'blog-posts.json'
const BLOB_PREFIX = 'blog-posts' // Prefix for finding blog post blobs (they get unique suffixes)

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
      console.log('Attempting to read from Blob storage...')
      // Check if the blob exists - search for prefix since Vercel creates unique filenames
      try {
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        console.log(`Found ${blobs.length} blob(s) with prefix "${BLOB_PREFIX}"`)
        
        if (blobs.length > 0) {
          // Get the most recent blob (latest uploadedAt time)
          const sortedBlobs = blobs.sort((a, b) => {
            const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
            const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
            return timeB - timeA // Most recent first
          })
          
          const latestBlob = sortedBlobs[0]
          const blobUrl = latestBlob.url || latestBlob.downloadUrl
          console.log(`Fetching latest blob from: ${blobUrl}`)
          console.log(`Blob name: ${latestBlob.pathname}, uploaded at: ${latestBlob.uploadedAt}`)
          
          const response = await fetch(blobUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`)
          }
          
          const blobPosts: BlogPost[] = await response.json()
          console.log(`Fetched ${blobPosts?.length || 0} posts from Blob storage`)
          
          if (Array.isArray(blobPosts)) {
            const publishedPosts = blobPosts.filter((post) => post.published !== false)
            console.log(`Filtered to ${publishedPosts.length} published posts`)
            posts.push(...publishedPosts)
          } else {
            console.warn('Blob content is not an array:', typeof blobPosts)
          }
        } else {
          console.log(`No blob found with prefix "${BLOB_PREFIX}"`)
        }
      } catch (error) {
        // Blob doesn't exist yet, that's fine - just means no dynamic posts yet
        console.log('No blob storage found yet (this is normal if no posts have been created via API):', error instanceof Error ? error.message : error)
      }
    } else {
      console.log('BLOB_READ_WRITE_TOKEN not set - Blob storage not available')
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
      const { blobs } = await list({ prefix: BLOB_PREFIX })
      if (blobs.length > 0) {
        // Get the most recent blob
        const sortedBlobs = blobs.sort((a, b) => {
          const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
          const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
          return timeB - timeA
        })
        
        const latestBlob = sortedBlobs[0]
        const blobUrl = latestBlob.url || latestBlob.downloadUrl
        const response = await fetch(blobUrl)
        if (response.ok) {
          const blobPosts: BlogPost[] = await response.json()
          if (Array.isArray(blobPosts)) {
            const post = blobPosts.find((p) => p.slug === slug && p.published !== false)
            if (post) {
              return post
            }
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

  // Get existing posts from Blob - find the latest blob with the prefix
  let existingPosts: BlogPost[] = []
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX })
    if (blobs.length > 0) {
      // Get the most recent blob (latest uploadedAt time)
      const sortedBlobs = blobs.sort((a, b) => {
        const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
        const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
        return timeB - timeA // Most recent first
      })
      
      const latestBlob = sortedBlobs[0]
      const blobUrl = latestBlob.url || latestBlob.downloadUrl
      console.log(`Reading existing posts from latest blob: ${latestBlob.pathname}`)
      
      const response = await fetch(blobUrl)
      if (response.ok) {
        existingPosts = await response.json()
        if (!Array.isArray(existingPosts)) {
          console.warn('Blob content is not an array, initializing empty array')
          existingPosts = []
        } else {
          console.log(`Found ${existingPosts.length} existing posts in Blob`)
        }
      }
    }
  } catch (error) {
    console.log('No existing posts found, starting fresh:', error instanceof Error ? error.message : error)
    existingPosts = []
  }

  // Update posts array (replace if slug exists, otherwise append)
  const updatedPosts = [...existingPosts.filter((p) => p.slug !== slug), blogPost]

  // Store updated posts array in Blob
  try {
    console.log(`Storing ${updatedPosts.length} posts in Blob storage...`)
    console.log('Posts to store:', updatedPosts.map(p => ({ slug: p.slug, title: p.title, published: p.published })))
    
    // Check Blob token before attempting to store
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN is not set. Please configure Blob storage in Vercel.')
    }
    
    const postsJson = JSON.stringify(updatedPosts)
    console.log(`JSON size: ${postsJson.length} bytes`)
    
    let blob
    try {
      blob = await put(BLOB_STORAGE_KEY, postsJson, {
        access: 'public',
        contentType: 'application/json',
      })
      
      if (!blob || !blob.url) {
        throw new Error('Blob put returned invalid result - missing URL')
      }
      
      console.log('Blog post stored in Blob successfully:', {
        url: blob.url,
        pathname: blob.pathname,
        totalPosts: updatedPosts.length,
      })
    } catch (putError) {
      console.error('put() call failed:', putError)
      throw new Error(`Failed to call blob.put(): ${putError instanceof Error ? putError.message : 'Unknown error'}`)
    }
    
    // Note: Verification is optional since Blob storage may have slight propagation delay
    // The blob was successfully created (we have the URL), so it will be available soon
    try {
      const { blobs } = await list({ prefix: BLOB_PREFIX })
      console.log(`Verification: Found ${blobs.length} total blob(s) with prefix "${BLOB_PREFIX}" (including newly created one)`)
    } catch (verifyError) {
      // Verification is non-critical - blob was stored, it just might take a moment to appear in list
      console.log('Could not verify blob in list (non-critical):', verifyError instanceof Error ? verifyError.message : verifyError)
    }
  } catch (error) {
    console.error('Error storing blog post in Blob:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Full error details:', {
      error: errorMessage,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      postsCount: updatedPosts.length,
    })
    throw new Error(`Failed to store blog post: ${errorMessage}. Make sure Vercel Blob is configured with BLOB_READ_WRITE_TOKEN.`)
  }

  return blogPost
}
