import { getPosts, getPostLength } from "./theme/serverUtils";
import { buildBlogRSS } from "./theme/rss";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import mathjax3 from "markdown-it-mathjax3";
import multimd_table_plugin from "markdown-it-multimd-table";
import { withSidebar } from 'vitepress-sidebar';
import { imgSize } from "@mdit/plugin-img-size";
import { footnote } from "@mdit/plugin-footnote";
import { tasklist } from "@mdit/plugin-tasklist";
import { ins } from '@mdit/plugin-ins'
import { mark } from '@mdit/plugin-mark'
import { defineConfig,clientOnly } from 'vitepress'
import fs from 'fs'
import { pagefindPlugin, chineseSearchOptimize } from 'vitepress-plugin-pagefind'
import { platform, arch } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'

// Use pagefind_extended binary on Termux (android-arm64)
const isTermux = platform() === 'android' && arch() === 'arm64'
const pagefindBinary = isTermux
  ? join(process.cwd(), 'node_modules', '@pagefind', 'linux-arm64', 'bin', 'pagefind_extended')
  : 'npx pagefind'

const indexingCommand = existsSync(pagefindBinary)
  ? `${pagefindBinary} --site "${process.cwd()}/.vitepress/dist" --exclude-selectors "div.aside, a.header-anchor" --force-language zh-cn`
  : undefined

function extractFirstParagraph(content: string): string {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let description = '';
  for (const line of lines) {
    // Handle frontmatter
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        inFrontmatter = false;
        continue;
      }
    }
    if (inFrontmatter) continue;

    // Strip blockquote markers and leading/trailing whitespace
    let trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      trimmed = trimmed.replace(/^>+\s*/, '').trim();
    }
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
      // Strip markdown formatting (bold, italic, links, etc.)
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

async function config() {
  return defineConfig(withSidebar({
    lang: "zh-CN",
    title: "继续革命社&文革斗争社",
    description: "继续革命社&文革斗争社网站",
    metaChunk: true,
    head: [
      [
        "link",
        {
          rel: "icon",
          type: "image/svg",
          href: "/avator.svg",
        },
      ],
      [
        "meta",
        {
          name: "author",
          content: "MLMists",
        },
      ],
    ],
    transformPageData(pageData) {
      // Extract description from first paragraph if not set in frontmatter
      if (!pageData.frontmatter?.description && pageData.filePath) {
        try {
          const rawContent = fs.readFileSync(pageData.filePath, 'utf-8');
          const extractedDesc = extractFirstParagraph(rawContent);
          if (extractedDesc) {
            pageData.frontmatter.description = extractedDesc;
          }
        } catch (e) {
          // Fallback to pageData.content if file read fails
          if ((pageData as any).content) {
            const extractedDesc = extractFirstParagraph((pageData as any).content);
            if (extractedDesc) {
              pageData.frontmatter.description = extractedDesc;
            }
          }
        }
      }
    },
    transformHead({ pageData }) {
      const head: any[] = [];

      // og:title - VitePress already provides this via pageData.title
      if (pageData.title) {
        head.push([
          "meta",
          {
            property: "og:title",
            content: pageData.title,
          },
        ]);
      }

      // og:description - from frontmatter or extracted
      let description = pageData.frontmatter?.description;
      if (!description && pageData.filePath) {
        try {
          const rawContent = fs.readFileSync(pageData.filePath, 'utf-8');
          description = extractFirstParagraph(rawContent);
        } catch (e) {}
      }
      head.push([
        "meta",
        {
          property: "og:description",
          content: description || "继续革命社&文革斗争社官方网站",
        },
      ]);

      // og:image - use frontmatter image or fallback to favicon
      const image = pageData.frontmatter?.image || "https://mlmcrs.pages.dev/avator.svg";
      head.push([
        "meta",
        {
          property: "og:image",
          content: image,
        },
      ]);

      // og:url - current page URL
      const pagePath = pageData.relativePath || '';
      head.push([
        "meta",
        {
          property: "og:url",
          content: `https://mlmcrs.pages.dev${pagePath ? '/' + pagePath.replace(/\.md$/, '.html') : ''}`,
        },
      ]);

      // og:type
      head.push([
        "meta",
        {
          property: "og:type",
          content: "article",
        },
      ]);

      // twitter:card
      head.push([
        "meta",
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ]);

      // Service Worker registration
      head.push([
        "script",
        {},
        `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js', { scope: '/' }); }`,
      ]);

      return head;
    },
    sitemap: {
      hostname: 'https://mlmcrs.pages.dev',
    },
    // cleanUrls: "with-subfolders",
    lastUpdated: true,
    themeConfig: {
      // repo: "clark-cui/homeSite",
      logo: "/avator.svg",
      avator: "/avator.svg",
      // search handled by pagefind plugin
      docsDir: "/",
      // docsBranch: "master",
      posts: await getPosts(),
      pageSize: 5,
      postLength: await getPostLength(),
      nav: clientOnly([
        {
          text: "🏡Blogs",
          link: "/",
        },
        {
          text: "🔖Tags",
          link: "/tags",
        },
        {
          text: "📃Archives",
          link: "/archives",
        },
        {
          text: "🔥RSS",
          link: "https://mlmcrs.pages.dev/feed.xml",
        },
      ]),

      outline: [2,6], //设置右侧aside显示层级
      aside: false,
      // blogs page show firewokrs animation
      showFireworksAnimation: false,
      sidebarMenuLabel: "网站目录",
      outlineTitle: "文内目录"
    },
    buildEnd: buildBlogRSS,
    markdown: {
      theme: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
      codeTransformers: [transformerTwoslash()],
      config: (md) => {
        // 使用更多的 Markdown-it 插件！
        md.use(multimd_table_plugin, {
          multiline: true,
          rowspan: true,
        });
        md.use(mathjax3);
        md.use(imgSize);
        md.use(footnote);
        md.use(tasklist);
        md.use(ins);
        md.use(mark);
      }
    },
    vue: {
      template: {
        compilerOptions: {
        }
      }
    },
    vite: {
      plugins: [
        pagefindPlugin({
          indexingCommand,
          customSearchQuery: chineseSearchOptimize,
          forceLanguage: 'zh-cn',
          btnPlaceholder: '搜索',
          placeholder: '搜索文档',
          emptyText: '无结果',
          loadingText: '搜索中...',
        }),
        VitePWA({
          mode: 'generateSW',
          registerType: 'autoUpdate',
          includeAssets: ['avator.svg', 'robots.txt'],
          manifest: {
            name: '继续革命社&文革斗争社',
            short_name: '继续革命社',
            description: '继续革命社&文革斗争社官方网站',
            theme_color: '#3eaf7c',
            background_color: '#ffffff',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            icons: [
              {
                src: '/avator.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
            cleanupOutdatedCaches: true,
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/mlmcrs\.pages\.dev\/pagefind\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'pagefind-index',
                  expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
                }
              },
              {
                urlPattern: /^https:\/\/mlmcrs\.pages\.dev\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'api-cache',
                  expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }
                }
              },
              {
                urlPattern: ({ request }) => request.mode === 'navigate',
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'pages',
                  expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }
                }
              }
            ]
          }
        })
      ]
    },
  }, {
    documentRootPath: '/',
    collapsed: true,
    useTitleFromFrontmatter: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    sortMenusByFrontmatterOrder: true,
    excludePattern: [
      ".vitepress",
      "node_modules",
      "archives.md",
      "GroupInfo.md",
      "tags.md",

    ]
  }));
}
export default config();