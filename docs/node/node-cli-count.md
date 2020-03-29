# 开发一个Node小玩具全过程

# 背景
命令行工具对于我们来说非常的熟悉，一些命令行的操作也极大的简化了我们的日常工作。本文就基于我写的一个Node命令行代码计数器来进行展开。

相信熟悉linux系统的，对于一些ps,grep,cp,mv…等命令用起来应该爱不释手，这也是我想要开发一个便捷命令行的初衷，其次就是记录一个完整开源小玩具的全过程。

命令行的特点：

- 操作简便
- 可视性强



看了一下当前的一些命令行有以下问题

- 种类少 https://github.com/Towtow10/line-count
- 颜值不够   https://github.com/AlDanial/cloc
- 统计不太方便 https://github.com/ryanfowler/lines



因此这一款高颜值方便的统计工具诞生。


![](https://s3.qiufengh.com/blog/1568533450472.png)

高颜图
![](https://s3.qiufengh.com/blog/1568533450657.png)

玩具源码

https://github.com/hua1995116/linec

# 准备

第三方库

- cli-table
- colors
- commander
- ignore



dev库(用来测试)

- chai
- mocha
- codecov
- istanbu



Node兼容性

- babel



静态文件

- 语言映射库
- 颜色库

# 思路



![](https://s3.qiufengh.com/blog/1568533450638.jpg)

通过commander来获取用户的一些自定义配置

```javascript
program
    .version('0.1.0')
    .option('-i, --ignore [dir]', 'ignore dir')
    .option('-p, --path [dir]', 'ignore dir')
    .parse(process.argv);

```



Node遍历文件，每种语言行数信息

```javascript
function getFile(dirPath) {

    const files = fs.readdirSync(dirPath);

    files.forEach((item) => {
        ...
    })
}
                  
```



ignore过滤输出到cache

```javascript
function handleIgnode(cPath) {
    try {
        const currentPath = path.join(ROOTPATH, '.gitignore');
        const fileData = fs.readFileSync(currentPath, 'utf-8');
        const ignoreList = fileData.split('\n');
        const filterList = filterData(ignoreList);
        const ig = ignore().add(filterList);
        return ig.ignores(cPath);
    } catch (e) {
        return false;
    }
}
```



遍历cache,统计max-line，进行colors

```javascript
function hanldeTable(){
    ...
    if (maxCount < langInfo[item].totalLines) {
        maxCount = langInfo[item].totalLines;
        maxIndex = index;
    }
    ...
}
```





cli-table 输出展示

```javascript
function outputTbale() {
    const {
        header,
        content,
        bottom
    } = initTable();

    const {
        totalFiles,
        totalCode,
        totalBlank,
        tablesContent
    } = hanldeTable();

	...

    console.log(`T=${totalTime} s`, `(${fileSpeed} files/s`, `${lineSpeed} lines/s)`)
    console.log(header.toString())
    console.log(content.toString())
    console.log(bottom.toString())
}
```





# 改进

loading

对于多文件目录，提供loading

```javascript
lass StreamLoad {
    constructor(option) {
        this.stream = option.stream;
        this.text = option.text;
        this.clearLine = 0;
    }
    setValue(value) {
        this.text = value;
        this.render();
    }
    render() {
        this.clear();
        this.clearLine++;
        this.stream.write(`read ${this.text} file\n`);
    }
    clear() {
        if(!this.stream.isTTY) {
            return this;
        }
        
        for (let i = 0; i < this.clearLine; i++) {
            this.stream.moveCursor(0, -1);
            this.stream.clearLine();
			this.stream.cursorTo(0);
        }
        this.clearLine = 0;
    }
}

const progress = new StreamLoad({
    stream: process.stderr,
    text: 0
})

```

创建了一个实现loading的类。主要用到readline中的处理方法，详见[https://nodejs.org/dist/latest-v8.x/docs/api/readline.html#readline_readline_movecursor_stream_dx_dy](https://nodejs.org/dist/latest-v8.x/docs/api/readline.html#readline_readline_movecursor_stream_dx_dy)



babel

对于低版本node的兼容

```
cnpm i babel-cli
```

package.json

```
"build": "./node_modules/.bin/babel src --out-dir lib"
```



# 测试用例

chai，mocha

用来测试遍历文件是否正确

```javascript
const path = require('path');
const assert = require('chai').assert;

const {getFileData} = require('../src/linec');

describe('linec files test', () => {
    it('can linec dir', () => {
        const url = path.join(__dirname, '../example');
        console.log(url);

        const dirObj = JSON.stringify(getFileData(url));

        const expectData = '{"CSS":{"file":1,"blankLines":0,"totalLines":4,"color":"#563d7c"},"JavaScript":{"file":1,"blankLines":0,"totalLines":1,"color":"#f1e05a"},"JSON":{"file":1,"blankLines":0,"totalLines":3,"color":"#fff"},"Markdown":{"file":1,"blankLines":0,"totalLines":1,"color":"#fff"}}';

        assert.equal(dirObj, expectData);

    })
})
```
运行
```
./node_modules/mocha/bin/mocha
```
本项目中还添加了代码覆盖率的测试，因此是这样的
```
"test": "./node_modules/.bin/istanbul cover node_modules/mocha/bin/_mocha && ./node_modules/.bin/codecov",
```

# 发布

Step1

打开https://www.npmjs.com/signup


![](https://s3.qiufengh.com/blog/1568533450634.jpg)

注册一个账号



step2

如果有账号直接到这一步

```shell
npm login
```



step3

在package.json中介入version

```
{
  "name": "linec",
  "version": "1.2.4",
  "description": "line count",
  "main": "index.js",
  ...
}

```



step4

```shell
npm publish
```



Tip:注意每次发版需要更改package.json 中的version，不然会发版失败哦。



# 命令行

package.json

```
"bin": {
	"linec": "./lib/index.js"
},
```

本地项目命令行

```
npm link
```

就可以使用linec 命令，将linec命令软连接到本地，linec这个名字可以自定义。



远端命令行

默认就是包名字，但是如果bin里面定义了一个名字，同上，可以修改名字。也就是包名可以和命令不一致，但是为了更方便的使用，个人建议统一包名和命令。



详情可以参考 http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html

# 持续集成测试&覆盖率的自动统计

https://travis-ci.org/

配置.travis.yml

```yaml
language: node_js

node_js:
  - "stable"

sudo: false

before_script:
  - npm install
```

这个是我的配置，每次你的提交，只要含有npm run test命令，travis会自动调用，自动检测。

travis还有个好处，在别人给你提交pr的时候，可以自动运行测试用例，避免一些低级错误的发生。以下就是效果图。



![](https://s3.qiufengh.com/blog/1568533450651.png)

https://codecov.io/gh

这是一个统计代码覆盖率的工具，在npm run test中添加他，在pr的时候可以看到覆盖率的统计


![](https://s3.qiufengh.com/blog/1568533450771.jpg)


# 安装&使用

```shell
$ npm install -g linec / cnpm install -g linec 
```


基础用法
```shell
$ linec
```

导出到html
```shell
$ linec -o
```
运行完会在当前目录出现一个output.html

# 功能

- 输出空行，实际行数，总行数
- 支持400+语言
- 显示遍历速度
- 显示多种颜色
- 支持导出html


工具源码(欢迎star) https://github.com/hua1995116/linec



# 效果图
基础模式

![](https://s3.qiufengh.com/blog/1568533450657.png)

导出后打开html


![](https://s3.qiufengh.com/blog/1568533450645.png)


# 结尾
以上就是全部内容，可能对于Node工具开发我可能还是处于初出茅庐的阶段，有更规范的操作，欢迎大佬们给我指正。