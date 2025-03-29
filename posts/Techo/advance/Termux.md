---
title: Termux入门
tags:
  - 安卓
  - 技术进阶
  - 作者：maoist2009
---

# Termux入门

我们知道Android有一个Linux内核，所以大概也可以有一个类似linux的环境。

于是就有了Termux。

下载可到Fdroid下载。

## 一些准备工作

## 换源

官方源有点慢，所以建议换国内大学源。

```bash
termux-change-repo
```

按上下调整，空格选中，回车确认

### 暴露给外部储存空间

```bash
termux-setup-storage
```

确认即可。

接下来你可以到系统文件图形化界面操作termux文件

如用质感文件等（推荐，fdroid可下），添加储存空间，外部储存空间，跳到系统文件后左上角三，选中Termux，使用次文件夹即可。

这个文件夹就是linux的用户目录。比如`git`的`.ssh`文件就放在这里

## 碎碎念

Termux的复制很奇怪，复制是长按，copy，但是黏贴用输入法的黏贴功能是不行的，要Paste，但是奇怪的是剪贴板（至少小企鹅和搜狗是这样的）是可以用的。

termux从屏幕左边缘中间滑，会有一个`Session`管理器，可以多开终端。

如果不想被杀后台，可以，

```bash
termux-wake-lock
```

或者安装Termux: Flouat悬浮挂死前台（记得开悬浮窗权限（又名显示在其他应用上层））

## 包管理器

termux包命令是`pkg`

如

```bash
pkg install python git openssl nodejs-lts vim
```

更新采用

````bash
pkg update
pkg upgrade
````

两个命令先后执行，其实有区别，可以单用，不铺开。

## 和GUI结合

一些编辑工作，拿termux肯定是不行的，但是别忘了这是Android系统。你只需要在质感文件中打开文件就行。

比方说Markdown编辑器，推荐Marker，fdroid可下。

再比如office，推荐OnlyOffice。
