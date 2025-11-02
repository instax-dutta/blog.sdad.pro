# API Key Setup Guide

## Problem: 401 Unauthorized Error

If you're getting `401 - Unauthorized. Invalid or missing API key.` error, follow these steps:

## Solution

### Step 1: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Key**: `BLOG_API_KEY`
   - **Value**: `naina123` (or your chosen API key)
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
4. Click **Save**

### Step 2: Redeploy Your Site

After setting the environment variable, you need to redeploy:

1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete

### Step 3: Verify in n8n Workflow

Your n8n workflow is configured with:
- **Header**: `Authorization`
- **Value**: `Bearer naina123`

Make sure this matches your Vercel `BLOG_API_KEY` environment variable exactly.

## Alternative: Using x-api-key Header

You can also use the `x-api-key` header instead of `Authorization: Bearer`:

**In n8n workflow:**
- **Header**: `x-api-key`
- **Value**: `naina123`

## Testing the API

You can test the API using curl:

```bash
curl -X POST https://blog.sdad.pro/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer naina123" \
  -d '{
    "title": "Test Post",
    "content": "# Test\n\nThis is a test post."
  }'
```

## Troubleshooting

1. **Still getting 401?**
   - Check that `BLOG_API_KEY` is set in Vercel
   - Verify the value matches exactly (no extra spaces)
   - Make sure you redeployed after setting the variable
   - Check Vercel logs for debug messages

2. **Check Vercel Logs:**
   - Go to your Vercel project
   - Click on **Functions** tab
   - Check the logs for API requests
   - Look for the debug messages showing the API key comparison

3. **Verify Header Format:**
   - Make sure there's a space after "Bearer"
   - Format should be: `Bearer naina123` (not `Bearernaina123`)

## Security Note

For production, use a strong, randomly generated API key instead of a simple password like "naina123".

