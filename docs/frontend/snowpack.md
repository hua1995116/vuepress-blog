# 《模块化系列》snowpack，提高10倍打包速度。

## 引言

前几天听一个朋友说到 `snowpack`, 便去去看了下这个包是干什么的，看了下官网，发现这个东西还是蛮有意思的。号称 `无需打包工具（Webpack，Parcel）便能将代码结果实时展现在浏览器中`。可以先看以下的图，是不是很诱人？

![ENtxlBtU8AAmh62.jpeg](https://s3.qiufengh.com/blog/ENtxlBtU8AAmh62.jpeg)

snowpack 以 ES Modules 为主，如果对 ES Modules 不熟悉的朋友，请先查看我的上一篇文章。

## 为什么使用 snowpack

![ENt4hdjUEAATBqh.jpeg](https://s3.qiufengh.com/blog/ENt4hdjUEAATBqh.jpeg)

在 ESM 出现之前，JavaScript 的模块化就有各式各样的规范，主要有 CommonJS, AMD, CMD, UMD 等规范，最为广泛的就是 Node.js 的 CommonJS，使用 ​module.exports​ 和 ​require​ 来导出导入模块，它是 npm 中的模块最主要提供的格式。由于浏览器并不直接支持这些模块，因此打包工具（Webpack，Browserify，Parcel 等）出现了。

1. 在开发过程中你是否遇到 webapp 总是需要等待才能看到结果，每次保存后电脑就非常疯狂。
2. webpack 之类的打包工具功能非常强大，他们引入配置，插件，依赖成本很低，任意创建一个 react 应用便将要安装 200M 的依赖包，并且需要写很多行的webpack配置。
3. ESM在浏览器中使用了大约5年的时间，现在在所有现代浏览器中都受支持（可追溯到2018年初）。使用ESM，不再需要打包工具。您可以在没有 Webpack 的情况下构建一个现代化，高性能，可用于生产的Web应用程序！
4. 你只需安装运行一次 snowpack 替换 Webpack，Parcel等繁杂的打包工具，可以获得更快的开发环境，并减少工具复杂性。

## 环境支持

由于默认情况下，snowpack将npm依赖项安装为ES模块(ESM)，那么 ES 模块的支持情况怎么样了呢？

不用担心，目前使用的90%的浏览器都支持 ESM 语法。自2018年初以来，所有现代浏览器(Firefox、Chrome、Edge、Safari)都支持ESM。

![1582028874457.jpg](https://s3.qiufengh.com/blog/1582028874457.jpg)

## 示例

需要环境:  Node 10 +

### 基础

说了这么多，就是说方便呗。那么我来实际操作一下。

先以一个 react 项目为例 

```bash
mkdir snowpack-demo

cd snowpack-demo

npm init -y
```

安装依赖
```
npm i @babel/cli @babel/core @babel/preset-react servor snowpack -D
npm i react@npm:@pika/react react-dom@npm:@pika/react-dom -S
```

```javascript
// src/index.js
import React, { useState } from "react";
import ReactDOM from "react-dom";

function App() {
    return (
      <div>hello world</div>
    );
}

window.addEventListener("load", () =>
  ReactDOM.render(<App />, document.getElementById("app"))
);

```

```html
<div id="app"></div>
<script type="module" src="/dist/index.js"></script>
```

```bash
npx snowpack

babel src/ --out-dir dist

npx servor --reload
```

打开 http://localhost:8080



![屏幕快照 2020-02-18-21.03.23.png](https://s3.qiufengh.com/blog/屏幕快照%202020-02-18-21.03.23.png)



### 进阶

**使用 css**

由于浏览器不支持直接使用 JS 导入 CSS, 因此以下代码无法使用。

```javascript
// ✘ NOT SUPPORTED OUTSIDE OF BUNDLERS
import './style.css';
```

如果想要引入css， 需要通过 style 标签直接引入资源。

官方推荐的使用方式是

1. 简单应用，使用内敛 style
2. 复杂应用推荐使用 CSS-in-JS

因此这里采用 `styled-components`

```bash
npm i styled-components -S
npx snowpack
```

修改 `index.js`
```javascript
import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';

const UI = styled.div`
    color: red
`

function App() {
    return (
      <UI>
        hello world
      </UI>
    );
}

window.addEventListener("load", () =>
  ReactDOM.render(<App />, document.getElementById("app"))
);

```


修改下 `package.json`

```json
"start": "babel src/ --out-dir dist --watch & servor --reload"
```

```bash
npm run start
```

![屏幕快照-2020-02-18-22.11.04.png](https://s3.qiufengh.com/blog/屏幕快照-2020-02-18-22.11.04.png)

**使用图片**

```javascript
// ✘ NOT SUPPORTED OUTSIDE OF BUNDLERS
import './photo.png';
```

如今，没有浏览器支持直接从JS导入图像。 相反，您将要使用以下库/解决方案之一：

`<img src="/img/photo.png">`


**使用TypeScript**

```bash
npm i @babel/preset-typescript typescript -D
```

修改 `.babelrc`

```json
{
    "presets": ["@babel/preset-react", "@babel/preset-typescript"],
    "plugins": [
        "snowpack/assets/babel-plugin.js"
    ]
}
```

将 `src/index` 修改成 `src/index.tsx` 并加入声明。

```typescript
import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeProvider } from 'styled-components';

const ThemeColor = {
  default: 'red'
}

interface Theme {
  themeColor: typeof ThemeColor
}

const UI = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider theme={ThemeColor}>{children}</ThemeProvider>
    </>
  );
};

const AppStyle = styled.div<Theme>((props: Theme) => {
  console.log(props);
  return {
    color: props.theme.default
  }
})

function App() {
  return (
    <UI>
      <AppStyle>
        hello world
      </AppStyle>
    </UI>
    );
}

window.addEventListener("load", () =>
  ReactDOM.render(<App />, document.getElementById("app"))
);

```

修改 `启动命令`，让 `babel` 包含对 后缀 `tsx` 的转义。

```json
{
  "start": "babel src/ --out-dir dist --watch --extensions \".ts,.tsx,.js,.jsx\" & servor --reload"
}
```


## 优化 

默认情况下，`snowpack`会安装最小化的依赖关系并针对开发进行了优化。 准备好进行生产时，请使用`--optimize`标志运行`snowpack`以启用某些仅针对生产的优化:
1. 最小化依赖关系
2. 转义低级语法
3. `Tree-Shaking`(通过`--include`启动自动模式)
4. 支持旧版浏览 `--nomodule`

如果要构建单页应用程序（SPA），请使用`--nomodule`运行snowpack并传入应用程序入口点。 然后，在你的应用程序中创建第二个脚本标签,带有`nomodule` 标识的入口。
```html
<!-- Ignored by legacy browsers: -->
<script type="module" src="/src/index.js"></script>
<!-- Ignored by modern browsers: -->
<script nomodule src="/web_modules/app.nomodule.js"></script>
```

完成此操作后，运行snowpack生成一个/web_modules/app.nomodule.js脚本，这个脚本会自动在旧的旧版浏览器上运行。


## 缓存处理

通过传入 `addVersion`

```json
/* .babelrc */
"plugins": [
  ["snowpack/assets/babel-plugin.js", {"addVersion": true}],
]
```

可以输出带有版本号的脚本

```javascript
// src/ File Input
import Foo from 'package-name';
// lib/ Babel Output
import Foo from '/web_modules/package-name.js?v=1.2.3';
```

## 结尾

**snowpack 优势**

1. 减少了打包的时间成本，只要一次 `snowpack`。修改源码能够实时反馈在浏览器上。
2. 代码可移植能力强，相当于纯写 JavaScript 语言。
3. 模块和源码相互独立，有点类似于 webpack 的 `DDL`。
4. 对于简单应用可以快速搭建，对于一些在线编辑的网站可以使用类似的方案进行构建。

**snowpack 劣势**
1. 对 ES Modules 的依赖性强，在npm 上虽然 ES Modules 的包在逐渐增加，但是短期内需要包都需要做额外的处理。例如我想引入 `Antd`, 发现其中依赖了很多 `CommonJS` 的模块以及样式未使用 CSS-in-JS, 引入较为繁琐。

![D3Uk1PSU4AAPg0b.jpeg](https://s3.qiufengh.com/blog/D3Uk1PSU4AAPg0b.jpeg)

![1581942499648.jpg](https://s3.qiufengh.com/blog/1581942499648.jpg)

![1581942520735.jpg](https://s3.qiufengh.com/blog/1581942520735.jpg)

2. 对于一些 `css`，`images` 资源处理不够友好，需要额外手动处理，并且底层使用 `rollup` 来进行一次 `ES Modules` 的导出太过于生硬, 没有强大的自定义的插件或者配置。
3. 太多依赖包会造成网络问题


以上例子： https://github.com/hua1995116/snowpack-demo

对于现阶段的 `snowpack` 来说还是太年轻，但是年轻总是充满希望和可能。

## 关注 
![gongzhonghao.png](https://s3.qiufengh.com/blog/gongzhonghao.png)