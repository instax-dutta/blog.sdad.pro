# n8n Quick Start Guide - Blog API Integration

Quick reference for setting up n8n workflow to post blogs to `blog.sdad.pro`.

## Quick Setup

### 1. API Endpoint Details

- **URL**: `https://blog.sdad.pro/api/posts`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authentication**: API Key via header

### 2. Required Headers

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

OR

```
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

### 3. Required Body Fields

```json
{
  "title": "Your Blog Post Title",
  "content": "# Your Markdown Content\n\nYour blog post content here..."
}
```

### 4. Optional Body Fields

```json
{
  "title": "Your Blog Post Title",
  "content": "# Your Markdown Content",
  "excerpt": "Brief description",
  "tags": ["tag1", "tag2"],
  "author": "SDAD",
  "published": true
}
```

---

## n8n HTTP Request Node Configuration

### Step-by-Step Setup

1. **Add HTTP Request Node**
   - Drag and drop HTTP Request node into your workflow

2. **Configure Node Settings**
   - **Method**: `POST`
   - **URL**: `https://blog.sdad.pro/api/posts`
   - **Authentication**: `Generic Credential Type` or `Header Auth`

3. **Set Headers**
   - Click "Add Header"
   - **Name**: `Authorization`
   - **Value**: `Bearer YOUR_API_KEY`
   - **OR**
   - **Name**: `x-api-key`
   - **Value**: `YOUR_API_KEY`
   - Add another header:
     - **Name**: `Content-Type`
     - **Value**: `application/json`

4. **Set Body**
   - **Body Content Type**: `JSON`
   - **JSON Body**: Use expression or static JSON

---

## n8n Expression Examples

### Using Data from Previous Node

```javascript
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "excerpt": "{{ $json.excerpt || '' }}",
  "tags": {{ JSON.stringify($json.tags || []) }},
  "author": "{{ $json.author || 'SDAD' }}",
  "published": {{ $json.published !== false }}
}
```

### Static Example

```json
{
  "title": "My Blog Post",
  "content": "# Hello World\n\nThis is my blog post content.",
  "excerpt": "A brief description",
  "tags": ["blog", "post"],
  "author": "SDAD",
  "published": true
}
```

### Dynamic from RSS Feed

```javascript
{
  "title": "{{ $json.title }}",
  "content": "{{ $json['content:encoded'] || $json.description }}",
  "excerpt": "{{ $json.description }}",
  "tags": ["rss", "imported"],
  "author": "SDAD",
  "published": true
}
```

---

## Complete n8n Workflow Example

### Workflow Structure

```
[Trigger] → [Code/Transform] → [HTTP Request] → [Error Handler]
```

### Example: Manual Trigger Workflow

1. **Manual Trigger Node**
   - Provides test data

2. **Set Node** (Optional)
   - Format your data
   - Example:
     ```javascript
     {
       title: "Test Post",
       content: "# Test\n\nThis is a test.",
       tags: ["test"]
     }
     ```

3. **HTTP Request Node**
   - **Method**: `POST`
   - **URL**: `https://blog.sdad.pro/api/posts`
   - **Headers**: 
     ```json
     {
       "Authorization": "Bearer YOUR_API_KEY",
       "Content-Type": "application/json"
     }
     ```
   - **Body**: 
     ```json
     {
       "title": "{{ $json.title }}",
       "content": "{{ $json.content }}",
       "tags": {{ JSON.stringify($json.tags || []) }}
     }
     ```

4. **Error Trigger Node** (Optional)
   - Catch and handle errors
   - Send notifications on failure

---

## Testing Your Workflow

### Test Request Body

Use this in a Manual Trigger node for testing:

```json
{
  "title": "Test Blog Post",
  "content": "# Test Post\n\nThis is a test blog post.\n\n## Features\n\n- Testing API\n- n8n integration",
  "excerpt": "A test blog post",
  "tags": ["test", "n8n", "api"],
  "author": "SDAD",
  "published": true
}
```

### Expected Success Response

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "post": {
    "slug": "test-blog-post",
    "title": "Test Blog Post",
    "date": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Common n8n Expressions

### Get Title from Previous Node
```
{{ $json.title }}
```

### Get Content
```
{{ $json.content }}
```

### Format Tags Array
```
{{ JSON.stringify($json.tags || []) }}
```

### Default Value
```
{{ $json.author || 'SDAD' }}
```

### Boolean Value
```
{{ $json.published !== false }}
```

### Current Date (ISO)
```
{{ new Date().toISOString() }}
```

---

## Error Handling in n8n

### Add Error Trigger Node

1. Add **Error Trigger** node after HTTP Request
2. Connect to notification/logging node
3. Check for errors:

```javascript
if ($json.error) {
  // Log error
  console.error('API Error:', $json.error);
  
  // Return error data
  return {
    error: true,
    message: $json.error,
    status: $json.statusCode
  };
}
```

---

## Security Best Practices

1. **Store API Key Securely**
   - Use n8n Credentials
   - Never hardcode in workflow
   - Use environment variables

2. **Use Credentials**
   - In n8n, go to Credentials
   - Create new credential for API key
   - Reference in HTTP Request node

3. **Validate Data**
   - Add validation before API call
   - Check required fields
   - Sanitize content

---

## Workflow Templates

### Template 1: RSS Feed to Blog

```
[RSS Feed Trigger] → [Transform Data] → [HTTP Request] → [Success Notification]
                                                             ↓
                                                    [Error Trigger] → [Error Notification]
```

### Template 2: Webhook to Blog

```
[Webhook Trigger] → [Validate Data] → [HTTP Request] → [Response]
                                                          ↓
                                                   [Error Handler]
```

### Template 3: Schedule Posts

```
[Schedule Trigger] → [Fetch Data] → [HTTP Request] → [Log Result]
                                                    ↓
                                            [Error Handler]
```

---

## Quick Copy-Paste Configuration

### HTTP Request Node Configuration (JSON)

```json
{
  "method": "POST",
  "url": "https://blog.sdad.pro/api/posts",
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "{{ $json.title }}",
    "content": "{{ $json.content }}",
    "excerpt": "{{ $json.excerpt || '' }}",
    "tags": "{{ JSON.stringify($json.tags || []) }}",
    "author": "{{ $json.author || 'SDAD' }}",
    "published": true
  }
}
```

---

## Troubleshooting

### Issue: 401 Unauthorized
- ✅ Check API key is correct
- ✅ Verify API key format: `Bearer YOUR_API_KEY`
- ✅ Check if API key is set in Vercel

### Issue: 400 Bad Request
- ✅ Verify `title` field exists
- ✅ Verify `content` field exists
- ✅ Check JSON format is valid

### Issue: Content Not Appearing
- ✅ Verify markdown format is correct
- ✅ Check if `published: true`
- ✅ Wait a few seconds for file to be written

---

## Support

For detailed API documentation, see `API_DOCUMENTATION.md`

---

## Example: Complete n8n Workflow JSON

See `n8n_workflow_example.json` for a complete importable workflow.

