# Blog API Quick Reference

Quick reference card for posting blogs via API to `blog.sdad.pro`.

---

## 🔗 Endpoint

```
POST https://blog.sdad.pro/api/posts
```

---

## 🔐 Authentication

**Header Option 1:**
```
Authorization: Bearer YOUR_API_KEY
```

**Header Option 2:**
```
x-api-key: YOUR_API_KEY
```

**Also Required:**
```
Content-Type: application/json
```

---

## ✅ Required Fields

```json
{
  "title": "Your Blog Post Title",
  "content": "# Your Markdown Content\n\nYour blog content here..."
}
```

---

## 📝 Optional Fields

```json
{
  "excerpt": "Brief description",
  "tags": ["tag1", "tag2"],
  "author": "SDAD",
  "date": "2024-01-15T10:30:00.000Z",
  "image": "https://example.com/image.jpg",
  "published": true
}
```

---

## 📤 Complete Example

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

---

## 📥 Success Response (201)

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "post": {
    "slug": "my-blog-post",
    "title": "My Blog Post",
    "date": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## ❌ Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized. Invalid or missing API key."
}
```

### 400 Bad Request
```json
{
  "error": "Missing required fields: title and content are required"
}
```

---

## 🔧 n8n Configuration

**Method:** `POST`  
**URL:** `https://blog.sdad.pro/api/posts`  
**Headers:**
- `Authorization`: `Bearer YOUR_API_KEY`
- `Content-Type`: `application/json`

**Body (JSON):**
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "tags": {{ JSON.stringify($json.tags || []) }}
}
```

---

## 📋 cURL Example

```bash
curl -X POST https://blog.sdad.pro/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "Test Post",
    "content": "# Test\n\nContent here"
  }'
```

---

## 📚 Full Documentation

See `API_DOCUMENTATION.md` for complete documentation.

