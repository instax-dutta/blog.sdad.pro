# Vercel Blob Storage Setup Guide

## Why Vercel Blob?

Vercel Blob is perfect for storing blog posts:
- ✅ **No size limits** - Can store many blog posts
- ✅ **Fast reads and writes** - Optimized for object storage
- ✅ **Works with Vercel serverless** - No read-only file system issues
- ✅ **Free tier available** - 100 GB storage
- ✅ **Simple API** - Easy to use

## Setup Steps

### Step 1: Create Blob Storage

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Blob** (orange icon - "Fast object storage")
5. Click **Continue** or **Create**
6. Vercel will automatically configure it for your project

### Step 2: Environment Variables (Automatic)

Vercel automatically sets these environment variables when you create Blob storage:
- `BLOB_READ_WRITE_TOKEN` - For read and write operations

These are automatically available in your Vercel deployments.

### Step 3: Deploy

1. Push your code changes (with `@vercel/blob` package)
2. Vercel will automatically deploy
3. The `BLOB_READ_WRITE_TOKEN` will be available automatically

## How It Works

### Reading Posts
- **Static posts** (from `data/posts/` folder) - Read from file system
- **Dynamic posts** (created via API) - Read from Blob storage
- Both are combined and displayed together

### Creating Posts
- Posts created via API are stored in Blob
- All posts are stored in a single JSON file: `blog-posts.json`
- When a new post is created, the entire array is updated

## Storage Structure

All blog posts are stored in a single blob:
- **Key**: `blog-posts.json`
- **Format**: JSON array of blog post objects
- **Access**: Public (readable via URL)

## Benefits

✅ **No 64KB limit** - Unlike Edge Config  
✅ **Fast writes** - No 10-second propagation delay  
✅ **Designed for data storage** - Unlike Edge Config which is for config  
✅ **Free tier**: 100 GB storage, 1M read ops/day, 10K write ops/day  

## Troubleshooting

### Blob Not Found
- Make sure Blob storage is created in Vercel
- Verify `BLOB_READ_WRITE_TOKEN` environment variable is set
- Check that it's connected to your project

### Write Errors
- Verify `BLOB_READ_WRITE_TOKEN` has write permissions
- Check Vercel logs for detailed error messages
- Make sure the token is available in your deployment environment

### Posts Not Showing
- Check Vercel logs for Blob read errors
- Verify posts are marked as `published: true`
- Make sure the blob exists (will be created on first post)

## Cost

Vercel Blob free tier:
- 100 GB storage
- 1M read operations/day
- 10K write operations/day

Perfect for a blog! Check Vercel pricing for details.

