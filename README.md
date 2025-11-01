# SDAD Blog

A dark mode, sci-fi themed blog website built with Next.js, TypeScript, and Tailwind CSS. Designed for Vercel hosting with an API endpoint for posting blogs via n8n workflows.

## Features

- 🌙 Dark mode sci-fi theme
- 🚀 SEO optimized (meta tags, sitemap, robots.txt)
- 📝 Markdown blog posts
- 🔌 API endpoint for posting blogs from n8n
- ⚡ Fast and optimized for Vercel
- 📱 Fully responsive

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## API Endpoint

### POST `/api/posts`

Create a new blog post via API.

**Headers:**
- `Authorization: Bearer YOUR_API_KEY` OR
- `x-api-key: YOUR_API_KEY`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "My Blog Post",
  "content": "# Hello World\n\nThis is my blog post content in markdown.",
  "excerpt": "A brief description (optional)",
  "tags": ["tag1", "tag2"],
  "author": "SDAD",
  "date": "2024-01-01T00:00:00.000Z",
  "image": "https://example.com/image.jpg",
  "published": true
}
```

**Required fields:**
- `title` - Blog post title
- `content` - Blog post content in markdown format

**Optional fields:**
- `excerpt` - Brief description
- `tags` - Array of tags or single string
- `author` - Author name (defaults to "SDAD")
- `date` - ISO date string (defaults to current date)
- `image` - Featured image URL
- `published` - Boolean (defaults to true)

### Setting API Key

Create a `.env.local` file:

```env
BLOG_API_KEY=your-secret-api-key-here
```

Or set it as an environment variable in Vercel.

## n8n Workflow Integration

To post blogs from n8n:

1. Use the HTTP Request node
2. Method: POST
3. URL: `https://blog.sdad.pro/api/posts`
4. Headers:
   - `Authorization: Bearer YOUR_API_KEY`
   - `Content-Type: application/json`
5. Body: JSON with title, content, and optional fields

## Blog Posts Storage

Blog posts are stored in `data/posts/` as markdown files with frontmatter. Each post is automatically converted to a slug-based URL.

## Deploying to Vercel

1. Push your code to GitHub/GitLab
2. Import project in Vercel
3. Set environment variable `BLOG_API_KEY`
4. Deploy!

The blog will automatically be deployed and accessible.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── posts/
│   │       └── route.ts          # API endpoint
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx          # Individual post page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── robots.ts                  # robots.txt
│   └── sitemap.ts                 # sitemap.xml
├── data/
│   └── posts/                     # Blog posts (markdown files)
├── lib/
│   └── blog.ts                    # Blog utilities
└── ...
```

## License

MIT

