# Debugging Blog Posts Not Appearing

## Quick Checks

### 1. Check Vercel Logs
Go to your Vercel project → **Functions** tab → Check logs for:
- API request logs
- Error messages
- Blob storage connection issues

### 2. Verify Blob Storage is Configured
1. Go to Vercel Dashboard → **Storage** tab
2. Verify you have a **Blob** store created
3. Check that `BLOB_READ_WRITE_TOKEN` is set (should be automatic)

### 3. Test the API Directly

```bash
curl -X POST https://blog.sdad.pro/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer naina123" \
  -d '{
    "title": "Test Post",
    "content": "# Test\n\nThis is a test.",
    "published": true
  }'
```

Check the response - it should include `blobTokenConfigured: true` if Blob is set up.

### 4. Check if Post was Created
The response should show:
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "post": {
    "slug": "test-post",
    "title": "Test Post",
    "published": true
  },
  "blobTokenConfigured": true
}
```

### 5. Verify Blob Content
Check Vercel Dashboard → **Storage** → **Blob**
- Look for a file named `blog-posts.json`
- Check if it contains your post data

### 6. Common Issues

#### Issue: `blobTokenConfigured: false`
**Solution:** 
- Create Blob storage in Vercel
- Redeploy your site
- The token will be automatically set

#### Issue: Post created but not visible
**Possible causes:**
1. Post is marked as `published: false`
2. Blob storage read is failing
3. Cache issue - try hard refresh (Ctrl+Shift+R)

#### Issue: Error in Vercel logs
Check for:
- `BLOB_READ_WRITE_TOKEN not set`
- `Failed to fetch blob`
- `Blob content is not an array`

### 7. Manual Check via API
Check what posts exist:
```bash
curl https://blog.sdad.pro/api/posts
```

This will show the API documentation.

### 8. Check Console Logs
After the post is created, check Vercel function logs for:
- `Attempting to read from Blob storage...`
- `Found X blob(s) with prefix "blog-posts.json"`
- `Fetched X posts from Blob storage`
- `Filtered to X published posts`

These logs will help identify where the issue is.

