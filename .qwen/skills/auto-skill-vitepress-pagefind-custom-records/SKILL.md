---
name: vitepress-pagefind-custom-records
description: Add custom/external search records to Pagefind index programmatically after VitePress build
source: auto-skill
extracted_at: '2026-07-29T09:40:03.919Z'
---

# VitePress Pagefind Custom Records

## Problem
VitePress + Pagefind indexes **only static HTML files** generated from Markdown. But real sites often need to search:
- External API data (Headless CMS, Notion, Ghost, etc.)
- API documentation endpoints
- Database-driven content
- Legacy content not in VitePress
- Dynamically generated pages

The `vitepress-plugin-pagefind` runs at build time via `buildEnd` hook and only processes HTML files on disk.

## Solution: Post-Build Custom Record Injection

Use Pagefind's **programmatic JS API** (`createIndex`, `addCustomRecord`, `writeFiles`) to inject arbitrary records after the main build completes.

### 1. Install dependencies (already present if using plugin)
```bash
pnpm add -D pagefind @pagefind/linux-arm64
```

### 2. Create custom records script
`scripts/add-pagefind-custom.mjs`:
```javascript
import { createIndex, close } from 'pagefind'
import { platform, arch } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

// Termux/Android ARM64 binary workaround
const isTermux = platform() === 'android' && arch() === 'arm64'
if (isTermux) {
  const bin = join(process.cwd(), 'node_modules', '@pagefind', 'linux-arm64', 'bin', 'pagefind_extended')
  if (existsSync(bin)) process.env.PAGEFIND_BINARY_PATH = bin
}

/**
 * Add custom records to existing Pagefind index
 * @param {Object} options
 * @param {string} options.bundleDir - Pagefind bundle dir (e.g. '.vitepress/dist/pagefind')
 * @param {string} options.siteDir - Built site dir (e.g. '.vitepress/dist')
 * @param {Array<Object>} options.customRecords - Records to add
 * @param {string[]} [options.excludeSelectors] - CSS selectors to ignore
 * @param {string} [options.forceLanguage] - Force language code
 */
export async function addPagefindCustomRecords(options) {
  const {
    bundleDir = '.vitepress/dist/pagefind',
    siteDir = '.vitepress/dist',
    customRecords = [],
    excludeSelectors = ['div.aside', 'a.header-anchor'],
    forceLanguage = 'zh-cn'
  } = options

  // 1. Open/create index with same config as vitepress-plugin-pagefind
  const pf = await createIndex({
    forceLanguage,
    excludeSelectors
  })

  // 2. Re-index the built site (matches plugin's buildEnd behavior)
  const dirResult = await pf.index.addDirectory({
    path: siteDir,
    glob: '**/*.html'
  })
  console.log(`[pagefind-custom] Indexed ${dirResult.page_count} pages from ${siteDir}`)

  // 3. Add each custom record
  for (const record of customRecords) {
    const result = await pf.index.addCustomRecord({
      url: record.url,                    // Required: search result URL
      content: record.content,            // Required: searchable text
      language: record.language || 'zh-cn', // Optional: ISO 639-1
      meta: record.meta || {},            // Optional: { title, description, author, tags... }
      filters: record.filters || {},      // Optional: { category: ['tech'], source: ['cms'] }
      sort: record.sort || {}             // Optional: { date: '2024-01-15', priority: 'high' }
    })
    console.log(`[pagefind-custom] Added: ${result.file.url} (${result.file.uniqueWords} words)`)
  }

  // 4. Write updated index to disk
  const writeResult = await pf.index.writeFiles({ outputPath: bundleDir })
  console.log(`[pagefind-custom] Index written to ${writeResult.outputPath}`)

  await close()
  return { pageCount: dirResult.page_count, customCount: customRecords.length }
}
```

### 3. Usage in build script
`scripts/build-pagefind.mjs`:
```javascript
import { spawnSync } from 'node:child_process'
import { addPagefindCustomRecords } from './add-pagefind-custom.mjs'

// Step 1: Normal VitePress build (triggers plugin's pagefind via buildEnd)
const buildResult = spawnSync('pnpm', ['vitepress', 'build'], {
  stdio: 'inherit', shell: true
})
if (buildResult.status !== 0) process.exit(buildResult.status ?? 1)

// Step 2: Inject custom records
await addPagefindCustomRecords({
  bundleDir: '.vitepress/dist/pagefind',
  siteDir: '.vitepress/dist',
  customRecords: [
    // Example: External CMS content
    {
      url: '/cms/blog/post-1/',
      content: '从 Headless CMS 同步的博客文章内容...',
      meta: { title: '外部博客文章', author: 'CMS Author', tags: ['tech', 'vue'] },
      filters: { source: ['cms'], category: ['blog'] },
      sort: { date: '2024-03-10' }
    },
    // Example: API endpoint documentation
    {
      url: '/api/users/get/',
      content: 'GET /api/users - 获取用户列表，支持分页、筛选、排序',
      meta: { title: '获取用户列表 API', description: '返回所有用户' },
      filters: { type: ['api'], endpoint: ['users'] },
      sort: { date: '2024-02-01', version: 'v1' }
    }
    // Add more records or fetch from external API:
    // ...await fetch('https://api.example.com/search-content').then(r => r.json())
  ],
  excludeSelectors: ['div.aside', 'a.header-anchor'],
  forceLanguage: 'zh-cn'
})
```

### 4. Run
```bash
node scripts/build-pagefind.mjs
# or in package.json:
# "build": "node scripts/build-pagefind.mjs"
```

## Key API Details

### `createIndex(config)`
| Option | Type | Description |
|--------|------|-------------|
| `forceLanguage` | string | Force single language (e.g. `'zh-cn'`) |
| `excludeSelectors` | string[] | CSS selectors to ignore (same as CLI indexing) |
| `rootSelector` | string | Root element selector (default: `html`) |
| `includeCharacters` | string | Extra chars to index (e.g. `'<>$.'`) |

### `addCustomRecord(record)`
| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `url` | ✅ | string | Result link - **must start with `/`** |
| `content` | ✅ | string | Full searchable text |
| `language` | ❌ | string | ISO 639-1, default `'zh-cn'` |
| `meta` | ❌ | object | Shown in results UI: `title`, `description`, etc. |
| `filters` | ❌ | object | `{ category: ['tech', 'vue'] }` for faceted search |
| `sort` | ❌ | object | `{ date: '2024-01-01' }` - **values must be strings** |

### `writeFiles({ outputPath })`
Writes updated index fragments, filters, sorts to `outputPath`.

## Verification
```bash
# Check new filter files (faceted search)
ls .vitepress/dist/pagefind/filter/
# zh-cn_xxx.pf_filter (contains your custom filter keys)

# Check page count increased
cat .vitepress/dist/pagefind/pagefind-entry.json
# {"page_count": 488}  # was 486

# Inspect a custom fragment (gzip compressed)
gzip -dc .vitepress/dist/pagefind/fragment/zh-cn_*.pf_fragment | head -1
# pagefind_dcd{"url":"/cms/blog/post-1/","content":"从 Headless CMS...","filters":{"source":["cms"],"category":["blog"]}...
```

## Use Cases

| Source | Integration Pattern |
|--------|---------------------|
| Headless CMS (Contentful, Strapi, Notion) | Fetch at build time → `addCustomRecord` |
| OpenAPI/Swagger specs | Parse endpoints → generate records |
| Legacy HTML site | Crawl + extract → add records |
| Database-driven content | Query DB at build → add records |
| External docs (GitBook, Confluence) | Export → transform → add records |

## Platform Notes
- **Termux/Android ARM64**: Requires `PAGEFIND_BINARY_PATH=./node_modules/@pagefind/linux-arm64/bin/pagefind_extended`
- **Linux/macOS/Windows**: Works out of the box with `pagefind` package
- The script auto-detects Termux and sets the env var

## Related Skills
- `vitepress-pagefind-integration` - Basic plugin setup
- `vitepress-pagefind-search` - Chinese optimization + ARM64 workaround