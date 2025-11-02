import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost } from '@/lib/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// API Key for authentication (should be set as environment variable)
const API_KEY = process.env.BLOG_API_KEY || 'your-secret-api-key-here'

export async function POST(request: NextRequest) {
  try {
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
    
    if (!title || !content) {
      console.error('Missing required fields:', { hasTitle: !!title, hasContent: !!content })
      return NextResponse.json(
        { error: 'Missing required fields: title and content are required', received: { hasTitle: !!title, hasContent: !!content } },
        { status: 400 }
      )
    }

    // Create blog post
    console.log('Creating blog post with data:', { 
      title: title.substring(0, 50), 
      excerpt: excerpt?.substring(0, 50), 
      published,
      contentLength: content.length,
    })
    
    let post
    try {
      post = await createBlogPost({
      title,
      content,
      excerpt: excerpt || '',
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      author: author || 'SDAD',
      date: date || new Date().toISOString(),
      image: image || undefined,
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

