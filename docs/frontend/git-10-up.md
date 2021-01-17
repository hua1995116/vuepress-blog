# 🔱 几个你不知道的Git小命令,收获快乐。

本文是对原文的翻译+并在原文基础上自我实践，进行了大量的补充。

[Git Commands You Didn't Know](https://dev.to/dephraiim/git-commands-you-probably-didn-t-know-3bcm?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email)

## 前言

关于 Git, 我最喜欢的它的原因之一就是它既简单又可自定义，`alias` 功能就是其中的代表。 Git 支持` alias`，这意味着你可以给命令自定义名字。 当然，我更喜欢为很长的命令设置别名(`alias`)，避免每次需要他们的时候，我要花时间去搜索它们。

> 别名(alias)最好设置成你最习惯的语义化方式，毕竟工具只是工具，是帮助我们提高效率的，打一长串命令，没有必要。 :)  

Git中的别名(alias)配置规则是这样的。

```bash
git config --global alias.[new_alias] "[previous_git_command]"

# Example
git config --global alias.save commit
```

从上面的示例中，我将不再需要 git commit，我更习惯用 git save。

如果命令是多个，则需要用引号包住多个选项。

## `git recommit`

```bash
git config --global alias.recommit 'commit --amend -m'
```

`git commit --amend` 允许你更改最后的提交信息(`message`)。 `recommit`命令让提交变得更简单，更容易记住。

```bash
# Change the last commit message with recommit
git recommit "New commit message"

# [master 64175390] New commit message
#  Date: Tue Sep 22 15:09:11 2020 +0000
#  1 file changed, 2 insertions(+)
#  create mode 100644 vue.js
```

## `git commend`

```bash
git config --global alias.commend 'commit --amend --no-edit'
```

使用`--no-edit`标志进行修改，可以在最近一次提交时在仓库中提交新的更改，你不需要再次重复提交消息。

**我来解释一下这个命令**，你是否有这种经历，写完代码了 `git add .` 、 `git commit xxx` ，一顿操作，刚想` push` 的时候发现 有个文件漏改了，又是 `git add .` 、 `git commit xxx` 一顿操作，此时 `commit` 就会有两次记录，这对于项目来说是非常不好的，一次 `commit` 被分成了两次，如果遇到需要` revert` 你就傻眼了。这个时候你就可以用这个命令轻松解决。

**代码演示**

```
echo 'Hello world' > README.md
git add .
git commit -m "Hello Word"
git log --oneline
4b39c8a (HEAD -> master) Add README.md
```

```
echo 'Hello 秋风' >> README.md
git commend
git log --oneline 
60c5190 (HEAD -> master) Add README.md
```

此时`git log`依然只有一次记录。

## `git search`

```bash
git config --global alias.search 'grep'

# Example
git search [search_term]
```

`git grep`允许你在存储库中搜索关键字(且支持正则)，并返回各种匹配项。 这很酷，但是我不知道 `grep` 的意思，请告诉我是否这样做。 我更喜欢`search`，它易于记住并且易于使用。

```
git search createHotContext
```

![image-20201001204951416](https://s3.qiufengh.com/blog/image-20201001204951416.png)

## `git here`

```
git config --global alias.here '!git init && git add . && git commit -m "init 🦄"'
```

通常，当我初始化一个新的仓库时，我将暂存所有文件，并使用初始提交消息进行提交。 我使用`git here`一步就完成了（这对于开源工具重度爱好者，真的是福星，太爽了，谁用谁知道）。 只需在要创建新仓库的文件夹中运行它，就可以了。

> 小技巧: 像我在公司开发代码需要提交到公司的私有仓库，因此全局配置了公司的 username 和 email，当我切换到开源项目的时候，老是会忘记修改回来，因此我会创建一个 `git config user.name xxx \n git config user.email xxx@xx.com` 的一个 sh文件。因此我初始化的时候可以这样 。

```
git config --global alias.here '!git init && sh ~/my/git.sh && git add . && git commit -m "init 🦄"'
```

这样子，既可以提交到私有仓库，创建开源项目的时候又不耽误。

也有人说，我不改也能提交啊，=。= 为啥要改？那是你不知道强迫症....看到这种灰色头像的提交真的是心里焦灼。

![image-20201001210508185](https://s3.qiufengh.com/blog/image-20201001210508185.png)

## `git who`

```bash
git config --global alias.who 'blame'

# Example
git who index.ts
# 641753902 (Ephraim Atta-Duncan 2020-09-22 15:09:11 +0000 1)
# 641753902 (Ephraim Atta-Duncan 2020-09-22 15:09:11 +0000 2) console.log("who?") 

```

`git blame` 用于逐行检查文件的内容，并查看每行的最后修改时间以及修改的作者。 如果有错误，你可以追溯到某一行的改动是谁修改的。vscode 插件 `GitLens`也是基于此原理。

> 总结: 追踪 bug 小能手，以后谁写出bug，轻松定位某一行是谁写的。

## `git zip`

```bash
git config --global alias.zip 'archive --format=tar.gz -o repo.tar.gz'

# Example
git zip [branch_name]
```

使用 `archive`命令可以创建整个或部分仓库的 `tarball` 和` zip`。 `git zip` 更容易记住。 只需添加分支名称。

```bash
➜  git-test2 git:(master) ls
README.md
➜  git-test2 git:(master) git zip master
➜  git-test2 git:(master) ✗ ls
README.md   repo.tar.gz
```

## `git newbie`

```bash
git config --global alias.newbie 'checkout --orphan'

# Example
git newbie [new_branch_name]
```

带有`--orphan` 标志的`git checkout`允许您创建一个分支，而没有来自父分支的任何历史记录。

```bash
➜  git-test2 git:(master) git newbie pages
Switched to a new branch 'pages'
➜  git-test2 git:(pages) ✗ ls
README.md
➜  git-test2 git:(pages) ✗ git log
fatal: your current branch 'pages' does not have any commits yet
➜  git-test2 git:(pages) ✗
```

**实践**

那么它的应用场景是什么呢?

还记得` github pages` 吗？利用他能快速创建站点，可以用某个分支来当做站点展示，但是如果我们把源码和打包后的文件都放在一个分支，就会显得累赘与混乱，这个时候我们就可以利用这个特性来创建一个全新无 `commit` 的分支。两个工程（一个源文件工程，一个打包后的工程）放到同一个仓库(repo)中。

**代码演示**

```bash
➜  git-test2 git:(master) git newbie pages
Switched to a new branch 'pages'
➜  git-test2 git:(pages) ✗ ls
README.md
➜  git-test2 git:(pages) ✗ git log
fatal: your current branch 'pages' does not have any commits yet
➜  git-test2 git:(pages) ✗ git st
On branch pages

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

	new file:   README.md

➜  git-test2 git:(pages) ✗
```

## `git clonely`

```
git config --global alias.clonely 'clone --single-branch --branch'

# Example
git clonely [branch_name] [remote_url]

git clonely v3 https://github.com/vuejs/vue-apollo
# Cloning into 'vue-apollo'...
# remote: Enumerating objects: 2841, done.
# remote: Total 2841 (delta 0), reused 0 (delta 0), pack-reused 2841
# Receiving objects: 100% (2841/2841), 1.92 MiB | 330.00 KiB/s, done.
# Resolving deltas: 100% (1743/1743), done.
```

带有`--single-branch --branch`标志的`git clone `允许你从存储库中` clone `特定分支，毫不夸张的说，这个命令我在 Google 中搜索了10多次。 别名（alias）更好用，更好记忆~

**能干嘛呢？**

当然是减少`clone`时间，这对大仓库而言简直是福星。

## `git plg`

```bash
git config --global alias.plg "log --graph --pretty=format:'%C(yellow)%h%Creset -%Cred%d%Creset %s %Cgreen| %cr %C(bold blue)| %an%Creset' --abbrev-commit --date=relative"

# Example
git plg # plg - Pretty Log

```

`git log`没什么问题，除了它有点丑陋，没有颜色差异，如果要自定义它，我们需要在 google 上查询相关的命令。 幸运的是，我们有别名(alias)。 使用该命令的别名，你将获得非常漂亮的日志。

![image-20201001223111514](https://s3.qiufengh.com/blog/image-20201001223111514.png)

## `git fresh`

```
git config --global alias.fresh "filter-branch --prune-empty --subdirectory-filter"

# Example
git fresh [subfolder] [branch_name]
git fresh src main # Don't do this unless you know what you are doing
```

通过一系列参数，使用`fresh`命令用于从子文件夹中创建新的存储库。 带有多个参数的 `filter-branch`获取指定子文件夹的内容，并将其中的内容替换为该子文件夹的内容。

**实践**

假设有这样一个项目，目录结构如下

```
.
├── script
│   └── index.js
├── README.md
```

如果我们需要改造项目，将 `script` 作为单独的项目， 这个时候我们需要将 `script` 拆出来，我们一般会通过拷贝来解决，这样做没有什么问题，但是你将丢失` script `目录以及子文件所有历史修改记录。

现在我们成功将 `script` 目录拆成了单独的项目。

![image-20201001224453823](https://s3.qiufengh.com/blog/image-20201001224453823.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

再来看 `commit` 记录，依旧保留了` script` 的相关` commit `记录，对于管理项目来说非常有帮助。

```bash
commit 8b311558195684d6420baedce74e0f9951208038 (HEAD -> master)
Author: qiufeng <qiufeng@163.com>
Date:   Thu Oct 1 22:37:21 2020 +0800

    feat: script
(END)
```

如果我们不小心拆分错了，还可以进行还原。

```
git reset --hard refs/original/refs/heads/{branch_name}
```

![image-20201001224735002](https://s3.qiufengh.com/blog/image-20201001224735002.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

还可以继续拆分,这个时候拆分需要先清除一下备份~

```
git update-ref -d refs/original/refs/heads/master
```

然后从头开始继续操作即可~

## 最后

将此添加到你的 `.gitconfig` 文件。

```
[alias]
    recommit = commit --amend -m
    commend = commit --amend --no-edit
    here = !git init && git add . && git commit -m \"Initialized a new repository\"
    search = grep
    who = blame
    zip = archive --format=tar.gz -o ../repo.tar.gz
    lonely = clone --single-branch --branch
    plg = log --graph --pretty=format:'%C(yellow)%h%Creset -%Cred%d%Creset %s %Cgreen| %cr %C(bold blue)| %an%Creset' --abbrev-commit --date=relative
    fresh = filter-branch --prune-empty --subdirectory-filter
```