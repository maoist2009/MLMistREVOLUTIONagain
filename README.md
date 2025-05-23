---
title: 网站建设指南
tags:
  - SystemFile
  - 作者：maoist2009
sidebar: false
---
# 协作指南

## 序言

网站工作自然不是什么一个人的事情。网站搭建，应该是大工业的，不是手工业的。

## 文章格式问题

### FrontMatter

```yaml
titie: 标题
tags:
  - 作者：作者1
  - 作者：作者2
  - 其他标签1
  - 其他标签2
```

注意`作者`后面是中文冒号`：`。

### Markdown

可参见[MarkdownCheatSheet](./posts/MarkdownCheatSheet.md)

[中文Markdown教程](https://markdown.com.cn/basic-syntax/)（通常认为需要整整**五分钟**才能**学会**）

[一些扩展语法](https://markdown.com.cn/extended-syntax/)，这里基本都支持

这里还支持$\KaTeX$实现的$\LaTeX$公式。[一份比较好的文档](https://www.luogu.com.cn/article/4a81e2tt)

另外，支持MultiMarkdown表格。一份[比较好的文档](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/table-extended/)

### Markdown引用路由

一般图片等放在同目录下，如`mao.svg`，引用`./mao.svg`，markdown为`![mao](./mao.svg)`

注意`public`目录会与根目录合并，路径同。

在`revagain/intro.md`引用`Techo/Emergency/EMAIL.md`，使用`../Techo/Emergency/EMAIL.md`

## 关于协作问题——codeberg上传

codeberg网页登录到，导航到对应文件夹，点击添加文件，上传文件，上次md文件即可。

## 关于协作问题——git指南

那么，程序员是如何协作项目的呢？
一般来说，他们使用git这一工具。

### 概念介绍

git文件架构基本有三个概念

+ 工作区，就是你编辑文件的地方
+ 本地区，就是本地储存项目的地方
+ 仓库区，储存项目，互相协作的地方。这是远程的，实在网站上的。有名的仓库存储网站比如github，codeberg

我们在本地编辑完文件（比方说用记事本？）
先把他储存到本地区，然后再推送到远程区。

### git安装指南

对于安卓系统，你可以安装Termux，以获得linux环境。
首先，下载git，有包管理器的直接`install`即可。
windows可以去[官网](https://git-scm.com/download/win/)下载

### 配置SSH/GPG

要想把自己的工作推送到网站，就需要确认自己的身份，不然反动派也能操作仓库了
我们介绍的办法是SSH
首先，你可能需要ssh，git安装会自带，如果没有，`install openssh`
接下来，你需要生成ssh密钥，这是非对称加密来实现的

```bash
ssh-keygen
```

接下来，你只需要一路enter就行，默认配置。
然后，在你的用户目录下，会出现`.ssh`文件夹。（gnulinux中，这是隐藏的）
里面有两个文件，`id_xxx`和`id_xxx.pub`。其中，`id_xxx.pub`是需要上传到codeberg的。
在这之前，你可能需要更改`id_xxx.pub`，其最后一个空格之后，是你的用户名。你可以自定义他

接下来，复制整个`id_xxx.pub`。

1. 到[这里](https://codeberg.org/user/settings/keys/)
2. 管理SSH密钥，增加密钥
3. 密钥内容，粘贴复制好的`id_xxx.pub`
4. 即可

### 克隆仓库

如果你没有得到我们的信任，可能需要通过Fork+Pull Request的形式发布内容。这里暂且不提及。
请告诉我们你的codeberg账号名称，我们需要添加你为协作者或者让你加入[我们的团队](https://codeberg.org/MLMistREVOLUTIONagain/)，这样你才能让你的贡献生效。

### 贡献指南

#### 克隆仓库到本地

你需要克隆仓库，记得以ssh形式克隆。
比如说，工程部网站源码在这里：`git@codeberg.org:MLMistREVOLUTIONagain/websource.git`
那么

```bash
git clone git@codeberg.org:MLMistREVOLUTIONagain/websource.git
```

#### 修改

修改之前，请

```bash
git pull
```

这句话会同步远程仓库，因为别人可能做了一些修改。
作出你的工作！注意不要做你不知道后果的事情！
会另外出一篇的。

#### 加到本地区

```bash
git add .
# 这句话表示将一切变化了的文件（.gitignore忽略的以外）加入本地暂存区（这个概念不展开，可以自行搜索）
git commit -m "xxxx"
# 这句话可以等所有贡献作为了再动。
# xxx内你对你这次贡献的说明，比如说，"增加了有关git的教学内容"，或者 "add xmpp docs" 之类的
```

#### 推送到远程仓库

```bash
git push
```

如果报错，那么说明文件出现了冲突，也就是你的修改和别人的操作出现了矛盾。这个我们暂且不铺开。你需要避免和别人同时编辑一个文件，尤其是你不是程序员，不知道如何解决冲突的时候。
如果出错，可以尝试

```bash
git pull
```

如果`pull`出错，就说明冲突了。

## 关于部署问题：`mlmistrevolutionagain.codeberg.page`

由于codeberg没有actions，我们只能手动构建。我建议专人定期构建。

### 电脑nodejs安装

你的电脑或手机需要[nodejs](https://nodejs.org/zh-cn/)

对于termux用户，只需`pkg install nodejs`即可

然后安装pnpm：`npm install -g pnpm`

### 准备部署

首先，你需要把原码复制下来，确保工作目录在项目根目录！

```bash
git clone git@codeberg.org:MLMistREVOLUTIONagain/websource.git
pnpm install
```

### 构建

```bash
git pull
pnpm run build
```

### 测试

```bash
pnpm run serve
```

### 部署

```bash
cd .vitepress/dist
git init
git add .
git commit -m "upd"
git remote add origin git@codeberg.org:MLMistREVOLUTIONagain/pages.git
git push -u origin master --force
```

## 关于部署问题：`mlmistrevolutionagain.pages.dev`

将原文件（不是部署的）推送到`https://github.com/maoist2009/MLMistREVOLUTIONagain`

## 关于文章问题，Markdown指南

可以参照这篇[Markdown指南](https://markdown.com.cn/)

我们网站具体支持的语法可以看[MarkdownCheatSheet](./posts/MarkdownCheatSheet)

在每篇文章开头，你需要插入信息，大致这样（`#`后面是注释，实战不用写），这叫FrontMatter

```yaml
title: 文章标题
tags:
  - 标签1
  - 标签2
  - 标签3
sitemap: false
# sitemap决定你的文章是否会被搜索引擎索引到，false表示不会，若没有sitemap选项，默认true
```

### 一些注意事项

FrontMatter的title必须要写！不然构建会出错，

构建常见错误：Dead Link。直译死链，就是无法访问的链接。

外部网站链接一定加https，如`[bing](https://cn.bing.com)`。

站内内容链接确保存在，`/xx/xx`表示绝对路径。`./x/x`表示相对

## 关于建设问题，目录架构

可以看到，我们的源码主要有如下几个文件夹：

+ `public`，存放静态文件的地方，在构建时会被直接放入对应目录。比方说`/public/test/test.svg`，会位于`/test/test.svg`
+ `.vitepress`，存放配置的地方，不会编程的一般不要改动。
+ `post`目录，一个特殊的存放文章的目录，里面的文章会被首页和tags索引到
+ 其他目录，其他放文章的地方，这里的文章不会被索引到，可以按目录结构放一些创作等等。比方说继续革命社的讲义，可以考虑单开一个目录，然后在`post`里面发一篇文章链接到那个目录。

## 写的不是很清楚，抱歉。

## 关于继续革命社文集生成事宜

https://codeberg.org/MLMistREVOLUTIONagain/websource/src/branch/master/revagain

需要安装python3, pandoc,texlive

以termux为例

```bash
pkg install pandoc
pkg install python
pkg install texlive-installer
termux-install-tl --location https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet
```

需要重启termux

clone后

```bash
git clone git@codeberg.org:MLMistREVOLUTIONagain/websource.git
```

运行`process.sh`即可

```bash
sh process.sh
```

xelatex可能会突然停止，最后一行是一个?，输入return即可

加文章，ssh,网页版生成见：

https://codeberg.org/MLMistREVOLUTIONagain/websource/src/branch/master/README.md

桌面端建议使用[MiKTeX](https://miktex.org/download)
