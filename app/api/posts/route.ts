import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost } from '@/lib/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// API Key for authentication (should be set as environment variable)
const API_KEY = process.env.BLOG_API_KEY || 'your-secret-api-key-here'

// Rate limiting (simple in-memory cache, for production use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // Max 10 requests
const RATE_LIMIT_WINDOW = 60000 // Per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    // Check API key
    const authHeader = request.headers.get('authorization')
    const apiKey = authHeader?.replace(/^Bearer\s+/i, '').trim() || request.headers.get('x-api-key')?.trim()
    
    // Debug logging (remove in production if sensitive)
    console.log('API Key received:', apiKey ? '***' + apiKey.slice(-3) : 'none')
    console.log('Expected API Key:', API_KEY ? '***' + API_KEY.slice(-3) : 'not set')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Missing API key. Please provide Authorization: Bearer YOUR_API_KEY or x-api-key header.' },
        { status: 401 }
      )
    }
    
    if (apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid API key. Please check your API key in Vercel environment variables (BLOG_API_KEY).' },
        { status: 401 }
      )
    }

    // Parse request body
    let body: any
    try {
      body = await request.json()
      console.log('Received API request body:', {
        hasTitle: !!body.title,
        hasContent: !!body.content,
        titleLength: body.title?.length || 0,
        contentLength: body.content?.length || 0,
        published: body.published,
        excerpt: body.excerpt?.substring(0, 50),
      })
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // Validate required fields
    const { title, content, excerpt, tags, author, date, image, published } = body
    
    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid title: title must be a non-empty string' },
        { status: 400 }
      )
    }
    
    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid content: content must be a non-empty string' },
        { status: 400 }
      )
    }
    
    // Validate title length (prevent too long titles)
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title too long: maximum 200 characters allowed' },
        { status: 400 }
      )
    }
    
    // Validate content length (prevent too long content without limit, but warn if very large)
    if (content.length > 1000000) { // 1MB limit
      return NextResponse.json(
        { error: 'Content too large: maximum 1MB allowed' },
        { status: 400 }
      )
    }
    
    // Sanitize and validate tags
    let sanitizedTags: string[] = []
    if (tags) {
      if (Array.isArray(tags)) {
        sanitizedTags = tags
          .filter((tag): tag is string => typeof tag === 'string')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0 && tag.length <= 50)
          .slice(0, 10) // Limit to 10 tags
      } else if (typeof tags === 'string') {
        sanitizedTags = [tags.trim()].filter(tag => tag.length > 0 && tag.length <= 50)
      }
    }
    
    // Sanitize author
    const sanitizedAuthor = author && typeof author === 'string' 
      ? author.trim().substring(0, 100) 
      : 'SDAD'
    
    // Sanitize excerpt
    const sanitizedExcerpt = excerpt && typeof excerpt === 'string'
      ? excerpt.trim().substring(0, 500)
      : ''
    
    // Validate date format if provided
    let sanitizedDate = new Date().toISOString()
    if (date) {
      if (typeof date !== 'string') {
        return NextResponse.json(
          { error: 'Invalid date: date must be an ISO 8601 string' },
          { status: 400 }
        )
      }
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format: date must be a valid ISO 8601 date string' },
          { status: 400 }
        )
      }
      sanitizedDate = dateObj.toISOString()
    }
    
    // Validate image URL if provided
    if (image && typeof image === 'string') {
      try {
        new URL(image) // Validate URL format
      } catch {
        return NextResponse.json(
          { error: 'Invalid image URL: must be a valid URL' },
          { status: 400 }
        )
      }
    }

    // Create blog post with sanitized data
    console.log('Creating blog post with data:', { 
      title: title.substring(0, 50), 
      excerpt: sanitizedExcerpt.substring(0, 50), 
      published: published !== false,
      contentLength: content.length,
      tagsCount: sanitizedTags.length,
    })
    
    let post
    try {
      post = await createBlogPost({
        title: title.trim(),
        content: content.trim(),
        excerpt: sanitizedExcerpt,
        tags: sanitizedTags,
        author: sanitizedAuthor,
        date: sanitizedDate,
        image: (image && typeof image === 'string') ? image.trim() : undefined,
        published: published !== false,
      })
      console.log('Blog post created successfully:', {
        slug: post.slug,
        title: post.title,
        published: post.published,
      })
    } catch (createError) {
      console.error('Error in createBlogPost:', createError)
      throw createError
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Blog post created successfully',
        post: {
          slug: post.slug,
          title: post.title,
          date: post.date,
          published: post.published,
        },
        blobTokenConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Blog API Endpoint',
      usage: {
        method: 'POST',
        url: '/api/posts',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY',
          // OR
          'x-api-key': 'YOUR_API_KEY',
        },
        body: {
          title: 'string (required)',
          content: 'string (required)',
          excerpt: 'string (optional)',
          tags: 'array or string (optional)',
          author: 'string (optional, defaults to "SDAD")',
          date: 'ISO date string (optional, defaults to current date)',
          image: 'string URL (optional)',
          published: 'boolean (optional, defaults to true)',
        },
      },
      example: {
        title: 'My First Blog Post',
        content: '# Hello World\n\nThis is my first blog post!',
        excerpt: 'A brief description of the post',
        tags: ['blog', 'first-post'],
        author: 'SDAD',
        published: true,
      },
    },
    { status: 200 }
  )
}

