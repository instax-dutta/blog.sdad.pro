import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')

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

export function getBlogPosts(): BlogPost[] {
  ensurePostsDirectory()
  
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
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
      .sort((a, b) => {
        if (a.date < b.date) {
          return 1
        } else {
          return -1
        }
      })

    return allPostsData
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  ensurePostsDirectory()
  
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

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
  } catch (error) {
    console.error('Error reading blog post:', error)
    return null
  }
}

export function createBlogPost(post: Omit<BlogPost, 'slug' | 'content'> & { content: string }): BlogPost {
  ensurePostsDirectory()
  
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const date = post.date || new Date().toISOString()

  const frontmatter = `---
title: ${JSON.stringify(post.title)}
date: ${date}
excerpt: ${JSON.stringify(post.excerpt || '')}
tags: ${JSON.stringify(post.tags || [])}
author: ${JSON.stringify(post.author || 'SDAD')}
${post.image ? `image: ${JSON.stringify(post.image)}` : ''}
published: ${post.published !== false}
---

${post.content}
`

  const fullPath = path.join(postsDirectory, `${slug}.md`)
  fs.writeFileSync(fullPath, frontmatter, 'utf8')

  return {
    slug,
    title: post.title,
    date,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags,
    author: post.author,
    image: post.image,
    published: post.published !== false,
  }
}

