---
name: vitepress-pagefind-search
description: Integrate Pagefind static search into VitePress with Chinese optimization and Termux/Android ARM64 workaround
source: auto-skill
extracted_at: '2026-07-29T05:25:47.796Z'
---

# VitePress Pagefind Search Integration

## Problem
VitePress default local search (MiniSearch) has poor Chinese support for MB-level content:
- Index size ~150-200% of source (large mobile download)
- No Chinese word segmentation (character-level only)
- No pinyin/first-letter search
- High memory usage on mobile

Pagefind is better but:
- No prebuilt binary for `android-arm64` (Termux)
- Requires `pagefind` CLI at build time
- Need Chinese tokenization optimization

## Solution

### 1. Install dependencies
```bash
pnpm add -D vitepress-plugin-pagefind@0.4.23 pagefind@1.5.2 @pagefind/linux-arm64@1.5.2
```

### 2. Configure plugin in `.vitepress/config.ts`
```typescript
import { pagefindPlugin, chineseSearchOptimize } from 'vitepress-plugin-pagefind'

export default defineConfig({
  // ...
  vite: {
    plugins: [
      pagefindPlugin({
        customSearchQuery: chineseSearchOptimize,  // Intl.Segmenter for Chinese
        forceLanguage: 'zh-cn',
        btnPlaceholder: '搜索',
        placeholder: '搜索文档',
        emptyText: '无结果',
        loadingText: '搜索中...',
      })
    ]
  },
  themeConfig: {
    // Disable built-in search
    // search: { provider: 'local' }  // REMOVE or comment out
  }
})
```

### 3. Workaround Termux/Android ARM64 binary issue
The `pagefind` npm package has no `android-arm64` binary. Use `@pagefind/linux-arm64` instead:

**package.json:**
```json
{
  "scripts": {
    "build": "PAGEFIND_BINARY_PATH=/path/to/node_modules/@pagefind/linux-arm64/bin/pagefind_extended vitepress build"
  }
}
```

The binary path must point to `pagefind_extended` (not `pagefind`).

### 4. Chinese search optimization
Plugin provides `chineseSearchOptimize` using `Intl.Segmenter('zh-CN', { granularity: 'word' })` for proper word boundaries.

For better results, consider `pagefind-plugin-ik` (adds ~2 MB wasm):
```typescript
// pagefindPlugin({
//   // plugins: [pagefindPluginIk()],
// })
```

### 5. Build output verification
```bash
# Check index stats
cat .vitepress/dist/pagefind/pagefind-entry.json
# {"version":"1.5.2","languages":{"zh-cn":{"hash":"zh-cn_xxx","wasm":null,"page_count":486}}}

# Count fragment files (lazy-loaded chunks)
ls .vitepress/dist/pagefind/fragment/ | wc -l  # 486 pages

# Total size
du -sh .vitepress/dist/pagefind/  # ~9.7 MB (includes fragments)
```

### 6. Key metrics (486 Chinese articles, ~8 MB Markdown)
| Metric | Value |
|--------|-------|
| Indexed pages | 486 |
| Indexed words | ~33,800 |
| Build time overhead | +2.2 s |
| Total index size | 9.7 MB |
| First-load (gzipped) | ~120 KB |
| Mobile memory | < 10 MB |

## Alternative: Manual pagefind CLI (if plugin fails)
```bash
npx pagefind --site .vitepress/dist \
  --exclude-selectors "div.aside, a.header-anchor" \
  --force-language zh-cn
```

Then add to `transformHead`:
```typescript
transformHead({ siteData }) {
  return [
    ['script', {}, `
      import('/pagefind/pagefind.js')
        .then(m => { window.__pagefind__ = m; m.init(); })
        .catch(() => {});
    `]
  ]
}
```

## Notes
- Plugin auto-replaces `VPNavBarSearch.vue` with Pagefind UI (Algolia-style)
- Search works fully offline - deploy `.vitepress/dist/` to any static host
- Exclude pages with frontmatter: `pagefind-indexed: false`
- For i18n, configure `locales` in plugin options