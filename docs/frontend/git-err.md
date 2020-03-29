# git stderr(错误流)探秘

# 起因

最近在维护内部发布系统的时候，遇到了一个问题，觉得非常的神奇。在使用git checkout的时候，发布系统会报错，导致发布版本失败，可能我这样描述，大家无法理解我所表达的。如果你已经步入，或正想要步入工程化的项目，仔细看哦，下面的坑你可能也会遇到，由于无法展示发布系统代码，我将写一个小例子来给大家进行演示。

index.js

```javascript
const spawn = require('child_process').spawn;
const sh = spawn('sh', ['checkout.sh']);
sh.stdout.setEncoding('utf8');

sh.stdout.on('data', function(data) {
    console.log('success', data.toString());
});

sh.stderr.on('data', function(data) {
    console.log('error', data.toString());
});
```

checkout.sh（记得chomd a+x ./checkout.sh）

```shell
git clone https://github.com/hua1995116/webchat.git 
cd webchat
git checkout dev 
```

运行，（以下情况默认你本地网络没有问题，能够正常clone）

![image-20180904230252159](https://s3.qiufengh.com/blog/2018-09-07/image-20180904230252159.png)

![image-20180904230401160](https://s3.qiufengh.com/blog/2018-09-07/image-20180904230401160.png)

看到上述结果是不是大家会有疑惑，what？为什么会有error输出，clone正确，并且正确地切换了分支。为什么在clone就报错了，还有Switched to a new branch 'dev'，多么正常的一句话，有错吗，why？why？why？心中充满了许多的疑问。



然后在我们的发布系统上，也是类似的操作，会去监听stdout流和stderr流，如果在stderr流监听到错误，那就意味着发布失败。嗯，以上就是我所描述的问题，不知客官听得可好？



# 解决

再继续讲后面的内容，我们先讲三个概念，就是这三种流，stderr / stdin / stdout 

```
Every process is initialized with three open file descriptors, stdin, stdout, and stderr. stdin is an abstraction for accepting input (from the keyboard or from pipes) and stdout is an abstraction for giving output (to a file, to a pipe, to a console).
```

https://msdn.microsoft.com/en-us/library/3x292kth.aspx

可以看到的这三者分别的解释是：

**标准错误流 / 标准输入流** **/ 标准输出流**



所以，stderr确实是错误流，emmmm，既然确定是报错了，那就去查一下解决的方案。



Tip:

```
如果想要详细了解stderr / stdin / stdout ，以及他们的由来，可以看这篇文章。
https://www.jstorimer.com/blogs/workingwithcode/7766119-when-to-use-stderr-instead-of-stdout
```



快速在google 敲下了git clone stderr



https://stackoverflow.com/questions/32685568/git-clone-writes-to-sderr-fine-but-why-cant-i-redirect-to-stdout

https://stackoverflow.com/questions/34820975/git-clone-redirect-stderr-to-stdout-but-keep-errors-being-written-to-stderr/34841363



找到了以上的两种解决方案。



## 一、git  clone  -q

我就去看了下git的官方文档

https://git-scm.com/docs/git-checkout#git-checkout--q

```
-q
--quiet
Quiet, suppress feedback messages.

--[no-]progress
Progress status is reported on the standard error stream by default when it is attached to a terminal, unless --quiet is specified. This flag enables progress reporting even if not attached to a terminal, regardless of --quiet.
```

https://git-scm.com/docs/git-clone#git-clone---quiet

```
--quiet
-q
Operate quietly. Progress is not reported to the standard error stream.
```

可以看到用-q 可以使得一些**进度**不输出到标准错误流（standard error stream），推荐使用此方法来解决刚才的问题。

现在我们来改写下开头的例子。

index.js

```javascript
const spawn = require('child_process').spawn;
const sh = spawn('sh', ['checkout.sh']);
sh.stdout.setEncoding('utf8');

sh.stdout.on('data', function(data) {
    console.log('success', data.toString());
});

sh.stderr.on('data', function(data) {
    console.log('error', data.toString());
});
```

checkout.sh（记得chomd a+x ./checkout.sh）

```shell
# 删除刚才的项目
rm -rf webchat 
git clone -q https://github.com/hua1995116/webchat.git 
cd webchat
git checkout -q dev 
```

![image-20180905002458823](https://s3.qiufengh.com/blog/2018-09-07/image-20180905002458823.png)

已经不输出error了。

## 二、 git  clone  XXX  dir  2>&1

可以利用*nux的语句，强行将标准错误流（stderr）输出到标准输出流（stdout）

此方法不建议使用，只有确保你的操作没有错误，可以过滤掉不必要的一些错误信息。

2>&1

- 0 表示stdin标准输入
- 1 表示stdout标准输出
- 2 表示stderr标准错误
- **>**代表重定向到哪里，例如：echo "123" > /home/123.txt
- &表示等同于的意思，2>&1，表示2的输出重定向等同于1

把标准出错重定向到标准输出,然后扔到dir目录下面去。（dir可以为你本地的路径，例如```git clone https://github.com/hua1995116/webchat.git  /usr/log 2>&1``` ， 意思为将git clone 生成的错误流重定向到/usr/log目录下）



参考：

https://unix.stackexchange.com/questions/99263/what-does-21-in-this-command-mean



# 探秘

看到这里，我们虽然解决了这个问题。但是心中还是会不免有一些疑惑，为什么会报这个错误，究竟发生了什么，什么情况下会发生这种错误，遇到问题都无脑-q吗？

所以，遵循一贯的风格，我们就探究到底



可以看到上面-q的描述中都出现了```standard error stream```

所以我就在google默默地输入

 git stderr instead of stdout.



![image](https://s3.qiufengh.com/blog/2018-09-07/image.png)





http://git.661346.n2.nabble.com/Bugreport-Git-responds-with-stderr-instead-of-stdout-td4959280.html

看到了这么一个邮件组，里面可好玩了。

看完通篇，可以看到有这么一个人说了这样的一段，非常的中肯

![image-20180905003037811](https://s3.qiufengh.com/blog/2018-09-07/image-20180905003037811.png)

大意如下：

在实践中，每个工具会因为它们不同演进方式以及不同维护者，都会有自己独特的东西。 我认为这是一个慢慢修复的过程。 至于究竟是什么行为，我不知道有没有人曾经完全列举过它。 **详细的状态和进度报告**，特别是只读的，应该总是发给stderr。

像刚才的"Switched to a new branch"，是一个**状态**，进入到stderr完全是正确的，如果想要修复，就应该用-q。

stdout中的信息，应该是主要的信息，不应该包含一些不必要的状态。



**涨知识了！！**



嗯，看到这里我也只能是听别人的话，没法办法实锤他这个想法，于是我就去趴了git的源码



https://github.com/git/git/blob/master/builtin/checkout.c#L703



![image-20180905003840195](https://s3.qiufengh.com/blog/2018-09-07/image-20180905003840195.png)



没错，就是这一句，终于放心了，原来源码中，就是这么写？我….嗯，当然是选择原谅。

https://github.com/git/git/blob/master/builtin/clone.c#L1011

git clone中也是类似。



那么就印证了，刚才那位朋友（暂且称为朋友）的话。



然后手贱，github搜了下，刚才那段话下面的署名，peff



https://github.com/peff



![image-20180905004157471](https://s3.qiufengh.com/blog/2018-09-07/image-20180905004157471.png)



嗯，收回刚才的话，是刚才那位大佬，既然是这样，那peff的话就足够有分量。



现在我们已经从源码实锤 以及 git主要贡献者口中，知道了为什么git clone 和git checkout 在正确的情况下，还是会讲部分日志输出到stderr的真相。长舒一口气。



通过这次探秘也让我明白了一个道理，规定是死的，人是活的。万事，不要太盲目于规定。