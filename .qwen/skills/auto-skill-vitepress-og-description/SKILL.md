---
name: vitepress-og-description
description: Extract og:description from markdown first paragraph in VitePress, handling frontmatter and blockquotes
source: auto-skill
extracted_at: '2026-07-02T05:49:34.254Z'
---

# VitePress og:description Extraction

## Problem
VitePress `transformPageData` and `transformHead` hooks need to extract descriptions from markdown content for Open Graph meta tags, but:
- `pageData.content` may be rendered HTML, not raw markdown
- Frontmatter content should be skipped
- Blockquotes (`>`) are common in articles and should have markers stripped
- SSR errors occur when using `location` or `history` in setup()

## Solution

### 1. Use `pageData.filePath` for raw file access
```typescript
transformPageData(pageData) {
  if (!pageData.frontmatter?.description && pageData.filePath) {
    const rawContent = fs.readFileSync(pageData.filePath, 'utf-8');
    // ...
  }
}
```

### 2. Extract first paragraph with frontmatter and blockquote handling (multi-line for 100-150 chars)
```typescript
function extractFirstParagraph(content: string): string {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let description = '';
  for (const line of lines) {
    // Handle frontmatter
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) continue;

    // Strip blockquote markers
    let trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      trimmed = trimmed.replace(/^>+\s*/, '').trim();
    }

    // Skip empty lines, headings, code blocks
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
      const stripped = trimmed
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1');
      description += (description ? ' ' : '') + stripped;
      if (description.length >= 150) {
        return description.substring(0, 150);
      }
    }
  }
  return description.substring(0, 150);
}
```

### 3. Fix og:url path format (include leading `/`)
```typescript
const pagePath = pageData.relativePath || '';
head.push([
  "meta",
  {
    property: "og:url",
    content: `https://example.com${pagePath ? '/' + pagePath.replace(/\.md$/, '.html') : ''}`,
  },
]);
```

### 4. Fix SSR errors with `location` and `history`
In Vue components, wrap browser APIs in `onMounted()`:
```typescript
import { onMounted, ref } from 'vue';

const cdf = ref<() => void>(() => {});
onMounted(() => {
  cdf.value = () => {
    if (location.href.endsWith("/"))
      location.assign("../");
    else
      location.assign("./");
  };
});
```

Or use guard checks:
```typescript
function handleClick() {
  if (typeof location !== 'undefined') {
    location.assign(LinkUrl.value);
  }
}
```

### 5. Fix file names with trailing spaces
Files like `filename .md` cause VitePress module resolution errors. Rename to remove trailing spaces:
```bash
find . -name "* .md" -o -name "* .html"  # Find files with trailing spaces
# Then rename them
```