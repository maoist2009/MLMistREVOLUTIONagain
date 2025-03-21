---
tags:
  - 作者：maoist2009
  - 网络
  - 技术入门
---
# 网络安全入门

本文适用于急需网络安全保护自己的同志。力求简介快速，对原因原理的解释难以详尽。

> 事实上，本手册并不是《网络安全进阶》的铺垫，相反，本文是于其之后写的。

## 简论

互联网访问就像送信。送信有三者参与：你（客户端），对面（服务端），邮差（中间人）。信封是无法被除了对面以外的人打开的。但是信封上写了发件人地址（你的IP地址），收件人地址（对面的IP地址），收件人名称（网站名）等。

中修的国家机器控制了邮差。所以邮差会根据收件人地址和收件人名称丢弃信件，实现封锁。为了解决这一问题。我们把一封信连着信封塞到另一封信里，发给代理（代理服务器）。

单纯把一封信塞到另一封里特征过于明显，可能被中修发现并封锁。所以有一些技术手段来避免中修发现

最终结果是：

> 中修啥也不知道。
> 代理服务器知道你访问的网站和你的ip。
> 网站知道你访问的内容，发的信息，但不知道你的ip。

还有一些技术手段减少泄漏的信息，但是这里不多讲。

## 祸从口出

我们知道墙内是实名的，你说啥警察都知道你是谁住在哪里。因此不要和墙内身份关联。

首先，username（用户名）不要和墙内有任何管理，随便挑一个正面的英文单词，或者中文词组转拼音。如Advance，或者jinhou。个人建议避免中文用户名。

然后，不要讲自己的墙内身份。如果有人问你哪来的，最多告诉他平台，如qq来的，b站来的。对同志的信任需要时间。

还有，不要截取墙内平台的图片，或者转发墙内平台的言论。

最后，密码不要太弱，比如123456。至少大小写字母加数字。如GEPH1893xjp

嘴巴关严实了，信写得没漏洞了，我们来确保网络不泄漏，送信安全。

接下来我们就需要搞一个代理了。

## 适用于Android的推荐代理软件

### 迷雾通

以下链接一个一个尝试下载：

+ https://github.yongyong.online/https://github.com/maoist2009/AndroifFrag/releases/download/0.-1/geph-android.apk
+ https://ghfast.top/https://github.com/maoist2009/AndroifFrag/releases/download/0.-1/geph-android.apk
+ https://gh-proxy.net/https://github.com/maoist2009/AndroifFrag/releases/download/0.-1/geph-android.apk
+ https://wget.la/https://github.com/maoist2009/AndroifFrag/releases/download/0.-1/geph-android.apk
+ https://github.boki.moe/https://github.com/maoist2009/AndroifFrag/releases/download/0.-1/geph-android.apk
+ https://gh.ddlc.top/https://github.com/maoist2009/AndroifFrag/releases/download/0.-1/geph-android.apk

下载慢正常，等就行

注意！！迷雾通和一些xmpp服务器不兼容！若使用迷雾通翻墙，注册时建议使用`conversations.im`服务器注册。

中文界面，比较好操作。

注册新账户，人机验证码先要点注册才会显示。

注册成功之后登陆，就可以连接了。

### proton VPN

同上：

+ https://gh.ddlc.top/https://github.com/ProtonVPN/android-app/releases/download/5.9.59.0/ProtonVPN-5.9.59.0.605095900.-production-vanilla-direct-release.apk
+ https://ghproxy.1888866.xyz/https://github.com/ProtonVPN/android-app/releases/download/5.9.59.0/ProtonVPN-5.9.59.0.605095900.-production-vanilla-direct-release.apk
+ https://github.moeyy.xyz/https://github.com/ProtonVPN/android-app/releases/download/5.9.59.0/ProtonVPN-5.9.59.0.605095900.-production-vanilla-direct-release.apk
+ https://ghproxy.net/https://github.com/ProtonVPN/android-app/releases/download/5.9.59.0/ProtonVPN-5.9.59.0.605095900.-production-vanilla-direct-release.apk
+ https://github.com/ProtonVPN/android-app/releases/download/5.9.59.0/ProtonVPN-5.9.59.0.605095900.-production-vanilla-direct-release.apk

之后

1. 点create an accout（创建账户）
2. Get a new encrypted email accout（获取proton账户）你也可以用你自己的邮箱，但没有专业知识不推荐，中国人用的大部分邮箱并不安全，而且proton mail一定意义上其实是后续必要的。
3. 填写username，domain为proton.me
4. 设置密码，上下输入一样的，确认没有打错
5. 让你输入recovery method（重置办法）,点skip
6. human verifaction（人机验证），直接完成拼图即可。
7. 等一会儿
8. Get started（开始）
9. Not now（现在不购买plus）
10. 然后底下操作栏settings，protocol选Stealth.
11. 回到主界面connect即可连接
