# Github 备份到 Gitee 的3种方式

大家好，我是秋风，最近很多开源项目让一个本该纯粹的地方混入了政治色彩。例如 Node 还有 React 这些超明星级的项目。

![](https://s3.qiufeng.blue/blog/gitee-image.png?imageView2/0/q/75 "")

![](https://s3.qiufeng.blue/blog/gitee-image_1.png?imageView2/0/q/75 "")

目前来看 React 的issues 已经沦陷了，大家都在反对一个原本纯粹的地方为什么会有了政治？

![](https://s3.qiufeng.blue/blog/gitee-image_2.png?imageView2/0/q/75 "")

如果说开源项目涉及了政治，那么github 还会远吗，我不得而知。为了避免造成不必要的损失，因此连夜把自己github 上的项目都同步一份到了 gitee，并且写下了这一份指南。

![](https://s3.qiufeng.blue/blog/gitee-image_3.png?imageView2/0/q/75 "")

因此我也建议大家未雨绸缪，对自己的github账户进行备份，不管一切，不能让我们本应该有的权益受到损失。

同步主要分为**现有仓库同步**以及**未来代码同步**两个部分。

## 现有仓库同步

这一步其实 gitee 官网已经集成了一键导入的功能。

详情：[https://gitee.com/help/articles/4284](https://gitee.com/help/articles/4284) 

一共分为3个步骤：

1.从 + 号找到 从 Github/Gitlab导入仓库

![](https://s3.qiufeng.blue/blog/gitee-image_4.png?imageView2/0/q/75 "")

2.授权 gitee github 权限

![](https://s3.qiufeng.blue/blog/gitee-image_5.png?imageView2/0/q/75 "")

3.授权后可以看到这样一个 tab 页面选项，我们选择 导入当前页面所有仓库

![](https://s3.qiufeng.blue/blog/gitee-image_6.png?imageView2/0/q/75 "")

gitee 就会自动帮我们导入在 github 的项目，等待一些时间就好。

![](image/gitee-image_7.png "")

导入完成之后，所有的项目都是私有权限，因此也不用担心自己原本在 gihtub 上的私有仓库权限泄漏。

![](https://s3.qiufeng.blue/blog/gitee-image_8.png?imageView2/0/q/75 "")

## 未来代码的同步

虽然我们已经把现有的仓库全部同步到了gitee ，但是我们本地仓库的源还是 github 的，因此还需要对这部分未来增量代码做处理。

### 方案一：增加 remote 源

这个方案其实很简单，很多同学在提交开源项目，想要合入开源项目最新代码的时候肯定用到过。

`git remote add <name> <url>` 

一共分为 2个步骤：

1.在你原来的 github 仓库下添加远端仓库

例如：`git remote add gitee ``[git@github.com](mailto:git@github.com)``:hua1995116/mmt.git`

添加后可以看到这样的：

![](https://s3.qiufeng.blue/blog/gitee-image_9.png?imageView2/0/q/75 "")

2.提交当前的增量代码

```纯文本
git push origin   // 提交到 github
git push gitee    // 提交到 gitee
```


而这种方式有一个缺点就是每次需要提交两次。



### 方案二：增加 push 源

1.删除方法一的 gitee 源 (还没有操作方案一的忽略这个步骤)

```纯文本
git remote rm gitee
```


2.添加 push 源

```纯文本
git remote set-url --add origin git@github.com:hua1995116/mmt.git
```


3.提交代码

```纯文本
git push origin
```




为了省去第二步繁琐，我配置了一个脚本能够快速添加。（**前提是你的gihtub 账户名字和 gitee 的账户名字是一样的**）

```纯文本
npm i -g mmt
mmt import https://gitee.com/hua1995116/mmt-practices/raw/master/mmt-export-gitee.json
// 进入到你想要添加命令的目录
mmt run gitee // 每个原有 github 仓库无脑运行这个命令就可以
```


效果：

![](https://s3.qiufeng.blue/blog/gitee-image_10.png?imageView2/0/q/75 "")



### 方案三: 使用github action

此方案一共两个步骤

1.在仓库根目录创建 .github/workflows 目录

2.创建 gitee-sync.yml 

```纯文本
# 通过 Github actions， 在 Github 仓库的每一次 commit 后自动同步到 Gitee 上
name: gitee-sync
on:
  push:
    branches:
      - master
jobs:
  repo-sync:
    env:
      dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
      dst_token: ${{ secrets.GITEE_TOKEN }}
      gitee_user: ${{ secrets.GITEE_USER }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: sync github -> gitee
        uses: Yikun/hub-mirror-action@master
        if: env.dst_key && env.dst_token && env.gitee_user
        with:
          # 必选，需要同步的 Github 用户（源）
          src: 'github/${{ github.repository_owner }}'
          # 必选，需要同步到的 Gitee 用户（目的）
          dst: 'gitee/${{ secrets.GITEE_USER }}'
          # 必选，Gitee公钥对应的私钥，https://gitee.com/profile/sshkeys
          dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
          # 必选，Gitee对应的用于创建仓库的token，https://gitee.com/profile/personal_access_tokens
          dst_token:  ${{ secrets.GITEE_TOKEN }}
          # 如果是组织，指定组织即可，默认为用户 user
          # account_type: org
          # 直接取当前项目的仓库名
          static_list: ${{ github.event.repository.name }}
          # 还有黑、白名单，静态名单机制，可以用于更新某些指定库
          # static_list: 'repo_name,repo_name2'
          # black_list: 'repo_name,repo_name2'
          # white_list: 'repo_name,repo_name2'
```


3.在 Github 需要同步的仓库上添加 3 个 secrets: (Setting -> Secrets -> New repository secret)

- GITEE_USER, 例如我的 gitee `hua1995116`
- `GITEE_PRIVATE_KEY`，获取方法(如果已有，直接设置) - [Gitee公钥对应的私钥](https://gitee.com/profile/sshkeys)
	- 新建 private key 方法：
	- [生成 SSH 公钥](https://gitee.com/help/articles/4181#article-header0)
	- [将 SSH 公钥添加到 Gitee 公钥](https://gitee.com/profile/sshkeys)
	- 同时将公钥添加到 Github 项目的 secrets 中;
- `GITEE_TOKEN`，获取方法 - [Gitee对应的用于创建仓库的token](https://gitee.com/profile/personal_access_tokens)
	新建 token 方法：
	- 点击上面的链接并登录 Gitee, 点击“生成新令牌”，
	- 添加描述，比如用处 - Github 仓库同步到 Gitee；
	- 权限默认全选，点击提交，显示出生成的 token 值；（注意保存，需要填到 Github 的 secrets 中）



最后后续所有提交，可以利用 github action 自动同步。

| |方案一|方案二|方案三|
|---|---|---|---|
|优点|1.配置简单<br />2.能够控制提交源|1.配置简单<br />2.提交简单|1.配置繁琐<br />2.提交和原来无异|
|缺点|需要提交两次|无法控制|github action 被制裁了就gg|
|评星|⭐️⭐️⭐️|⭐️⭐️⭐️⭐️⭐️|⭐️⭐️⭐️|



在我写完本文的时候事情也有了一些发酵，我看到 3-2 的时候github 发布了声明依旧会无国界地提供服务。

![](https://s3.qiufeng.blue/blog/gitee-image_11.png?imageView2/0/q/75 "")

[https://github.blog/2022-03-02-our-response-to-the-war-in-ukraine/](https://github.blog/2022-03-02-our-response-to-the-war-in-ukraine/)

但是在这次事件还有人被封了号

![](https://s3.qiufeng.blue/blog/gitee-image_12.png?imageView2/0/q/75 "")

所以，

备份数据很重要！

备份数据很重要！

备份数据很重要！

明天和意外哪个会先降临我们不知道，但是我们要做的尽可能的未雨绸缪！

最后感谢你的阅读，请转给需要的人。




