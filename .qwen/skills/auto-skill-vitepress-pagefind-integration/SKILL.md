---
name: vitepress-pagefind-integration
description: Integrate Pagefind offline full-text search into VitePress with Chinese optimization and ARM64 binary handling
source: auto-skill
extracted_at: '2026-07-29T05:16:36.401Z'
---

# VitePress Pagefind Integration

## Problem
VitePress default "local" search (MiniSearch) has poor Chinese tokenization, large index size (~original text 1.5-2×), and loads entire index on first visit. For MB-level Chinese sites, need: smaller index, better Chinese search, lazy-loading, offline static deployment.

Pagefind solves this but:
- No prebuilt `android-arm64` binary (Termux on Android)
- Plugin `vitepress-plugin-pagefind` uses `npx pagefind` CLI that fails on unsupported platforms
- Need Chinese search optimization (`Intl.Segmenter`)

## Solution

### 1. Install dependencies
```bash
pnpm add -D vitepress-plugin-pagefind pagefind @pagefind/linux-arm64
```

### 2. Configure in `.vitepress/config.ts`
```typescript
import { pagefindPlugin, chineseSearchOptimize } from 'vitepress-plugin-pagefind'

export default defineConfig({
  // ...
  vite: {
    plugins: [
      pagefindPlugin({
        customSearchQuery: chineseSearchOptimize,  // Chinese word segmentation
        forceLanguage: 'zh-cn',                    // Force Chinese index
        btnPlaceholder: '搜索',
        placeholder: '搜索文档',
        emptyText: '无结果',
        loadingText: '搜索中...',
      }),
    ],
  },
  themeConfig: {
    // Disable built-in search
    // search: { provider: 'local' },  // remove or comment out
  },
})
```

### 3. Fix ARM64 binary on Android/Termux
The `@pagefind/linux-arm64` package provides `pagefind_extended` binary but it's named differently. Set env var in `package.json`:

```json
{
  "scripts": {
    "build": "PAGEFIND_BINARY_PATH=/path/to/node_modules/@pagefind/linux-arm64/bin/pagefind_extended vitepress build"
  }
}
```

Or in CI/terminal:
```bash
PAGEFIND_BINARY_PATH=./node_modules/@pagefind/linux-arm64/bin/pagefind_extended pnpm build
```

### 4. Verify build output
```
=== pagefind: https://pagefind.app/ ===
npx pagefind --site ".vitepress/dist" --exclude-selectors "div.aside, a.header-anchor" --force-language zh-cn
Running Pagefind v1.5.2 (Extended)
Indexed 1 language
Indexed 486 pages
Indexed 33800 words
Finished in 2.2s
```

Index size: ~10 MB total (includes wasm, js, fragment indexes)
First-load: ~50 KB (lazy-loaded fragments)

### 5. Optional: exclude pages from index
In markdown frontmatter:
```yaml
---
pagefind-indexed: false
---
```

### 6. Optional: custom filter/sort
```typescript
pagefindPlugin({
  filter: (item) => item.meta.publish !== false,
  sort: (a, b) => new Date(b.meta.date) - new Date(a.meta.date),
})
```

## Key Files Modified
- `.vitepress/config.ts` - plugin config, disable built-in search
- `package.json` - build script with `PAGEFIND_BINARY_PATH`

## Platform Note
For non-ARM64 Linux/macOS/Windows, `@pagefind/linux-arm64` not needed - `pagefind` package auto-resolves correct binary.

## Result
- Chinese search: word-level segmentation via `Intl.Segmenter('zh-CN')`
- Offline: pure static files in `.vitepress/dist/pagefind/`
- Mobile-friendly: ~50 KB initial load, fragments loaded on demand
- Zero server dependency