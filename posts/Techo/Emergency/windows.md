---
title: Windows系统紧急安全指南
tags:
  - 作者：maoist2009
---
# Windows系统紧急安全指南

## 卸载杀毒软件等可替代或不必要的中修软件

中修软件可能记录你的活动上报晶哥

如：

+ 杀毒软件
+ 解压工具
+ 看图工具

具体步骤：

+ 按Win键，搜索控制面板
+ 程序，程序与功能（有时候直接是程序与功能）
+ 找到对应程序，卸载

## 使用安全的解压软件

解压软件，下载[7zip](https://www.7-zip.org/a/7z2409-x64.exe)即可

办公软件如果是Microsoft Office，暂不用替换

如果是WPS，在打开革命文件时建议替换为[OnlyOffice](https://download.onlyoffice.com/install/desktop/editors/windows/distrib/onlyoffice/DesktopEditors_x64.msi)。

> 若没有电脑管理员权限，你可以暂缓安装（有办法，但麻烦）
> 请使用

## 处理无法替代中修软件开机自启动

+ Win（windows标志） R 输入 `msconfig`，回车（Enter），找到启动（Start up）去除对应软件取消勾选
+ 或者 Ctrl Shift Esc 进入任务管理器 点击启动取消勾选

注意尽可能不要让革命软件和中修软件同时运行，可在任务管理器中杀死进程来强制结束运行。

## 使用安全浏览器

可以临时使用我编写的[TlsFragment Windows](./Network#windows%E7%B4%A7%E6%80%A5%E7%94%A8%E4%BB%A3%E7%90%86%E8%BD%AF%E4%BB%B6)。（使用microsoft edge webview 2，但会屏蔽监控域名）

也可以使用[Chrome](https://google.cn/chrome/)，墙内可访问

以及推荐，[Ungooled Chromium](https://github.com/ungoogled-software/ungoogled-chromium-windows/releases)，[Superium](https://github.com/win32ss/supermium/releases) （win 7运行高版本chromium），[Tor browser](https://www.torproject.org)，但需要翻墙或者使用TlsFragment。

> Chromium是一个开源浏览器内核，基本所有除Firefox和Tor（基于Firefox）的浏览器都是基于Chromium的，最初由Google开源

> **为什么不用Edge**
> Microsoft和中修疑似有点近，不排除直接给中修上传浏览记录，同理不建议用Outlook邮箱。

> Github Release（发行版）界面点开Assets（附件），一般都能找到文件。