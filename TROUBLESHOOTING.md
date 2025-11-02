# Troubleshooting: Blog Posts Not Appearing

## Issue: n8n workflow executes successfully but posts don't appear

### Step 1: Check Debug Endpoint

Visit: `https://blog.sdad.pro/api/posts/debug`

This will show:
- Total posts found
- What's in Blob storage
- Any errors reading Blob

**Look for:**
- `blobStorage.exists: true` - Blob file exists
- `blobStorage.blobPostsCount` - Number of posts in Blob
- `blobStorage.blobContent` - Array of posts in Blob

### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Find the `/api/posts` function
4. Check recent executions

**Look for these log messages:**

When **creating** a post:
- `"Creating blog post with data: ..."`
- `"Storing X posts in Blob storage..."`
- `"Blog post stored in Blob successfully"`

When **reading** posts:
- `"Attempting to read from Blob storage..."`
- `"Found X blob(s) with prefix 'blog-posts.json'"`
- `"Fetched X posts from Blob storage"`
- `"Filtered to X published posts"`

### Step 3: Check n8n Response

In your n8n workflow, check the "Post to Blog API" node output:

**Expected response:**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "post": {
    "slug": "...",
    "title": "...",
    "published": true
  },
  "blobTokenConfigured": true
}
```

**If you see errors:**
- `blobTokenConfigured: false` → Blob storage not set up
- Error about storing → Check Blob configuration
- 401 error → API key issue

### Step 4: Verify Blob Storage

1. Go to Vercel Dashboard → **Storage** tab
2. Click on your **Blob** store
3. Look for a file named `blog-posts.json`
4. Check its size and content

If the file exists but posts aren't showing:
- The file might be corrupted
- Posts might be marked as `published: false`
- There might be a reading error

### Step 5: Test API Manually

Test if the API works:

```bash
curl -X POST https://blog.sdad.pro/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer naina123" \
  -d '{
    "title": "Manual Test Post",
    "content": "# Test\n\nThis is a manual test.",
    "published": true
  }'
```

Then check:
- `/api/posts/debug` - Should show the new post
- Homepage - Should display the post

### Step 6: Common Issues

#### Issue: Posts created but not visible
**Cause:** Next.js caching
**Solution:** 
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Wait a few seconds (caching might be active)

#### Issue: `blobStorage.exists: false`
**Cause:** Posts aren't being stored
**Solution:**
- Check Vercel function logs for storage errors
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Make sure Blob store is created

#### Issue: `blobPostsCount: 0` but posts were created
**Cause:** Posts might be in wrong format or filtered out
**Solution:**
- Check `blobContent` in debug endpoint
- Verify posts have `published: true`
- Check for JSON parsing errors in logs

#### Issue: Multiple posts with same slug
**Cause:** Duplicate posts overwriting each other
**Solution:**
- The code handles this by filtering duplicates
- Check if titles are generating same slugs

### Step 7: Check Data Format

The debug endpoint shows `blobContent`. Each post should have:
```json
{
  "slug": "post-slug",
  "title": "Post Title",
  "content": "...",
  "published": true,
  "date": "2025-11-02T...",
  ...
}
```

If `published` is `false`, the post won't show.

### Step 8: Force Revalidation

After creating a post, try:
1. Visit `/api/posts/debug` - Forces re-read of Blob
2. Visit homepage - Should show new posts
3. Check browser Network tab - Verify fresh data

## Still Not Working?

Share the output from `/api/posts/debug` and I can help diagnose further!

