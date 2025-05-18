---
title: 桌面刷机入门
tags:
  - 作者：康平路
---

图片有问题
```md
# 基于linux内核的自由及开源操作系统发行版Arch Linux图形化加密安装

## 原则上在保证硬件能正常满足用户使用要求下尽可能的选自由软件系统，本教程主要使用图形化安装，尽可能采取最隐秘安全的安装方式。

2025.5.5更新说明：

本计划默认你的启动方式为UEFI,近7年以内的主板和电脑基本都是UEFI启动，BIOS启动模式若有需要，再另设章节说明。
本计划默认的安装方法为luks全盘加密安装Arch Linux系的endeavourOS。Arch Linux的命令行安装方式，以及luks,lvm on luks的安装方式将会在之后另设章节说明。

所需工具如下：一台电脑，一个无重要数据的U盘，一块带有128GB空余空间的硬盘（如果是装有windows也可以，空硬盘会更好）

### 系统安装主要步骤：

一、创建U盘启动镜像

二、分区并进行加密，格式化、挂载分区

三、安装系统文件，配置主要文件

四、系统的善后配置

### 一、创建U盘启动镜像

这个U盘不仅要担当系统安装职责，经过合适调整后，也是系统维护的重要工具。我们创建引导U盘有两种思路，一个是U盘内只刻录一个iso，比较有名的有rufus，可以通过图吧工具箱来获取它。一个是通过ventoy的U盘系统引导工具，这个可以放置多个镜像，在引导进ventoy的引导界面后让你自行选择引导到哪个iso里，实现了一个U盘多种引导系统，非常方便。

#### 1.Arch Linux系统镜像

Arch Linux系下使用比较便捷的图形化安装，且对新手较为友好的发行版有endeavourOS。如果走命令行安装，则去Arch Linux官网寻找安装镜像，安装archlinux需要详细翻阅ArchWiki。

对于初学者并不建议直接走命令行安装，如果只是一般的革命使用，endeavourOS的图形化安装已经适用。如果想进一步提升维护系统的能力，也推荐是在endeavourOS环境下熟悉了再进行命令行安装Arch Linux的尝试。

##### 1.1对于endeavourOS

https://endeavouros.com/
往下翻到 Download mirror list 。为保证下载速度，此处选择中国大陆境内的开源镜像站，Asia列下国家(country)为China的有三个选项，分别是吉林大学，上海交通大学（SJTU），清华大学（Tuna）。SJTU目前暂时不可用，吉林大学和清华大学两个任选一个进行下载即可。保存到一个.iso后缀的文件，备用。

##### 1.2对于Arch Linux

https://wiki.archlinuxcn.org/wiki/%E9%A6%96%E9%A1%B5
本网页是archwiki官网。点击1关于发行版--安装指南。下载的超链接在1.1点进去后往下翻到China，推荐选择带.edu的网站，做得好的有ustc.edu.cn（中科大），tuna.tsinghua.edu.cn(清华)，可以选择这两个，下载速度会比较快，点击带日期的.iso文件即可下载，下载所得留作备用。走命令行安装前可以略读完安装指南，以大概了解安装的原理。如果使用图形化安装，也建议阅读archwiki的安装指南。

#### 2.Windows PE 镜像下载与安装

如果你手上暂时没有闲钱来购买多余储存设备，更有可能是Windows与Linux共同占据一个硬盘。这个时候有个winpe，对于维护Windows会更为方便，并且大多数群众都熟悉Windows的图形化界面，使用起来更得心应手。推荐使用微PE。

https://www.wepe.com.cn/

右上角点击下载，之后选择微PE工具箱V2.3，选择先不捐赠，之后点击64位下载（默认你的机型是支持64位）。所得exe可立即执行，打开的窗口的右下角有一个圆盘的图标，把鼠标指针留久一点在其上会显示“保存为iso”，点击保存，所得.iso文件备用。

#### 3. Ventoy U盘引导安装

> [!WARNING]
>
> 如果你要创建镜像集合的U盘里有重要数据，请立即做好备份。

https://www.ventoy.net/cn/download.html

点击上面的链接，选择ventoy-版本号-windows.zip，点击后会弹出GitHub网页，找到绿色的Download Now，之后还会到达一个网页，还是点击-windows.zip，它在5s后会自动下载。所得文件解压后打开Ventoy2Disk.exe，之后在设备里选择你的U盘，就可以直接点击安装了。

之后把前面所下载的.iso文件全部复制进新的U盘的本地磁盘即可。

### 二、进入live系统，分区并进行加密，格式化、挂载分区

一般而言，如果插入了一个带着新引导的U盘，电脑重启后会自动引导到新系统里，如果没有自动改变引导，那就得进入UEFI（BIOS）界面，更改相关设置了。
搜索你的主板或笔记本对应的进入EFI（BIOS）的界面的快捷键，通常是在电脑开机显示电脑品牌图标的时候按下某个热键（F1-F12），可以在b站搜索相关视频或百度。

任务一、关闭安全启动，如果不关闭，将无法引导进Linux系统。
进入UEFI后，可能要进入高级模式的启动（boot）页来寻找secure boot（或称安全启动）。除非找到SecureBoot 一项并将其disable，否则都建议不保存退出（一般是按F10），这样误操作就能抵消。

{ windows10和11在桌面环境下进入UEFI的设置
进入设置，更新与安全，恢复，点击高级启动的立即重新启动，等待win10进入下一步页面。
windows11是设置-系统-恢复-高级启动-恢复选项里的高级启动，点击立即重新启动，选择立即重启，之后会黑屏，可能会提示请稍候，等待系统重启进入下一步页面
接下来的情况win10和11都一样
步骤：疑难解答-高级选项-UEFI固件设置-立即重启。即可重启到
（如果在笔记本的BIOS没有找到安全启动这一项，也没有高级页面，则可以通过这种方式来寻找。）} 

任务二、改变引导项
将主板启动项的第一顺位改成EFI（USBpartition2）。然后保存退出，大概率就能进入ventoy界面。

1.如果你有一个全新的硬盘，你要向全新的硬盘里安装系统，那你完全可以在ventoy的界面里选择进入endeavourOS.如果你想在含有系统盘里的windows里安装新系统，则需要先进入winPE,使用里面的diskgenius（磁盘精灵）。选择你的带有128GB空余空间的数据盘（至少要64GB），然后修改分区大小，将其分区后空间划出空余空间（不需要格式化文件系统为ntfs），点击开始，等待进度条走完。之后如果磁盘分区表显示有你指定空间的大小剩余出来，就可以了。重启进入endeavourOS.这一步请慎重考虑和操作。

2.在ventoy中选择endeavourOS，进入live系统，如果你的电脑是带有NVIDIA的独立显卡，则需要在启动项里选择带NVIDIA的选项，笔记本可以开着独显直连来打开这个启动项。进入过程中会有代码跳动，若你在过程中看到 Welcome to endeavourOS一行，大概率已经进入系统。稍等片刻后即可进入图形化界面。
3.连接互联网。如果你的网卡是有开源驱动，大概率是直接拿来就能用的。如果是接入有线网络，那么是即插即用的。如果要登陆校园网，你可以在左下角找到firefox浏览器来登陆校园网。如果是接入无线网络，右下角有对应的图标来连接无线网络，方式和windows差不多。
4.系统弹出的安装界面中，选择左下角change language,并在接下来的页面中划到最下面，选择“中文-中国”，点击OK。之后界面会消失一会，会再弹出中文界面。![Screenshot_20250405_202807](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_202807.png)

![Screenshot_20250405_202848](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_202848.png)

![Screenshot_20250405_200628](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_200628.png)

5.点击“打开安装程序”。因为你接入了互联网，因此点击“online”。如果接下来弹出的界面的”文A“一行出现了“简体中文”，直接点击next,不然就调整为简体中文七.多系统引导/本地系统引导修复，linux启动伪装隐藏

多系统引导工具可以让用户在开机时通过快捷键选择进入不同系统（避开系统选择界面提示），设置一个为默认系统，隐藏linux发行部bios启动项，修改efi启动分区文件，达到隐藏伪装和快速切换linux系统的目的。这样别人在拿到用户的设备时启动只会看到windows系统。
 [参考此教程：](https://codeberg.org/p23tyjujukk/gnulinux-install/src/branch/main/多系统引导.md)。如果选择了简体中文，时区将会默认是中国上海。点击next.之后是键盘布局，选中chinese和default即可。

![Screenshot_20250405_204440](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204440.png)

![Screenshot_20250405_204509](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204509.png)

![Screenshot_20250405_204555](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204555.png)

![Screenshot_20250405_204618](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204618.png)

6.之后选择桌面环境。这里只介绍Plasma KDE,GNOME,和Xfce4.如果你的内存大于4GiB,那推荐你直接使用Plasma KDE,其功能多样，逻辑跟windows相近，桌面环境占用在4G内存情况下刚刚好。GNOME之前用过一段时间，与windows逻辑不同，功能也比较强大。xfce的桌面环境非常简单，适合内存小于4GiB的用户来使用。 ![Screenshot_20250405_204639](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204639.png)

7.之后选择软件包，像我这样选择软件即可。![Screenshot_20250405_204700](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204700.png)

8.接下来选择引导程序，选择grub-bootloader.![Screenshot_20250405_204722](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_204722.png)
9.之后就进行分区了，请选择manual partition（手动分区)。
接下来得讨论几个情况

> [!WARNING]
>
> 在此步骤请慎重考虑和操作，否则可能会丢失重要数据。

（1）空硬盘的情况  
如果你是在一个空硬盘（没有其他任何系统和任何重要数据）上全新安装一个endeavourOS，那顾虑并没有那么多了，直接分区就好。如果你的硬盘比较大（512GiB），那完全可以不使用完硬盘。必要的分区有 root分区和boot分区，boot分区留足1GiB完全够用，而root分区如果硬盘空间大，不需要额外放大文件的，有256GiB空间就非常足够了，也可以全部占满，但是以后有些调整会很受限制。
（2）有数据盘的情况下 ，推荐走1,将数据盘分出来一些空余空间后安装双系统。对于grub引导双系统的问题，进入新系统后再进行操作。

分区示例

![21](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/21.png)


点击create创建分区

boot分区，size（大小1GB），filesystem（文件系统）fat32,mount point（挂载点）/boot/efi,FS Label（文件系统标签）随便写个都好，我写了boot.flags选择boot

![Screenshot_20250416_150841](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/Screenshot_20250416_150841.png)

swap分区，如果你的内存有16GiB以上，那就无需设立了，这个是让你不爆内存，以及使用休眠功能用的。休眠功能就是，你可以启动休眠，然后将你内存里面的内容全部搬去硬盘，然后一段长时间回来后仍然可以启动电脑后和你的工作内容一模一样。encrypt的密码，建议是设立16位以上，大小写和阿拉伯数字以及特殊符号并用的密码，这样几乎不能破解，这个密码是在过了引导，启动系统的时候用的。

![5](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/5.png)

root分区，密码建议与之前的swap一样，mountpoint就一个“/”就好，代表根分区的意思。

![3](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/3.png)


分区结果类似如下。如果你已经有windows的硬盘，那很可能会有多4个分区及以上。

![6](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/6.png)

点击next进入下一步。name和login随便取，nameofcomputer是互联网上的名字。password是个人账户的密码。![Screenshot_20250416_150914](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/Screenshot_20250416_150914.png)

得到的分区结果会再次进行最后展示，如果没有问题，点击install后将会立刻进行安装，请最后确认你的操作没有任何问题。![7](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshots/7.png)

安装界面![Screenshot_20250405_205303](/home/LOGE/Desktop/Arch Linux安装教程/envendourOS/Screenshot_20250405_205303.png)

等待安装结束之后即可立即进入新系统。大概要等个20分钟到1个小时，看硬件是否先进，以及看网速。

拔掉U盘后会自动重启进入系统。在启动系统的过程中，他会要求你输入密码以打开系统，输入正确后将继续跳动代码，然后启动窗口化界面，之后键入用户密码来进入桌面界面。
三、后续系统的配置
按下ctrl+alt+T进入terminal界面（终端），这个界面你将会经常用到。
1.包管理器的配置
输入nano /etc/pacman.conf回车，通过编辑软件进入pacman.conf的文件编辑，下翻找到[multilib]对应的两行，去掉对应的# 并在下方回车另起两行，输入

```
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinux/$arch
```

这个是为了获得archlinuxcn和multilib（32位）的软件包库，来获取民间一些好用的软件包。

![image-20250505110517384](/home/LOGE/.config/Typora/typora-user-images/image-20250505110517384.png)

按下Ctrl+x，点击Y，再回车即可保存文件。
之后在命令行输入sudo pacman -Syu进行全面软件更新，会要求你输入密码，一路回车即可
另安装archlinuxcn密钥环

```
sudo pacman -S archlinuxcn-keyring
```

2.Arch Linux系软件包管理器
pacman
一般你就用它来安装和卸载linux系统的软件了，如果官方仓库和archlinuxcn仓库要是有这个你想安装的包，用一下格式输入命令并回车，等待一会即可安装

```
sudo pacman -S 软件包名称
```

可以一次性安装多个软件包，再后面用空格隔开即可，但是要注意软件名称不能有错，否则会直接中止安装，不会下载任何软件包文件。
这里就推荐几个包，安装完成后配置一些东西就可以立即上手使用了。

yay或和paru  （archlinux user group软件库安装组件，有些archlinuxcn的包可能得用这个来安装）gajim    (就是xmpp了)
clash-verge  （翻墙软件，需要archlinuxcn库，也可以安装v2rayn(yay),mihomo-party(yay,软件包安装安装后名称是verge-mihomo)）
fcitx5-im fcitx5-chinese-addons fcitx5-gtk fcitx5-lua fcitx5-qt  （Fcitx5输入法和他的中文配套，一共5个包）
veracrypt  （图形化文件加密软件）
libreoffice  （类似于windows的office）
timeshift  （系统镜像备份，如果系统出现故障，即可使用这个工具回到原来的时间点）
keepassxc   （本地化密码储存）
vim   （比较难用又好用且受程序员欢迎的编辑器）
okular （很好用的pdf阅读器）
typora （markdown格式的文件编辑）
dolphin  （endeavourOS大概率预装，是相当于“我的电脑”的图形化文件浏览器）
impression （U盘刻录软件）
vlc   （本地播放器，并没有下载音乐的功能，想要下载音乐可以去lxmusic.toside.cn来找软件包下载）
neofetch  系统信息概要显示
gthumb 图片阅读（其实不大好用）
motrix(yay)
impression USB镜像刻录

示例命令使用

```
sudo pacman -S gajim timeshift keepassxc yay neofetch
```

卸载

```
sudo pacman -R <package>
```

-R就是remove的意思。如果要卸载未被其他包依赖的依赖项，则使用 -Rs。如果要卸载并移除配置文件，使用-Rns。

3.翻墙软件clash-verge的启动方法
安装好clash-verge后，大概率需要改一下超级用户文件。

```
sudo nano /etc/sudoers
```

翻到最下方，找到##same thing without a password 一行，去掉下面一行的#，表示取消注释。

![image-20250505114233979](/home/LOGE/.config/Typora/typora-user-images/image-20250505114233979.png)

之后按上文一样保存退出。

之后点击开始菜单，搜索clash，找到并打开clash-verge，点击左边的设置，再点击服务模式的安装，提示输入root密码，直接不用输入确认就好，提示成功安装服务后再点击启用，在打开上面和下面的tun模式和系统代理，如图所示

![image-20250505114601368](/home/LOGE/.config/Typora/typora-user-images/image-20250505114601368.png)

之后点击左边的订阅，在订阅文件链接里最好是手动输入你的链接（这个就靠你自己找了），之后回车，等待服务器确认订阅。若弹出界面类似于
![image-20250505114802283](/home/LOGE/.config/Typora/typora-user-images/image-20250505114802283.png)

就可以了，点击代理，就能找到代理的界面。

4.keepassxc密码储存器

点击新建数据库，点击继续，新建你的数据库密码，之后点击完成，选择密码文件储存点即可新建数据库。
点击+号新建数据条目，填入必要信息。在输入密码的时候，点击框框右边的一个骰子图标即可自动生成密码。建议要安全可以生成30位以上带大小写阿拉伯数字和特殊符号的密码。

5.timeshift系统备份，按照引导配置好，等待进度条走完，之后点击创建镜像即可。如果经常使用，建议每天备份一次，以及第一次，这个备份只是第一次会占用一些空间。如果要恢复镜像，支持在软件界面恢复，也可以在archiso里恢复。
恢复的命令如下
列出镜像列表

```
timeshift --list 
```

回到你想回的镜像 

```
timeshift --restore --snapshot <snapshot_name>
```

6.中文输入法

编辑文档
/etc/environment
在文档内加入以下内容：
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
SDL_IM_MODULE=fcitx
GLFW_IM_MODULE=ibus

在nano里复制粘贴即可

之后设置 进入键盘 --虚拟键盘  启用Fcitx（如果是kde桌面，需要点击Fcitx5-Wayland）

在设置-侧栏语言与时间-输入法 里点击添加输入法，选择中州韵，点击应用后把中州韵拉在输入法开启的最前面。

![image-20250505115859533](/home/LOGE/.config/Typora/typora-user-images/image-20250505115859533.png)

再点击右下角应用。之后可能会有中州韵的弹窗，等待一会就会提示配置完成。linux默认的更换输入法的快捷键是ctrl+空格。如果没问题了就能直接输入中文了。

7.torbrowser

```
yay -S tor-browser-bin
```

```
paru tor-browser-bin
```

一路回车即可，之后从开始菜单搜索torbrowser来启动。

8.系统基本维护
分区展示

```
lsblk
```

系统信息

```
neofetch
```

系统更新
arch为滚动更新以保持系统和软件最新，修复最新漏洞，简单来说就是没有win10和win11的版本之分，不像win10更新到win11需要完整安装，  不像debian10更新到debian11得先更换debian11的软件源。arch系统建议一两个月内至少执行一次更新指令，长期不更新，执行更新时系统可能会故障，终端输入  yay -Syyu   以全面更新系统。
 特别注意：更新过程中，软件下载完毕执行安装时，笔记本电脑确保电池电量够用，不要退出或者关机，避免内核更新或者内核模块更新意外终止导致内核故障，重启开机后系统无法进入图形界面。

```
paru
```

 等于

```
sudo pacman -Syyu
```

### 三、arch系统使用注意事项/故障排除

1. 安装失败，或者安装完成后无法启动进入桌面怎么办？
    这种情况多为系统和硬件不兼容导致的， 要么重新安装，重新安装不行就要考虑更换系统或者回退到原windows,。  u盘启动，选择archlinux或分支的的live-cd进入桌面环境，打开浏览器，搜索下载windows原版ios镜像或者推荐的其他linux发行版    ，下载完成后把镜像移动到u盘内，重启u盘引导进该安装镜像入执行安装    。 
    如果第一次安装进入 live-cd的桌面都失败的话，必须更换其他系统。
    如果是进行的多系统安装，linux安装故障，可以进入bios,在启动顺序将原windows启动移动到linux系统之上  f10保存重启进入windows,       如果误操作格式化了efi引导分区，u盘启动winpe，使用里面的引导修复工具执行windows引导修复  。
2. arch为滚动更新以保持系统和软件最新，修复最新漏洞，简单来说就是没有win10和win11的版本之分，不像win10更新到win11需要完整安装，  不像debian10更新到debian11得先更换debian11的软件源。arch系统建议一两个月内至少执行一次更新指令，长期不更新，执行更新时系统可能会故障，终端输入  yay -Syyu   以全面更新系统。
    特别注意：更新过程中，软件下载完毕执行安装时，笔记本电脑确保电池电量够用，不要退出或者关机，避免内核更新或者内核模块更新意外终止导致内核故障，重启开机后系统无法进入图形界面。
    2.可以使用timeshift软件对系统进行快照备份，记住备份目录，故障后u盘启动archlinux图形化安装分支安装镜像 进入live  cd桌面环境，安装timeshift  （sudo pacman -Sy timeshift）后启动此软件执行还原，避免数据丢失或者系统故障。
3. 万一系统故障又没有快照备份，这时可能要重装系统，在u盘启动archlinux图形化安装分支的live  cd图形化预安装环境导出原系统中的重要用户文件，推荐终端输入 sudo pacman -Sy  nautilus安装gnome桌面的文管理器（此软件可以打开带有不可访问权限的文件夹可以输入密码进入），然后终端输入  nautilus打开此软件,进入系统分区-home-用户文件夹，复制之前的重要文件到u盘或者其他分区。如果系统分区是有加密的，终端输入 sudo pacman -Sy gnome-disk  安装gnome桌面的分区管理器并打开，加载加密分区执行解密后点击此软件解密后分区图标内的播放按钮完成挂载，然后使用nautilus访问文件
4. 如果驱动不兼容比如显卡不兼容，显示管理器异常等导致开机加载内核后黑屏无法进入桌面，按按住快捷键 ctrl+alt+F2进入终端，执行卸载更换不兼容驱动或不兼容的显示管理器，安装兼容的驱动   或者新建用户   。具体操作可以浏览器搜索教程
    举例1：
    比如显示管理器gdm不兼容，更换为sddm显示管理器
    sudo systemctl disable gdm   （禁止gdm开机启动）
    sudo pacman -Sy sddm   （安装sddm显示管理器器）
    sudo systemctl enable sddm     （设置sddm开机启动）
    完成后输入 reboot
    重启电脑
    举例2.用户 配置文件问题导致桌面无法启动 考虑更换/安装桌面或者添加新用户使用新用户登陆系统 a.安装cinnamon桌面
    sudo pacman -Sy cinnamon
    安装完成后重启，登陆界面显示管理器界面设置勾选cinnamon输入用户密码启动
    b.添加新用户参考后文教程五内的gnulinux常用shell命令

举例3.手动安装了闭源英伟达显卡不兼容导致无法开机
 一般情况下默认安装提供的驱动是可用的，但是手动更换了显卡驱动后重启就可能出现故障导致无法进入桌面，这时需要使用上面提到的快捷键进入这卸载闭源显卡，更换为开源显卡驱动，教程参考9命令行界面，卸载手动安装的显驱动卡，更换为推荐的显卡驱动，教程参考[官方wiki教程 ](https://wiki.archlinuxcn.org/wiki/NVIDIA?rdfrom=https%3A%2F%2Fwiki.archlinux.org%2Findex.php%3Ftitle%3DNVIDIA_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)%26redirect%3Dno)    ,注意看教程里面表格提供的什么类型的显卡用什么类型的不同驱动，类型内核使用的驱动可能不太一样， 一般有普通内核，带tls标志长期内核，带zen标志的游戏内核内核  。查看内核指令：
 uname -srm

其他异常解决：

0. 软件源故障或者密钥故障导致无法安装软件更和更新系统 解决方法：更换软件源，比如清华大学源更换为ustc或者阿里云源

更换软件源后输入 yay -Syyu刷新系统

密钥过期常见于很久一段时间不更新系统，这时就更新密钥，终端输入指令
 sudo pacman -Sy archlinux-keyring
 以更新密钥

手动添加的第三方仓库源故障，比如添加的chaotic aur源故障，禁用手动添加的源，终端输入   sudo nano /etc/pacman.conf  ，找到chaotic aur,  删除之前添加的 [chaotic aur]和下面的源 两行 [chaotic-aur]
 Include = /etc/pacman.d/chaotic-mirrorlist
 保存退出
 然后 yay -Syyu 更新系统

添加的archlinux cn源故障可以更换到其他开源镜像站比如ustc源，参考下面教程

https://mirrors.ustc.edu.cn/help/archlinuxcn.html
 说明：需要先删除之前添加的清华源
 终端输入
 sudo nano /etc/pacman.conf 找到
 [archlinuxcn] Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch 删除这两行
 然后根据上面教程添加ustc源

1. 安装蓝牙（如果预装的系统无法启用蓝牙，或者无法使用蓝牙音频，参考此）
    https://wiki.archlinux.org/title/Bluetooth
    [`120253969`](https://blog.csdn.net/weixin_44268185/article/details/120253969)
    安装必要软件包

   ```
   sudo pacman -S bluez bluez-utils pulseaudio-bluetooth pavucontrol pulseaudio-alsa
   ```

    安装蓝牙图形管理

   ```
   yay bluetoothctl
    yay overskride
   ```

    安装蓝牙音频

   ```
    yay pulseaudio-bluetooth
   ```

    启动蓝牙服务

   ```
   systemctl enable bluetooth
   systemctl start bluetooth
   ```

   启动pulseaudio服务（如果音频异常参考此）

```
pulseaudio -k
```

 确保没有pulseaudio启动

```
 pulseaudio --start
```

 启动pulseaudio服务

1. 安装显卡驱动  （如果预装系统无显卡驱动参考此）
    安装完善xorg显示协议（xfce桌面环境必装）

   ```
   sudo pacman --needed xorg
   ```

    [安闭英伟达源装显卡驱动第三方教程1](https://arch.icekylin.online/guide/rookie/graphic-driver)  , [inter显卡驱动官方教程2](https://wiki.archlinux.org/title/Intel_graphics) --还可以参考arch wiki

[安装英伟达驱动教程官网教程（包含开源和闭源）](https://wiki.archlinuxcn.org/wiki/NVIDIA?rdfrom=https%3A%2F%2Fwiki.archlinux.org%2Findex.php%3Ftitle%3DNVIDIA_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)%26redirect%3Dno)

1. 无线网卡驱动异常 （wifi无法启用参考此处）
    插入网线，根据品牌型号网上搜索找到无线网卡型号，如找不到就进入多系统的windows系统，安装鲁大师，查看电脑硬件 找到无线网卡型号
    进入archlinux终端，输入
    yay 无线网卡型号（或者品牌英文）  进行检索，安装对应的驱动重启即可
    如果yay 指令找不到驱动，浏览器bing/google/duckduckgo搜索引擎搜索
    品牌型号 linux驱动 github
    在github找到驱动,根据提供的说明进行安装

### 四、多系统引导/本地系统引导修复，linux启动伪装隐藏

多系统引导工具可以让用户在开机时通过快捷键选择进入不同系统（避开系统选择界面提示），设置一个为默认系统，隐藏linux发行部bios启动项，修改efi启动分区文件，达到隐藏伪装和快速切换linux系统的目的。这样别人在拿到用户的设备时启动只会看到windows系统。
 [参考此教程：](https://codeberg.org/p23tyjujukk/gnulinux-install/src/branch/main/多系统引导.md)
 ```