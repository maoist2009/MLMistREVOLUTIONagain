import { globby } from 'globby';
import matter from "gray-matter";
import fs from "fs-extra";
import { execSync } from "child_process";
import path from "path";

export async function getPosts() {
  let paths = await getPostMDFilePaths();
  let posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8");
      const { data } = matter(content);

      // 获取 Git 时间逻辑保持不变
      let gitTime = 0;
      try {
        const stdout = execSync(`git log -1 --format=%at "${item}"`);
        gitTime = parseInt(stdout.toString().trim()) * 1000;
      } catch (e) {
        gitTime = fs.statSync(item).mtimeMs;
      }

      if (!data.date) {
        data.date = _convertDate(gitTime);
      }

      return {
        frontMatter: data,
        // 这里确保路径处理正确，去掉 .md 换成 .html
        regularPath: `/${item.replace(".md", ".html")}`,
      };
    })
  );
  
  posts.sort(_compareDate);
  return posts;
}

function _convertDate(date) {
  const d = new Date(date);
  return isNaN(d.getTime()) 
    ? new Date().toISOString().split("T")[0] 
    : d.toISOString().split("T")[0];
}

function _compareDate(obj1, obj2) {
  return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1;
}

async function getPostMDFilePaths() {
  // 1. 获取目录下所有的 .md 文件
  let paths = await globby(["**.md"], {
    ignore: [
      "node_modules", 
      "README.md", 
      "dist", 
      ".vitepress"
    ],
  });

  // 2. 这里的 ignoreList 填入你不希望出现在“文章列表”里的文件名
  const ignoreList = [
    "index.md", 
    "tags.md", 
    "archives.md", 
    "GroupInfo.md"
  ];

  return paths.filter((item) => {
    // 过滤掉 ignoreList 里的文件
    const fileName = path.basename(item);
    return !ignoreList.includes(fileName);
  });
}

export async function getPostLength() {
  return (await getPostMDFilePaths()).length;
}