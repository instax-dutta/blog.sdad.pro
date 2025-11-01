import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost } from '@/lib/blog'

// API Key for authentication (should be set as environment variable)
const API_KEY = process.env.BLOG_API_KEY || 'your-secret-api-key-here'

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const authHeader = request.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '') || request.headers.get('x-api-key')
    
    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key.' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Validate required fields
    const { title, content, excerpt, tags, author, date, image, published } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title and content are required' },
        { status: 400 }
      )
    }

    // Create blog post
    const post = createBlogPost({
      title,
      content,
      excerpt: excerpt || '',
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      author: author || 'SDAD',
      date: date || new Date().toISOString(),
      image: image || undefined,
      published: published !== false,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Blog post created successfully',
        post: {
          slug: post.slug,
          title: post.title,
          date: post.date,
        },
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

