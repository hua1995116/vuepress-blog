# 函数式编程看React Hooks(二)事件绑定副作用深度剖析

[函数式编程看React Hooks(一)简单React Hooks实现](/blog/article/han-shu-shi-bian-cheng-kan-ReactHooks%28-yi-%29-jian-dan-ReactHooks-shi-xian-/)

[函数式编程看React Hooks(二)事件绑定副作用深度剖析](./)


本教程不讲解 React Hooks 的源码，只用最简单的方式来揭示 React Hooks 的原理和思想。 （我希望你看本文时，已经看过了上面一篇文章，因为本文会基于你已经了解部分 hooks 本质的前提下而展开的。例如你懂得 hooks 维护的状态其实是一个由闭包提供的。）

本文通过一个最近遇到了一个关于 React Hooks 的坑来展开讲解。一步一步地揭示如何更好地去理解 hooks，去了解函数式的魅力。

## 缘起
示例：https://codesandbox.io/s/brave-meadow-skl0o

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [isTag, setTag] = useState(false);

  const onMouseMove = e => {
    if (!isTag) {
      return;
    }
    setCount(count + 1);
  };

  const onMouseUp = e => {
    setTag(false);
  };

  const onMouseDown = e => {
    setTag(true);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="App">
      <h1 onMouseDown={onMouseDown}>hello world</h1>
      <h2>{count}</h2>
    </div>
  );
}
```

对于一些事件绑定复杂的逻辑，我之前是这么写的，为了演示效果，去除了一些复杂的业务逻辑。

可以看到在这个示例中，我们的 count 始终为 0。这是为什么呢？是 setCount 出问题了？百思不得其解，在我们写 class 类式编程时，这是一个很常见的编程习惯。为什么到了 hooks 这里却不行了呢？

我们需要注意的一点是，现在编写的是函数式组件，可以说是函数式编程 （虽然不完全是，但是是这样的味道）。函数式编程的特点就是无副作用，输入输出一致性。但是对于前端一些 Dom，Bom 等 API 来说，无副作用是不可能的，事件的绑定，定时器等等都，都是有副作用的。。所以，为了处理这一部分的逻辑，React Hooks 提供了 useEffect 这个钩子来处理。所以说，我们看到的所有一些奇奇怪怪的地方，效果和理想不一致的情况，最终原因就是这个编程模式转变后，出现的"后遗症"。如果我们用函数式的思想来理解，这些问题都将会迎刃而解。

现在起，请你抛弃 class 模式的写法和更新方式，我们单从函数逻辑的角度来进行讲解。我们来看看，当 App 函数第一次运行时候各个值的状态。

```javascript
function App() {
  const [count -> 0, setCount] = useState(0);
  const [isTag -> false, setTag] = useState(false);

  const onMouseMove = e => {
    if (!isTag -> false) {
      return;
    }
    setCount(count -> 0 + 1);
  };

  const onMouseUp = e => {
    setTag(false);
  };

  const onMouseDown = e => {
    setTag(true);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="App">
      <h1 onMouseDown={onMouseDown}>hello world</h1>
      <h2>{count -> 0}</h2>
    </div>
  );
}
```

我们第一次渲染过程中的 `document.addEventListener("mousemove", onMouseMove);` 中

onMouseMove 的形态就是这样的。
```javascript
const onMouseMove = e => {
    if (!false) {
      return;
    }
    setCount(0 + 1);
  };
```

`document.addEventListener("mouseup", onMouseUp);` 中
```javascript
const onMouseUp = e => {
    setTag(false);
  };
```

当我们鼠标点击 `hello world` 后，会依次运行 `onMouseDown`, `onMouseMove`, `onMouseUp` 函数。

先从 `onMouseDown` 说起，这个时候使用 `setTag` 设置了 `isTag` 的值，设置完成后，整个 App 函数会重新运行，即重新渲染。

此时 App 内函数的状态。（-> 此符号位标记当前的数值）

```javascript
function App() {
  const [count -> 0, setCount] = useState(0);
  const [isTag -> true, setTag] = useState(false);

  const onMouseMove = e => {
    if (!isTag -> true) {
      return;
    }
    setCount(isTag -> 0 + 1);
  };

  const onMouseUp = e => {
    setTag(false);
  };

  const onMouseDown = e => {
    setTag(true);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="App">
      <h1 onMouseDown={onMouseDown}>hello world</h1>
      <h2>{count -> 0}</h2>
    </div>
  );
}
```

这个时候可以看到，新一轮渲染中的 onMouseMove 已经更新了。但是呢，`document.addEventListener("mousemove", onMouseMove);` 我们事件监听绑定的事件还是原来的函数也就是以下这个形态。。

```javascript
  const onMouseMove = e => {
    if (!isTag -> false) {
      return;
    }
    setCount(count -> 0 + 1);
  };
```

因为，我们事件绑定一旦绑定后，函数是不会变化的。

接下来就是 `onMouseUp ` 这个时候 将 `isTag` 值设置成 `false`。也会触发 App 的重新运行。在 App 组件中  `onMouseMove` 的形态。

```javascript
  const onMouseMove = e => {
    if (!isTag -> false) {
      return;
    }
    setCount(count -> 0 + 1);
  };
```

我这么讲，你可能有点晕。但是没有关系，可以看图。

![event-mouse.png](https://s3.qiufengh.com/blog/event-mouse.png)


我之所以花费这么长的篇幅来讲解这个 `onMouseMove` 实际使用中的样子，就是想让你明白，千万不要被 class 的模式给误导了。不是说 `onMouseMove` 更新了，事件监听的回调函数也改变了。事件监听中的 `onMouseMove` 始终是我们第一次渲染的样子，（也就是 `isTag` 为 `false` 的样子）不会因为后面的变化去改变。

所以 `isTag` 始终为 `false`， `setCount` 一直无法执行。

面对这个情况，我们可以很自然地想到，如果我们能够重新绑定一下新的 `onMouseMove` ，那么问题不就迎刃而解了吗？也就是说。只要是我们在 `isTag` 更新的时候，重新去绑定事件监听中的回调函数  `onMouseMove`，就可以解决我们的问题。

所以 React Hooks，给 `useEffect` 提供了第二个参数，可以放入一个依赖数组。也就是说，当我们 `isTag` 更新的同时也去更新事件监听中的回调函数。

但是更新事件函数的前提是，得先解绑旧的函数，否则的话，将会重复绑定事件。因此，react 回调函数中也提供了 `return` 的方式，来提供解绑。。通过这样的描述我想大家应该也能理解为什么需要 `return 解绑函数` 了。。


所以上面为了能够使得我们的 `count` 能够正常更新的解决办法，就是 hooks 一直说到的，添加正确的依赖很重要，不要去欺骗他。。。

## 初探
现在是修复后的代码，添加正确的依赖。
```javascript
function App() {
  const [count, setCount] = useState(0);
  const [isTag, setTag] = useState(false);

  const onMouseMove = e => {
    if (!isTag) {
      return;
    }
    setCount(count + 1);
  };

  const onMouseUp = e => {
    setTag(false);
  };

  const onMouseDown = e => {
    setTag(true);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTag]);

  return (
    <div className="App">
      <h1 onMouseDown={onMouseDown}>hello world</h1>
      <h2>{count}</h2>
    </div>
  );
}
```

我们来看看现在事件的绑定中 回调函数的指向。每当 `isTag`  变化后，都会触发回调函数的更新。使得每次我们触发的 `onMouseMove` 都是最新的。

![render-mouse-new.png](https://s3.qiufengh.com/blog/render-mouse-new.png)

但是我们发现，我们点击移动的时候，不管怎么移动 count 只会增加 1。因为我们在添加依赖的时候，还需要对 count 也进行观察，因为每次 count 值变化，我们也得去更新绑定事件。


## 终结

我们继续修改

```javascript
  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTag, count]);
```

这个时候我们发现只要我们鼠标点击后， move 事件会不断地触发， `count` 也会不断地增加, 从而达到了我们的目的。

那么再来思考一个问题？每次这样一个事件绑定我们都得去寻找依赖项。。那么我们非常有可能忘记添加这个依赖，导致我们整个组件无法正常地运行。

幸好 react 给我提供了一个机制，那就是 `依赖项` 也接受函数。

```javascript
  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);
```

我们尝试一下，嗯，看似完美地解决了。但是我们会发现，哇，为什么重新渲染了那么多次？还记得我们 上一篇文章中，介绍 dep 比较的原理吗？直接对值进行的比较。也就是意味着函数对比的话，就是地址进行比较，显然，每次创建的函数地址都是不同的。（言外之意就是，每一次的重新渲染，都会导致 onMouseMove 的重新绑定，不单单是 `isTag`, `count` 两个值改变，每一个变量改变引起的重新渲染都会导致 onMouseMove 的更新）

那么我们要如何解决么？就要用到我们的 `useCallback` 了。用来缓存函数，在上一节中，我们也提到过实现原理。通过缓存来达到不创建新的函数。再来改造一下

```javascript
  const onMouseMove = useCallback(e => {
    if (!isTag) {
      return;
    }
    setCount(count + 1);
  }, [isTag, count]);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);
```

示例效果：https://codesandbox.io/s/friendly-bose-2kxet

## 顿悟

现在我们已经完美地解决了我们的问题，并且讲解了 hooks 的一些本质，为什么这么做的原理？我们再打上日志，来感受下，整个 hooks 的运行过程吧。

示例: https://codesandbox.io/s/heuristic-rhodes-gojl5

```javascript
function App() {
  console.log("开始运行");
  const [count, setCount] = useState(0);
  const [isTag, setTag] = useState(false);

  const onMouseMove = useCallback(
    e => {
      if (!isTag) {
        return;
      }
      setCount(count + 1);
    },
    [isTag, count]
  );

  const onMouseUp = e => {
    console.log("up");
    setTag(false);
  };

  const onMouseDown = e => {
    console.log("down");
    setTag(true);
  };

  useEffect(() => {
    console.log("绑定事件");
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      console.log("解绑事件");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);

  console.log("一轮结束");

  return (
    <div className="App">
      <h1 onMouseDown={onMouseDown}>hello world</h1>
      <h2>{count}</h2>
    </div>
  );
}
```

![1570364096642.jpg](https://s3.qiufengh.com/blog/1570364096642.jpg)

## 缘灭

此番 React Hooks 的探究到此结束。如有任何疑问或者改进，请评论区轰炸。

注意事项
1. 一定要添加观察依赖，否则 useEffect 中的函数都会执行一次，如果简单逻辑可能是无察觉的，但是如果是大量的逻辑以及事件绑定，会非常消耗资源。
2. 一定要添加正确的依赖。否则也会出现性能问题。


自己的一点点小的看法：

1.在某种程度上用性能来换取函数式编程的规范（虽然官方说这样处理的性能几乎不可计，我的意思是从写出差代码的概率，因为不是所有人都对 hooks 原理了如指掌。因此写出问题的依赖的概率非常大。）现在的解决方式是尽可能地添加 React Hooks 的 ESlint [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

2.非常佩服 react 团队的创造力，能想出这样的解决方法。毕竟是 浏览器 与 react 的编程模式是不一样，他们进行了最大程度上的融合。


## 参考

https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/

https://zhuanlan.zhihu.com/p/67183229

https://zhuanlan.zhihu.com/p/75146261

https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/

https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies

https://usehooks.com/useEventListener/