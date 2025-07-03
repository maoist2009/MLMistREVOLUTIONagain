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
      [
        "meta",
        {
          property: "og:title",
          content: "Home",
        },
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "继续革命社&文革斗争社官方网站",
        },
      ],
    ],
    sitemap: {
      hostname: 'https://mlmistrevolutionagain.codeberg.page',
    },
    // cleanUrls: "with-subfolders",
    lastUpdated: true,
    themeConfig: {
      // repo: "clark-cui/homeSite",
      logo: "/avator.svg",
      avator: "/avator.svg",
      search: {
        provider: "local",
      },
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
          link: "https://mlmistrevolutionagain.codeberg.page/feed.xml",
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
        // // add plugin
        // AutoSidebar({
        //   path: '/',
        //   collapsed: true,
        //   titleFromFile: true,
        //   ignoreList: [
        //     'node_modules',
        //     '.vitepress',
        //     'public ',
        //   ],
        // })
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

