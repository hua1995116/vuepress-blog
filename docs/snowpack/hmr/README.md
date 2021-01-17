# 热更新 HMR

热更新是已经是我们开发中必备的东西了，能够提高我们的开发效率。能够让浏览器不刷新的情况下进行更新内容。其实他的主要原理和 webpack 的 HMR 差不多。但是每个打包器都单独写了不同的接口，使得热更新模块无法共享，为此，snowpack 写了一个关于 ES Module hmr 的规范，https://github.com/pikapkg/esm-hmr 。

主要分为 client 和 server 端。

我们先从入口开始讲起。

![image-20201008204321155](https://s3.qiufengh.com/blog/image-20201008204321155.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

我将 `index.js`复制了出来。

```javascript
import * as  __SNOWPACK_HMR__ from '/__snowpack__/hmr.js';
import.meta.hot = __SNOWPACK_HMR__.createHotContext(import.meta.url);
import __SNOWPACK_ENV__ from '/__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import { createApp } from "/web_modules/vue.js";
import App from "./App.js";

const app = createApp(App);
app.mount("#app");

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.unmount();
  });
}
```

我们可以看到`import * as  __SNOWPACK_HMR__ from '/__snowpack__/hmr.js';`从第一句就可以看到引入了 hmr 模块，并且将 `import.meta.url` 作为 导入模块的一个方法参数传入。

那么这个 `import.meta.url` 是什么呢 ?

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import.meta

我们来看看 MDN 上的例子来解释。

`import.meta`是一个给JavaScript模块暴露特定上下文的元数据属性的对象。它包含了这个模块的信息，比如说这个模块的URL。

**示例**

这里有一个 `my-module.mjs模块`

```html
<script type="module" src="my-module.mjs"></script>
```

你可以通过 `import.meta` 对象获取这个模块的元数据信息.

```js
console.log(import.meta); // { url: "file:///home/user/my-module.mjs" }
```

通过以上例子我们知道 `import.meta.url`就是当前加载 js 的完整url。

我们当前的url为 `http://localhost:8080/`，对应的 `index.js` 的 `import.meta.url` 就是 `http://localhost:8080/_dist_/index.js` 。

接着往下看，我们就看到使用了`__SNOWPACK_HMR__.createHotContext` 赋值给的 `import.meta.hot`对象。

那么我们先来看看 这个 `createHotContext` 方法都干了什么？

https://github.com/pikapkg/snowpack/blob/f1fd2cb181c1fe6ce2f158159a6fc3191e7456b4/snowpack/assets/hmr.js#L83-L94

```js
// hmr.js 83-94
export function createHotContext(fullUrl) {
  const id = new URL(fullUrl).pathname;
  const existing = REGISTERED_MODULES[id];
  if (existing) {
    existing.lock();
    runModuleDispose(id);
    return existing;
  }
  const state = new HotModuleState(id);
  REGISTERED_MODULES[id] = state;
  return state;
}

```

首先是将传入的`import.meta.url` 构造了 URL 对象并获取了 `pathname`，以`http://localhost:8080/_dist_/index.js`为例，就是获取到了 `_dist/_index.js`，然后到一个名叫 `REGISTERED_MODULES` 模块中来查找该模块是否注册，如果注册的话，就会运行一段逻辑。我们目前是未注册的情况，以后再来讲解注册的情况。可以看到如果为注册就到了是 `HotModuleState` 这个类实例化的过程。然后将它注册到 `REGISTERED_MODULES`,并返回实例化的对象。

继续往下看 `HotModuleState` 。

```js
class HotModuleState {
  constructor(id) {
    this.data = {};
    this.isLocked = false;
    this.isDeclined = false;
    this.isAccepted = false;
    this.acceptCallbacks = [];
    this.disposeCallbacks = [];
    this.id = id;
  }
  lock() {
    this.isLocked = true;
  }
  dispose(callback) {
    this.disposeCallbacks.push(callback);
  }
  invalidate() {
    reload();
  }
  decline() {
    this.isDeclined = true;
  }
  accept(_deps, callback = true) {
    if (this.isLocked) {
      return;
    }
    if (!this.isAccepted) {
      sendSocketMessage({id: this.id, type: 'hotAccept'});
      this.isAccepted = true;
    }
    if (!Array.isArray(_deps)) {
      callback = _deps || callback;
      _deps = [];
    }
    if (callback === true) {
      callback = () => {};
    }
    const deps = _deps.map((dep) => {
      const ext = dep.split('.').pop();
      if (!ext) {
        dep += '.js';
      } else if (ext !== 'js') {
        dep += '.proxy.js';
      }
      return new URL(dep, `${window.location.origin}${this.id}`).pathname;
    });
    this.acceptCallbacks.push({
      deps,
      callback,
    });
  }
}
```

就这样暴露出了这么一个实例化的对象。

```js
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.unmount();
  });
}
```

看到，如果 hmr ，注册成功的话，会先调用 hmr 模块的 `accept` 方法，然后再调用 `dispose` 方法，而 dispose 方法中的回调是 vue 实例销毁的方法。那我们就来分析一下 `accept`  和 `dispose `方法到底干了什么。

```js
accept(_deps, callback = true) {
    if (this.isLocked) {
      return;
    }
    if (!this.isAccepted) {
      sendSocketMessage({id: this.id, type: 'hotAccept'});
      this.isAccepted = true;
    }
    if (!Array.isArray(_deps)) {
      callback = _deps || callback;
      _deps = [];
    }
    if (callback === true) {
      callback = () => {};
    }
    const deps = _deps.map((dep) => {
      const ext = dep.split('.').pop();
      if (!ext) {
        dep += '.js';
      } else if (ext !== 'js') {
        dep += '.proxy.js';
      }
      return new URL(dep, `${window.location.origin}${this.id}`).pathname;
    });
    this.acceptCallbacks.push({
      deps,
      callback,
    });
}
```

我们的例子中是直接调用了 `accept`，并且未传入任何的参数，因此看到最后的`this.acceptCallbacks.push({deps,callback,});` 此处应该为`this.acceptCallbacks.push({[],()=>{},});` 。

再来看看`dispose`。

```js
dispose(callback) {
    this.disposeCallbacks.push(callback);
}
```

这个方法更加简单，就是将我们注册的`app.unmoun()`的回调函数加入了一个`callback`队列 。

以上就是初始化的所有，看起来并没有什么特别之处。接下来我们来讲一讲，如果是模块热更新后，第二次导入会发生什么？ 我们继续回过头来看 `createHotContext` 模块。

```js
export function createHotContext(fullUrl) {
  ...
  if (existing) {
    existing.lock();
    runModuleDispose(id);
    return existing;
  }
  ...
}
```

主要逻辑为`runModuleDispose(id);`，我们接着来看~

```js
async function runModuleDispose(id) {
  const state = REGISTERED_MODULES[id];
  if (!state) {
    return false;
  }
  if (state.isDeclined) {
    return false;
  }
  const disposeCallbacks = state.disposeCallbacks;
  state.disposeCallbacks = [];
  state.data = {};
  disposeCallbacks.map((callback) => callback());
  return true;
}
```

`state` 即为上面所说的 `HotModuleState` 实例化对象，获取 `disposeCallbacks` 队列，这个就是我们第一次初始化的时候，将回调函数塞入的队列。`disposeCallbacks.map((callback) => callback());`最后将队列中的回调函数依次执行。

上面描述的有点抽象，下面用途来描述一下主要的流程。

![image-20201009233222226](https://s3.qiufengh.com/blog/image-20201009233222226.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

1. 创建了 hmr 的实例
2. 创建 app 实例
3. 将 app 销毁的回调函数加入到 hmr 销毁队列中
4. app挂载到了实体元素上面
5. 文件热更新更后，查询当前文件是否已经已经创建 hmr 实例。
6. 执行当前 hmr 实例中的 disposeCallbacks 的回调函数队列。
7. 销毁当前实例
8. 更新到视图上
9. 创建新的实例
10. 将新实例app2的回调函数加入到 原 hmr 实例的 disposeCallbacks 队列里

之后文件热更新，不断循环 5 - 10。



上面我们就讲完了前端部分的热更新，但是我们还没有讲 第一次文件加载以及后面文件改动后的第二次文件加载进行串联，这个就需要后端来进行串联。前端与后端建立websocket通信，后端通知前端去加载对应的文件。那么下面我们来讲讲这个桥梁部分。



那我们来看看后端 HMR 模块

https://github.com/pikapkg/snowpack/blob/f1fd2cb181c1fe6ce2f158159a6fc3191e7456b4/snowpack/src/hmr-server-engine.ts

包含空行一共139行代码。

```javascript
import WebSocket from 'ws';
import type http from 'http';
import type http2 from 'http2';

interface Dependency {
  dependents: Set<string>;
  dependencies: Set<string>;
  isHmrEnabled: boolean;
  isHmrAccepted: boolean;
  needsReplacement: boolean;
  needsReplacementCount: number;
}

const DEFAULT_PORT = 12321;

export class EsmHmrEngine {
  clients: Set<WebSocket> = new Set();
  dependencyTree = new Map<string, Dependency>();
  wsUrl = `ws://localhost:${DEFAULT_PORT}`;

  constructor(options: {server?: http.Server | http2.Http2Server} = {}) {
    // 构造函数
    const wss = options.server
      ? new WebSocket.Server({noServer: true})
      : new WebSocket.Server({port: DEFAULT_PORT});
    if (options.server) {
      options.server.on('upgrade', (req, socket, head) => {
        // Only handle upgrades to ESM-HMR requests, ignore others.
        if (req.headers['sec-websocket-protocol'] !== 'esm-hmr') {
          return;
        }
        wss.handleUpgrade(req, socket, head, (client) => {
          wss.emit('connection', client, req);
        });
      });
    }
    // 监听连接
    wss.on('connection', (client) => {
      this.connectClient(client);
      this.registerListener(client);
    });
  }
	// 注册消息事件
  registerListener(client: WebSocket) {
    client.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'hotAccept') {
        const entry = this.getEntry(message.id, true) as Dependency;
        entry.isHmrAccepted = true;
        entry.isHmrEnabled = true;
      }
    });
  }

  createEntry(sourceUrl: string) {
    const newEntry: Dependency = {
      dependencies: new Set(),
      dependents: new Set(),
      needsReplacement: false,
      needsReplacementCount: 0,
      isHmrEnabled: false,
      isHmrAccepted: false,
    };
    this.dependencyTree.set(sourceUrl, newEntry);
    return newEntry;
  }

  getEntry(sourceUrl: string, createIfNotFound = false) {
    const result = this.dependencyTree.get(sourceUrl);
    if (result) {
      return result;
    }
    if (createIfNotFound) {
      return this.createEntry(sourceUrl);
    }
    return null;
  }
	// 依赖关系处理
  setEntry(sourceUrl: string, imports: string[], isHmrEnabled = false) {
    const result = this.getEntry(sourceUrl, true)!;
    const outdatedDependencies = new Set(result.dependencies);
    result.isHmrEnabled = isHmrEnabled;
    for (const importUrl of imports) {
      this.addRelationship(sourceUrl, importUrl);
      outdatedDependencies.delete(importUrl);
    }
    for (const importUrl of outdatedDependencies) {
      this.removeRelationship(sourceUrl, importUrl);
    }
  }

  removeRelationship(sourceUrl: string, importUrl: string) {
    let importResult = this.getEntry(importUrl);
    importResult && importResult.dependents.delete(sourceUrl);
    const sourceResult = this.getEntry(sourceUrl);
    sourceResult && sourceResult.dependencies.delete(importUrl);
  }

  addRelationship(sourceUrl: string, importUrl: string) {
    if (importUrl !== sourceUrl) {
      let importResult = this.getEntry(importUrl, true)!;
      importResult.dependents.add(sourceUrl);
      const sourceResult = this.getEntry(sourceUrl, true)!;
      sourceResult.dependencies.add(importUrl);
    }
  }

  markEntryForReplacement(entry: Dependency, state: boolean) {
    if (state) {
      entry.needsReplacementCount++;
    } else {
      entry.needsReplacementCount--;
    }
    entry.needsReplacement = !!entry.needsReplacementCount;
  }

  broadcastMessage(data: object) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      } else {
        this.disconnectClient(client);
      }
    });
  }
	// 将连接加入连接池
  connectClient(client: WebSocket) {
    this.clients.add(client);
  }

  disconnectClient(client: WebSocket) {
    client.terminate();
    this.clients.delete(client);
  }

  disconnectAllClients() {
    for (const client of this.clients) {
      this.disconnectClient(client);
    }
  }
}
```

以上代码我就详细讲一讲，我把以上主要分为三个部分，第一部分为初始化阶段的连接池，第二部分为消息注册部分，第三部分是依赖处理部分。

**初始化阶段**

```js
wss.on('connection', (client) => {
      this.connectClient(client);
      this.registerListener(client);
});
...
connectClient(client: WebSocket) {
    this.clients.add(client);
}
...
```

这里我们可以看到，连接的时候是将 client 放入了一个队列，这个是为啥呢？是由于当我们本地开发的时候，会开启多个 tab 页面，或者多个浏览器启动同一个页面，我们的服务都会监听到，当本地代码有改动的时候，所有页面都会自动热更新。怎么样？贴心吧，这个是一个常见的操作，特别是在我们多端设备登录的时候，例如电脑版微信和客户端版本，我们在双端都能收到最新的消息，也就是利用了这个特性。

**消息注册部分**

```js
...
registerListener(client: WebSocket) {
    client.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'hotAccept') {
        const entry = this.getEntry(message.id, true) as Dependency;
        entry.isHmrAccepted = true;
        entry.isHmrEnabled = true;
      }
    });
}
...
```

为什么我把这部分单独拎出来讲呢？这部分其实很简单，就是注册了一个` messages` 事件，等待客户端发送信息给服务端，但是这里也涉及到了一个部分 `message.type === 'hotAccept'` 当这个条件成立的时候，会去影响到我们的第三个部分，这里我们只需要注意一下就行，后面会详细讲到。

```js
entry.isHmrAccepted = true;
entry.isHmrEnabled = true;
```

这两个是特殊标志。

**依赖处理部分**

这个部分也是热更新最重要的部分，决定着热更新的更新范围。你可能会比较懵，热更新又设计依赖收集了呢？不急先听我道来。

例如我们有以下结构

```
./
├── index.js
└── src
    ├── a.js
    └── b.js
```

`index.js` 引入` a.js` ,` a.js` 引入` b.js` 。

这个时候我们修改 `b.js` ，如果我们不依赖分析，那么我们会一股脑儿去刷新 `index.js` ，因为只要`index.js`重新载入 ，那么我们 `a.js` 和 `b.js` 也会被重新导入，从而达到 `b.js` 也更新的效果。

而我们有时候期望更新点达到最小化，`b.js` 更新，我不期望整个应用去更新。我们只需要找到 `b.js` 从属的 `a.js` 更新就好了。

以下用图形化来解释，b.js 更新冒泡到 index.js 是我们所不期望。

![image-20201011165628322](https://s3.qiufengh.com/blog/image-20201011165628322.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

而` b.js` 的修改冒泡到 `a.js` 是我们所期望的。

![image-20201011165727732](https://s3.qiufengh.com/blog/image-20201011165727732.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

而`b.js` 冒泡到 `a.js`是我们所期望的。

以上我们讲清楚了，为什么需要这个第三部分。

那么我们来讲讲这个第三部分依赖关系是怎么样的。

由于这个依赖关系的调用是在构建阶段，因此我们这边不会去讲构建阶段相关信息。我们就单从这几个函数来进行推测模拟。我们可以将`createEntry`,`getEntry`,`setEntry`,`removeRelationship`,`addRelationship`这些依赖相关的函数都搜一下，最终我们会发现源头来源于 `setEntry`,因此我们就可以把这个函数当做入口。

```js
setEntry(sourceUrl: string, imports: string[], isHmrEnabled = false) {
    const result = this.getEntry(sourceUrl, true)!;
    const outdatedDependencies = new Set(result.dependencies);
    result.isHmrEnabled = isHmrEnabled;
    for (const importUrl of imports) {
      this.addRelationship(sourceUrl, importUrl);
      outdatedDependencies.delete(importUrl);
    }
    for (const importUrl of outdatedDependencies) {
      this.removeRelationship(sourceUrl, importUrl);
    }
}
```

为了方便理解，我们会用例子带着来理解，还记得一开始的例子吗。将上述代码经过解析就是如下模样。

```
sourceUrl: /_dist_/index.js
imports: [ '/__snowpack__/hmr.js',
  '/__snowpack__/env.js',
  '/web_modules/vue.js',
  '/_dist_/App.js' ]
isHmrEnabled: true
```

这样理解起来是不是非常的容易呢？源码为什么难懂，只是因为源码代码量太大，我们没办法一下记住那么多个变量以及流程。如果我们肉眼直接能看出某些变化，那源码阅读就很简单了。好了我们接着讲。

首先是通过 `this.getEntry` 去获取当前路径资源的依赖实例，如果没有找到则会去创建一个实例。依赖实例初始化长这个样子。

```js
const newEntry: Dependency = {
      dependencies: new Set(),
      dependents: new Set(),
      needsReplacement: false,
      needsReplacementCount: 0,
      isHmrEnabled: false,
      isHmrAccepted: false,
};
```

接下来就会会遍历 `imports` 建立依赖关系。

这个时候我们会发现有这么个步骤

```js
const outdatedDependencies = new Set(result.dependencies);
result.isHmrEnabled = isHmrEnabled;
for (const importUrl of imports) {
  this.addRelationship(sourceUrl, importUrl);
  outdatedDependencies.delete(importUrl);
}
for (const importUrl of outdatedDependencies) {
  this.removeRelationship(sourceUrl, importUrl);
}
```

这个是在做什么呢。这里主要是讲老的依赖进行删除，然后增加新的依赖，类似于一个简版 `diff`。

![image-20201011192628620](https://s3.qiufengh.com/blog/image-20201011192628620.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

例如我们的 `index.js` 旧的依赖的是  

```
[ '/__snowpack__/hmr.js',
  '/__snowpack__/env.js',
  '/web_modules/vue.js',
  '/_dist_/App.js' ]
```

新的依赖为

```
[ '/__snowpack__/env.js',
  '/web_modules/vue.js',
  '/_dist_/Demo.js' ]
```

那么就会加入 `'/_dist_/Demo.js'` 删减 `'/__snowpack__/hmr.js'`、`'/_dist_/App.js'`。



我们已经和前端建立了联系，那么，什么时候去发送消息呢？这个时候我们就要来看看，我们的文件监听模块。

https://github.com/pikapkg/snowpack/blob/f1fd2cb181c1fe6ce2f158159a6fc3191e7456b4/snowpack/src/commands/dev.ts#L901

`const chokidar = await import('chokidar');`作者主要用来了 `chokidar` 来进行监听本地文件的改动。这个库能够高性能地去使用文件监听。

![image-20201011194330922](https://s3.qiufengh.com/blog/image-20201011194330922.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

像 `VS Code`、`gulp`、`karma`、`pm2`、`webpack` 监听文件改动也是使用了这个库。

```js
	async function onWatchEvent(fileLoc) {
    logger.info(colors.cyan('File changed...'));
    handleHmrUpdate(fileLoc);
    inMemoryBuildCache.delete(fileLoc);
    filesBeingDeleted.add(fileLoc);
    await cacache.rm.entry(BUILD_CACHE, fileLoc);
    filesBeingDeleted.delete(fileLoc);
  }
  const watcher = chokidar.watch(
    mountedDirectories.map(([dirDisk]) => dirDisk),
    {
      ignored: config.exclude,
      persistent: true,
      ignoreInitial: true,
      disableGlobbing: false,
    },
  );
  watcher.on('add', (fileLoc) => onWatchEvent(fileLoc));
  watcher.on('change', (fileLoc) => onWatchEvent(fileLoc));
  watcher.on('unlink', (fileLoc) => onWatchEvent(fileLoc));
```

如果文件改动了、增加、删除，都会触发 `onWatchEvent` 这个事件。

```js
async function onWatchEvent(fileLoc) {
    logger.info(colors.cyan('File changed...'));
    handleHmrUpdate(fileLoc);
    inMemoryBuildCache.delete(fileLoc);
    filesBeingDeleted.add(fileLoc);
    await cacache.rm.entry(BUILD_CACHE, fileLoc);
    filesBeingDeleted.delete(fileLoc);
}
```

我们先来看看`handleHmrUpdate` 这个函数。

```js
function handleHmrUpdate(fileLoc: string) {
    if (isLiveReloadPaused) {
      return;
    }
    let updateUrl = getUrlFromFile(mountedDirectories, fileLoc, config);
    if (!updateUrl) {
      return;
    }

    // Append ".proxy.js" to Non-JS files to match their registered URL in the client app.
    if (!updateUrl.endsWith('.js')) {
      updateUrl += '.proxy.js';
    }
    // Check if a virtual file exists in the resource cache (ex: CSS from a Svelte file)
    // If it does, mark it for HMR replacement but DONT trigger a separate HMR update event.
    // This is because a virtual resource doesn't actually exist on disk, so we need the main
    // resource (the JS) to load first. Only after that happens will the CSS exist.
  // 检查资源缓存中是否存在一个虚拟文件（例如：来自Svelte文件的CSS），如果存在，将其标记为HMR替换，但不要触发一个单独的HMR更新事件。资源（JS）先加载。只有在这之后，CSS才会存在。
  // 为什么呢？因为资源只有在请求 .vue 这样的文件找到后，才会进行构建生成新的 css。

    const virtualCssFileUrl = updateUrl.replace(/.js$/, '.css');
    const virtualNode = hmrEngine.getEntry(`${virtualCssFileUrl}.proxy.js`);
    if (virtualNode) {
      hmrEngine.markEntryForReplacement(virtualNode, true);
    }
    // If the changed file exists on the page, trigger a new HMR update.
    if (hmrEngine.getEntry(updateUrl)) {
      updateOrBubblejs(updateUrl, new Set());
      return;
    }
   	if (inMemoryBuildCache.has(fileLoc)) {
      hmrEngine.broadcastMessage({type: 'reload'});
      return;
    }
}
```

其中又涉及到 `getUrlFromFile` ,这个函数的作用是，将本地的文件，映射到网络的 url 。例如 本地 `src/App.vue` 映射到 `_dist_/App.js`。然后接下来步骤是尝试看看当前路径是否为虚拟文件（所谓虚拟文件就是不实际存在，是一种 hack 的形式，例如 ES Modules 无法直接导入 css 等文件）。如果是虚拟文件的话，作一个标记，等下载虚拟文件的承载实体请求到的时候，再进行更新。如果不是上述情况，那么继续运行下面的步骤，如果在热更新模块中能找到当前的构建 url，则调用 `updateOrBubblejs` 。

这个函数就和它的字面意思一样，会往上冒泡，如果当前模块没有注册热更新模块，那么该模块会往上找他的父级，如果父级找不到就会找爷爷级。那么为什么会有这样的冒泡呢？原因我们在说热更新依赖的时候说了，最小化就近更新原则。如果找不到的话会调用 `hmrEngine.broadcastMessage({type: 'reload'});`， 就是刷新整个页面。` handleHmrUpdate` 函数最后也是如此，也会调用 `hmrEngine.broadcastMessage({type: 'reload'});`

最后清空当前文件的缓存，能够让下次请求的时候重新构建，而不是寻找缓存模块。

```js
inMemoryBuildCache.delete(fileLoc);
filesBeingDeleted.add(fileLoc);
await cacache.rm.entry(BUILD_CACHE, fileLoc);
filesBeingDeleted.delete(fileLoc);
```

至此热更新的所有模块都讲完了。





前端  ->  后端   ->  文件改动  -> 后端监听 -> 通知前端

