import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog'

export async function GET() {
  try {
    const posts = await getBlogPosts()
    const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN
    
    return NextResponse.json({
      status: 'ok',
      blobConfigured,
      totalPosts: posts.length,
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        published: p.published,
        excerpt: p.excerpt?.substring(0, 100),
      })),
      environment: {
        hasBlobToken: blobConfigured,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

