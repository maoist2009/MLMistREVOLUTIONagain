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
    ],
    async transformHead({ pageData }) {
      const title = pageData.frontmatter.title || pageData.title || "继续革命社&文革斗争社";
      const description = pageData.frontmatter.description || "继续革命社&文革斗争社网站";
      const cleanPath = pageData.relativePath.replace(/\.md$/, '.html');
      const url = `https://mlmistrevolutionagain.pages.dev/${cleanPath}`;

      // 切换回正式公网域名坐标
      const imageUrl = pageData.frontmatter.image
        ? `https://mlmistrevolutionagain.pages.dev${pageData.frontmatter.image}`
        : "https://mlmistrevolutionagain.pages.dev/avator.svg";

      return [
        ["meta", { property: "og:title", content: title }],
        ["meta", { property: "og:description", content: description }],
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:url", content: url }],
        ["meta", { property: "og:image", content: imageUrl }],
      ];
    },
    sitemap: {
      hostname: 'https://mlmistrevolutionagain.pages.dev',
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
          link: "https://mlmistrevolutionagain.pages.dev/feed.xml",
        },
      ]),

      outline: [2,6], 
      aside: false,
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
