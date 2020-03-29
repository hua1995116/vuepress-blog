#  教你如何搭建一个自动化构建的博客

# 前言

记得在1年之前搭建了一个个人主页的博客，但是当时功力尚浅，每次写博客，都是自己手动写html，这样会变得非常的繁琐，现在很多人用主流的wordpress，hexo之类的快速搭建一个平台，那些工具确实方便，但是对于主题以及一些额外的排版，就显得非常的麻烦，本文致力于教你如何搭建一个个性化，并且自动化构建的博客。

# 开始

完成后的博客展示： http://yifenghua.win/

github地址： https://github.com/hua1995116/myblog （喜欢的👍一个哈）

本平台也是基于.md文件构建成html的自动化流程，因为现在主流的编写方式就是用.md文件来抒写，所有问题就归结为，如何让.md文件转化成.html文件。那问题就变得非常的简单了，现在市面上有很多md转成html的工具，markdown，marked，node-markdown等等。今天我就用marked来构建我们的自动化博客。

# Go on

[Marked](https://github.com/chjj/marked)使用方法非常的简单。

```javascript

var marked = require('marked');
console.log(marked('I am using __markdown__.'));
// Outputs: <p>I am using <strong>markdown</strong>.</p>
```

假设我们的git.md是这样的：

```
st = status
co = checkout
cob = checkout -b
br = branch
bra = branch -a
ci = commit
cim = commit -m
cia = commit --amend
re = reset
rb = rebase
rbi = rebase -i
rbim = rebase -i origin/master
rbid = rebase -i origin/devlop
rbc =erebase --continue
rba = rebase --abort
fe = fetch
psom = push origin master
puom = pull origin master
```
如果是想要输出文件的形式：

```javascript

const fs = require('fs')  
const marked = require('marked') 
fs.readFile('./notes/git.md', 'utf8', (err,markContent)=>{  
  if(err){  
    throw err  
  }else{   
    fs.writeFile('./git.html',marked(markContent.toString()), err=>{  
      if(err){  
        throw err  
      }else{  
        console.log("success")  
      }  
    }) 
  }  
})   
```

既然我们已经知道了md文件如何转成html，但是我们发现，这样生成的文件是没有样式的，所以我们需要去找一个样式的库，我现在用的是[github-markdown.css](https://github.com/sindresorhus/github-markdown-css) 还有一个代码高亮的库，[prism](https://github.com/PrismJS/prism) 。引用prism.css和prism.js ，就可以发现我们打开的html，就有了样式，还有代码高亮的操作。

因为我们到，github-markdown-css，prism分别取下载对应的css和js，然后引入。

经过上述操作后，我们的文件应该是这样的:

```Html

<!DOCTYPE html>
<html>
<head>
<title></title>
<link rel="stylesheet" type="text/css" href="../css/github-markdown.css">
<link rel="stylesheet" type="text/css" href="../css/prism.css">
</head>
<body>
<pre><code>
st = status
co = checkout
cob = checkout -b
br = branch
bra = branch -a
ci = commit
cim = commit -m
cia = commit --amend
re = reset
rb = rebase
rbi = rebase -i
rbim = rebase -i origin/master
rbid = rebase -i origin/devlop
rbc =erebase --continue
rba = rebase --abort
fe = fetch
psom = push origin master
puom = pull origin master
</code></pre>
<script type="text/javascript" src="../js/prism.js"></script>
</body>
</html>
```


但是这一步是我们手动写上的。

# Next

因为我的需要一个模板机制，来帮我们手动生成一个文件。
Tempale.html

```Html

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<title></title>
	<link rel="stylesheet" type="text/css" href="../css/github-markdown.css">
	<link rel="stylesheet" type="text/css" href="../css/prism.css">
	<!-- <link type="text/css" rel="stylesheet" href="./css/shCoreEclipse.css"/> -->
</head>
<body scroll="no">
	<div class="markdown-body">
		@markdown
	</div>

<script type="text/javascript" src="../js/prism.js"></script>
</body>
</html>
```

再来重新配置我们的运行文件。

```javascript

const fs = require('fs')  
const marked = require('marked') 
fs.readFile('./template1.html', 'utf8', (err, template)=>{  
  if(err){  
    throw err  
  }else{  
    fs.readFile('./notes/git.md', 'utf8', (err,markContent)=>{  
    if(err){  
      throw err  
    }else{   
      template = template.replace('@markdown', marked(markContent.toString()))
      fs.writeFile('./git.html',  template, err=>{  
        if(err){  
          throw err  
        }else{  
          console.log("success")  
        }  
      })
    }  
  })
  }
})
```

可以看到一个生成后的文件，已经完整了。

# 扩展

分页：再此基础上我又对其进行了扩展，增加了一个分页的功能。
![tagdata.json](https://s3.qiufengh.com/blog/1568533450468.png)

文件目录：.md 文件的目录（待开发）

归档：在json目录下生成tagdata.json 

![tagdata.json](https://s3.qiufengh.com/blog/1568533450378.png)
# 使用

```Git
git clone https://github.com/hua1995116/myblog
```

将需要写的.md文件放到notes目录下，

```

// 安装依赖
npm install
// 编译
node index.js
// 本地查看
node http.js
```

其他具体的样式你可以自行配置，和普通写html，css无差异。

编译后的html代码在html目录下，将其放到你的站点下，或者github-pages上即可。
每次写完新的博客，只要运行下index.js即可发布。