---
name: vitepress-pagefind-exact-phrase-cjk
description: Fix Pagefind exact phrase matching for CJK languages (Chinese/Japanese/Thai) where word segmentation breaks quoted searches
source: auto-skill
extracted_at: '2026-07-29T10:57:10.333Z'
---

## Problem

Pagefind's exact phrase matching (`"xxx"`) doesn't work for CJK languages because the query preprocessing performs word segmentation **before** the exact search flag is passed to the WASM backend.

### Root Cause (in `pagefind_web_js/lib/coupled_search.ts`)

```typescript
// Line 571: Exact search detected correctly
let exact_search = /^\s*".+"\s*$/.test(term);  // true for "继续革命"

// Lines 585-602: Word segmentation runs REGARDLESS of exact_search
if (needsWordSegmentation(trueLanguage)) {     // true for 'zh'
  const wordSegmenter = new Intl.Segmenter(trueLanguage, { granularity: "word" });
  for (const { segment: word } of wordSegmenter.segment(term)) {  // "继续革命" → ["继续", "革命"]
    // ...
    term_chunks.push(wordChunks.join(""));
  }
  term = term_chunks.join(" ").replace(/\s{2,}/g, " ").trim();  // "继续 革命" (with space!)
}

// Line 700: Backend receives transformed term with exact_search=true
let result = this.backend.search(ptr, term, originalTerm, filter_list, sort_list, exact_search, this.exactDiacritics);
```

**Result**: `"继续革命"` becomes `"继续 革命"` (two words with space) before reaching the WASM backend. The index contains `"继续革命"` (no space), so exact match fails.

## Fix Applied (Post-Build Patch Script)

We use a post-build patch script (`scripts/patch-pagefind.mjs`) that modifies the bundled `pagefind.js` after VitePress build.

### Patch Script Logic (`scripts/patch-pagefind.mjs`)

```javascript
const patterns = [
  // 1. Add searchTerm variable after exact_search detection and strip quotes
  {
    from: 'let exact_search=/^\\s*".+"\\s*$/.test(term);if(exact_search){log',
    to: 'let exact_search=/^\\s*".+"\\s*$/.test(term);let searchTerm=term;if(exact_search){searchTerm=term.replace(/^\\s*"(.+)"\\s*$/, \'$1\');log'
  },
  // 2. Skip segmentation for exact_search
  {
    from: 'if(trueLanguage&&typeof Intl.Segmenter!=="undefined"){const graphemeSegmenter',
    to: 'if(!exact_search&&trueLanguage&&typeof Intl.Segmenter!=="undefined"){const graphemeSegmenter'
  },
  // 3. Use searchTerm in wordSegmenter.segment()
  {
    from: 'for(const{segment:word}of wordSegmenter.segment(term)){',
    to: 'for(const{segment:word}of wordSegmenter.segment(searchTerm)){'
  },
  // 4. Use searchTerm in graphemeSegmenter.segment()
  {
    from: 'for(const{segment:grapheme}of graphemeSegmenter.segment(term)){',
    to: 'for(const{segment:grapheme}of graphemeSegmenter.segment(searchTerm)){'
  },
  // 5. Use searchTerm in non-CJK path
  {
    from: 'for(const char of term){',
    to: 'for(const char of searchTerm){'
  }
]
```

### Build Integration

The patch is **automatically applied** in `scripts/build-pagefind.mjs` after VitePress build completes:

```javascript
import { spawnSync } from 'node:child_process'
import { platform, arch } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const root = process.cwd()
const isTermux = platform() === 'android' && arch() === 'arm64'

if (isTermux) {
  const bin = join(root, 'node_modules', '@pagefind', 'linux-arm64', 'bin', 'pagefind_extended')
  if (existsSync(bin)) {
    process.env.PAGEFIND_BINARY_PATH = bin
  }
}

const result = spawnSync('pnpm', ['vitepress', 'build'], {
  stdio: 'inherit',
  cwd: root,
  shell: true,
})

// Apply exact phrase CJK patch after build
import('./patch-pagefind.mjs').catch(e => {
  console.error('Patch failed:', e)
  process.exit(1)
})

process.exit(result.status ?? 0)
```

Then run `node scripts/patch-pagefind.mjs` as a post-build step (imported above).

## Verification

After fix, these work correctly:
- Search `"继续革命"` → exact match on pages containing `继续革命`
- Search `"精确搜索"` → exact match on pages containing `精确搜索`
- Regular search `继续革命` → still works with segmentation (returns both words)

## Root Cause Fix (Upstream)

The proper fix should be in Pagefind source (`pagefind_web_js/lib/coupled_search.ts`):

```typescript
let exact_search = /^\s*".+"\s*$/.test(term);
let searchTerm = term;  // Store original for potential exact search

if (exact_search) {
  log(`Running an exact search`);
  // Strip quotes for exact search - don't segment!
  searchTerm = term.replace(/^\s*"(.+)"\s*$/, '$1');
}

// Only run segmentation if NOT exact_search
if (!exact_search && trueLanguage && typeof Intl.Segmenter !== "undefined") {
  // ... existing segmentation code using searchTerm
}
```

## Related Issues

- Pagefind GitHub: Search for "exact phrase Chinese" or "exact search CJK"
- This affects all CJK languages: `zh`, `ja`, `th` (detected by `needsWordSegmentation()`)