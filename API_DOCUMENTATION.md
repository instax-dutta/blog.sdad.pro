# Blog API Documentation

API endpoint for posting blogs automatically to `blog.sdad.pro` from n8n workflows.

## Base URL

```
https://blog.sdad.pro/api/posts
```

## Authentication

The API uses API key authentication. You can provide the API key in two ways:

1. **Authorization Header (Recommended)**:
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

2. **Custom Header**:
   ```
   x-api-key: YOUR_API_KEY
   ```

### Setting up API Key

1. Set `BLOG_API_KEY` as an environment variable in Vercel
2. Use the same value in your n8n workflow

**Important**: Never commit your API key to version control. Always use environment variables.

---

## Endpoints

### POST `/api/posts`

Create a new blog post.

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

OR

```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Blog post title |
| `content` | string | ✅ Yes | Blog post content in Markdown format |
| `excerpt` | string | ❌ No | Brief description of the post |
| `tags` | array or string | ❌ No | Array of tags or single tag string |
| `author` | string | ❌ No | Author name (defaults to "SDAD") |
| `date` | string | ❌ No | ISO 8601 date string (defaults to current date) |
| `image` | string | ❌ No | Featured image URL |
| `published` | boolean | ❌ No | Whether to publish the post (defaults to true) |

#### Example Request

```json
{
  "title": "My First Blog Post",
  "content": "# Hello World\n\nThis is my first blog post!\n\n## Features\n\n- Markdown support\n- API integration\n- Automatic posting",
  "excerpt": "A brief introduction to my blog",
  "tags": ["blog", "introduction", "first-post"],
  "author": "SDAD",
  "published": true
}
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "post": {
    "slug": "my-first-blog-post",
    "title": "My First Blog Post",
    "date": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

**401 Unauthorized** - Invalid or missing API key
```json
{
  "error": "Unauthorized. Invalid or missing API key."
}
```

**400 Bad Request** - Missing required fields
```json
{
  "error": "Missing required fields: title and content are required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

---

### GET `/api/posts`

Get API documentation and usage information.

#### Response (200 OK)

Returns JSON with API usage documentation.

---

## n8n Workflow Setup

### Step 1: HTTP Request Node Configuration

1. Add an **HTTP Request** node to your n8n workflow
2. Configure it as follows:

**Node Settings:**
- **Method**: `POST`
- **URL**: `https://blog.sdad.pro/api/posts`
- **Authentication**: `Generic Credential Type`
- **Send Headers**: `true`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Body:**
- **Body Content Type**: `JSON`
- **JSON Body**: Configure using expression or static JSON

### Step 2: Example n8n HTTP Request Configuration

```javascript
// URL
https://blog.sdad.pro/api/posts

// Method
POST

// Headers (JSON)
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}

// Body (JSON)
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "excerpt": "{{ $json.excerpt }}",
  "tags": {{ $json.tags }},
  "author": "{{ $json.author || 'SDAD' }}",
  "published": true
}
```

### Step 3: Complete n8n Workflow Example

1. **Trigger Node** (e.g., Schedule, Webhook, Manual Trigger)
2. **Set Node** (Optional - to format your data)
3. **HTTP Request Node** (Configure as above)
4. **Error Handling Node** (Optional - to catch errors)

---

## Example Use Cases

### 1. Posting from RSS Feed

**Workflow:**
1. **RSS Feed Trigger** → Fetch latest articles
2. **Code Node** → Convert RSS item to blog post format
3. **HTTP Request** → Post to blog API

**Example Code Node:**
```javascript
const items = $input.all();
return items.map(item => ({
  json: {
    title: item.json.title,
    content: item.json.description + '\n\n' + item.json['content:encoded'],
    excerpt: item.json.description,
    tags: ['rss', 'imported'],
    author: 'SDAD',
    published: true
  }
}));
```

### 2. Posting from Google Docs/Notion

**Workflow:**
1. **Google Drive/Notion Trigger** → Detect new document
2. **Extract Content** → Get document content
3. **Transform Data** → Format as blog post
4. **HTTP Request** → Post to blog API

### 3. Scheduled Blog Posts

**Workflow:**
1. **Schedule Trigger** → Run daily/weekly
2. **Fetch Content** → From database/API
3. **HTTP Request** → Post to blog API

### 4. Auto-Posting from External Sources

**Workflow:**
1. **Webhook** → Receive post from external system
2. **Validate Data** → Check required fields
3. **HTTP Request** → Post to blog API
4. **Notify** → Send confirmation

---

## Request Examples

### Minimal Request

```json
{
  "title": "Simple Post",
  "content": "# Simple Post\n\nThis is a simple blog post."
}
```

### Full Featured Request

```json
{
  "title": "Advanced Blog Post",
  "content": "# Advanced Post\n\n## Introduction\n\nThis is an advanced blog post with full features.\n\n### Features\n\n1. Markdown support\n2. Code blocks\n3. Images\n\n```javascript\nconsole.log('Hello World');\n```\n\n## Conclusion\n\nThanks for reading!",
  "excerpt": "An advanced blog post demonstrating all features",
  "tags": ["advanced", "features", "markdown", "code"],
  "author": "SDAD",
  "date": "2024-01-15T10:30:00.000Z",
  "image": "https://example.com/image.jpg",
  "published": true
}
```

### Using Tags as Array

```json
{
  "title": "Array Tags Example",
  "content": "Content here",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Using Tags as String

```json
{
  "title": "String Tags Example",
  "content": "Content here",
  "tags": "single-tag"
}
```

---

## Markdown Content Format

The `content` field accepts full Markdown syntax:

### Headers
```markdown
# H1
## H2
### H3
```

### Text Formatting
```markdown
**bold** *italic* `code`
```

### Lists
```markdown
- Item 1
- Item 2

1. Numbered 1
2. Numbered 2
```

### Code Blocks
````markdown
```javascript
const code = "example";
```
````

### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](https://example.com/image.jpg)
```

### Blockquotes
```markdown
> This is a quote
```

---

## Slug Generation

The blog post slug is automatically generated from the title:
- Converted to lowercase
- Special characters replaced with hyphens
- Spaces replaced with hyphens
- Multiple hyphens collapsed

**Example:**
- Title: "My Awesome Blog Post!"
- Slug: `my-awesome-blog-post`

---

## Testing the API

### Using cURL

```bash
curl -X POST https://blog.sdad.pro/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "Test Post",
    "content": "# Test\n\nThis is a test post.",
    "excerpt": "A test post",
    "tags": ["test"],
    "published": true
  }'
```

### Using Postman

1. Method: `POST`
2. URL: `https://blog.sdad.pro/api/posts`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_API_KEY`
4. Body (raw JSON):
   ```json
   {
     "title": "Test Post",
     "content": "# Test\n\nContent here"
   }
   ```

### Using n8n Manual Test

1. Create a workflow with Manual Trigger
2. Add HTTP Request node with configuration above
3. Execute workflow
4. Check response

---

## Error Handling

### Common Errors

**401 Unauthorized**
- Check if API key is correct
- Verify API key is set in Vercel environment variables
- Ensure header is formatted correctly

**400 Bad Request**
- Verify `title` and `content` fields are present
- Check JSON format is valid

**500 Internal Server Error**
- Check server logs
- Verify file permissions for `data/posts/` directory
- Contact support if issue persists

### n8n Error Handling

Add an **Error Trigger** node to catch and handle errors:

```javascript
// In Error Trigger node
if ($json.error) {
  // Handle error
  console.error('API Error:', $json.error);
  // Send notification, log error, etc.
}
```

---

## Best Practices

1. **API Key Security**
   - Store API key as n8n credential
   - Never commit API key to version control
   - Use different API keys for different environments

2. **Error Handling**
   - Always handle errors in your workflow
   - Log failed requests
   - Send notifications for failures

3. **Rate Limiting**
   - Be mindful of request frequency
   - Implement delays if posting multiple posts

4. **Content Validation**
   - Validate content before posting
   - Sanitize user input
   - Check required fields

5. **Testing**
   - Test with `published: false` first
   - Verify content format before posting
   - Use staging environment if available

---

## Support

For issues or questions:
- Check the API response for error messages
- Review server logs
- Ensure all required fields are provided
- Verify API key is correct

---

## Changelog

- **v1.0.0** (2024-01-15)
  - Initial API release
  - Support for creating blog posts
  - API key authentication
  - Markdown content support

