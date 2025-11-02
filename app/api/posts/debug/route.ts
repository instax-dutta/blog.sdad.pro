import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog'
import { list } from '@vercel/blob'

const BLOB_STORAGE_KEY = 'blog-posts.json'
const BLOB_PREFIX = 'blog-posts' // Prefix for finding blog post blobs

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const posts = await getBlogPosts()
    const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN
    
    // Check what's actually in Blob storage
    let blobInfo: any = {
      exists: false,
      error: null,
      blobUrl: null,
      blobContent: null,
      blobPostsCount: 0,
    }
    
    if (blobConfigured) {
      try {
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        if (blobs.length > 0) {
          // Get the most recent blob
          const sortedBlobs = blobs.sort((a, b) => {
            const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
            const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
            return timeB - timeA
          })
          
          const latestBlob = sortedBlobs[0]
          blobInfo.exists = true
          blobInfo.blobUrl = latestBlob.url || latestBlob.downloadUrl
          blobInfo.blobName = latestBlob.pathname
          blobInfo.blobSize = latestBlob.size
          blobInfo.totalBlobs = blobs.length
          blobInfo.allBlobNames = blobs.map(b => b.pathname)
          
          // Try to fetch and parse the content
          try {
            const response = await fetch(blobInfo.blobUrl)
            if (response.ok) {
              const blobContent = await response.json()
              blobInfo.blobContent = Array.isArray(blobContent) 
                ? blobContent.map((p: any) => ({
                    slug: p.slug,
                    title: p.title,
                    published: p.published,
                    date: p.date,
                  }))
                : blobContent
              blobInfo.blobPostsCount = Array.isArray(blobContent) ? blobContent.length : 0
            } else {
              blobInfo.error = `Failed to fetch: ${response.status} ${response.statusText}`
            }
          } catch (fetchError) {
            blobInfo.error = fetchError instanceof Error ? fetchError.message : 'Failed to fetch blob content'
          }
        } else {
          blobInfo.error = `No blob found with prefix "${BLOB_PREFIX}"`
        }
      } catch (blobError) {
        blobInfo.error = blobError instanceof Error ? blobError.message : 'Error checking blob storage'
      }
    }
    
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
      blobStorage: blobInfo,
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

