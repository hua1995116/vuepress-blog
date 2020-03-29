# 函数式编程看React Hooks(一)简单React Hooks实现

[函数式编程看React Hooks(一)简单React Hooks实现](./)

[函数式编程看React Hooks(二)事件绑定副作用深度剖析](/blog/article/han-shu-shi-bian-cheng-kan-ReactHooks%28-er-%29-shi-jian-bang-ding-fu-zuo-yong-shen-du-pou-xi-/)

## 前言

函数式编程介绍（摘自基维百科）

> 函数式编程（英语：functional programming）或称函数程序设计、泛函编程，是一种编程范式，它将计算机运算视为函数运算，并且避免使用程序状态以及易变对象。其中，λ演算（lambda calculus）为该语言最重要的基础。而且，λ演算的函数可以接受函数当作输入（引数）和输出（传出值）。

面向对象编程介绍（摘自基维百科）

> 面向对象程序设计（英语：Object-oriented programming，缩写：OOP）是种具有对象概念的程序编程典范，同时也是一种程序开发的抽象方针。它可能包含数据、属性、代码与方法。对象则指的是类的实例。它将对象作为程序的基本单元，将程序和数据封装其中，以提高软件的重用性、灵活性和扩展性，对象里的程序可以访问及经常修改对象相关连的数据。在面向对象程序编程里，计算机程序会被设计成彼此相关的对象

函数式强调在逻辑处理中不变性。面向对象通过消息传递改变每个Object的内部状态。两者是截然不同的编程思想，都具有自己的优势，也因为如此，才使得我们从 `class 组件` 转化到 `函数组件式`，有一些费解。

从 react 的变化可以看出，react 走的道路越来越接近于函数式编程，输入输出一致性。当然也不是凭空地去往这个方面，而是为了能够解决更多的问题。以下 三点是 react 官网所提到的 hooks 的动机 https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation

- 代码重用：在hooks出来之前，常见的代码重用方式是 HOC 和render props，这两种方式带来的问题是：你需要解构自己的组件，同时会带来很深的组件嵌套
- 复杂的组件逻辑：在class组件中，有许多的lifecycle 函数，你需要在各个函数的里面去做对应的事情。这种方式带来的痛点是：逻辑分散在各处，开发者去维护这些代码会分散自己的精力，理解代码逻辑也很吃力
- class组件的困惑：对于初学者来说，需要理解class组件里面的this是比较吃力的，同时，基于class的组件难以优化。

本文是为了给后面一篇文章作为铺垫，因为在之后文章的讲解过程中，你如果了理解了 React Hooks 的原理，再加上一步一步地讲解，你可能会对 React Hooks 中各种情况会恍然大悟。

一开始的时候觉得 hooks 非常地神秘，写惯了 class 式的组件后，我们的思维就会定格在那里，生命周期，state，this等的使用。 因此会以 class 编写的模式去写函数式组件，导致我们一次又一次地爬坑，接下来我们就开始我们的实现方式讲解。（提示：以下是都只是一种简单的模拟方法，与实际有一些差别，但是核心思想是一致的）

## 开始

我们先写一个简单的 react 函数式组件。

```javascript
function Counter(count) {
  return (
    <div>
      <div>{count}</div>
      <button>
        点击
      </button>
    </div>
  );
}
```

在 React Hooks 还未出现的时候，我们的组件大多用来直接渲染，不含有状态存储，Function组件没有state，所以也叫SFC（stateless functional component），现在更新叫做FC（functional component）。

为了使得一个函数内有状态，react 使用了一个特别的方法就是 hooks， 其实这是利用闭包实现的一个类似作用域的东西去存储状态，我第一想到的就是利用对象引用存储数据，就像是面向对象一样的方式，存在一个对象中中，通过引用的方式来进行获取。但是 react 为了能够尽可能地分离状态，精妙地采用了闭包。

让我们看看他是如何实现的。(为了尽可能简化，我进行了改编)

### useState

```javascript
let _state;
function useState(initialState) {
	_state = _state || initialState; // 如果存在旧值则返回， 使得多次渲染后的依然能保持状态。
  function setState(newState) {
    _state = newState;
    render();  // 重新渲染，将会重新执行 Counter
  }
  return [_state, setState];
}
```

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>
        点击
      </button>
    </div>
  );
}
```

演示地址： https://codesandbox.io/s/dawn-bash-rqqoh

以上，不管 Counter 重新渲染多少次，通过闭包，依然能够访问到最新的 state，从而达到了存储状态的效果。

### useEffect

再看看 useEffect， 先来看看使用方法。 `useEffect(callback, dep?)`, 以下是一个非常简单的使用例子。

```javascript
  useEffect(() => {
      console.log(count);
  }, [count]);
```

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count]);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>
        点击
      </button>
    </div>
  );
}
```

因为函数式不像 class 那样有复杂的生命周期，已经对 hooks 已经熟悉使用的你，可能会知道 `useEffect` 可以当做，`componentdidmount` 来使用。但是在这里你直接将他按照顺序执行。在 `return` 前他会执行。

```javascript
let _deps = {
  args: []
}; // _deps 记录 useEffect 上一次的 依赖
function useEffect(callback, args) {
  const hasChangedDeps = args.some((arg, index) => arg !== _deps.args[index]); // 两次的 dependencies 是否完全相等
  // 如果 dependencies 不存在，或者 dependencies 有变化
  if (!_deps.args || hasChangedDeps) {
    callback();
    _deps.args = args;
  }
}
```
演示地址： https://codesandbox.io/s/ecstatic-glitter-w9kq7

至此，我们也实现了单个 useEffect。

### useMemo

我们再来看看， useMemo，其实他也以上实现的方式一样，也是通过闭包来进行存储数据, 从而达到缓存提高性能的作用。

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const computed = () => {
    console.log('我执行了');
    return count * 10 - 2;
  }
  const sum = useMemo(computed, [count]);
  return (
    <div>
      <div>{count} * 10 - 2 = {sum}</div>
      <button onClick={() => setCount(count + 1)}>
        点击
      </button>
    </div>
  );
}
```

接下来我们来进行实现

```javascript
let _deps = {
  args: []
}; // _deps 记录 useMemo 上一次的 依赖
function useMemo(callback, args) {
  const hasChangedDeps = args.some((arg, index) => arg !== _deps.args[index]); // 两次的 dependencies 是否完全相等
  // 如果 dependencies 不存在，或者 dependencies 有变化
  if (!_deps.args || hasChangedDeps) {
    _deps.args = args;
    _deps._callback = callback;
    _deps.value = callback();
    return _deps.value;
  }

  return _deps.value;
}
```

演示地址： https://codesandbox.io/s/festive-platform-v04xw

### useCallback

那么 `useCallback` 呢？ 其实就是 `useMemo` 的一个包装，毕竟你缓存函数的返回值，那么我我让返回值为一个函数不就行了？

```javascript
function useCallback(callback, args) {
	return useMemo(() => callback, args);
}
```

可以看到，以上我们也轻松地实现了 useMemo 。但是有一个问题，以上只是单个函数使用方式，所以接下来我们还需要处理一下多个函数的情况。


### 完整版

我们可以按照 [preact](https://github.com/preactjs/preact/blob/master/hooks/src/index.js) 的方法来实现。即用数组来实现多个函数的处理逻辑。

核心逻辑就是

- 第一次声明的时候将 useState, useEffect, useMemo, useCallback 等钩子函数的状态依次存入数组。

- 更新的时候，将前一次的函数状态值依次取出。

也可以通过以下图来理解

第一次渲染，将每个状态都缓存到数组中。
![first-render.png](https://s3.qiufengh.com/blog/first-render.png)

每次重新渲染，获取数组中每个的缓存状态。
![re-render.png](https://s3.qiufengh.com/blog/re-render.png)

以下为了能够清晰地让大家明白原理，进行了一些删减。但是核心逻辑不变。

```javascript
let currentIndex = 0;
let currentComponent = {
  __hooks: []
};
function getHookState(index) {
  const hooks = currentComponent.__hooks;
  if (index >= hooks.length) {
    hooks.push({});
  }
  return hooks[index];
}

function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

function useState(initialState) {
  const hookState = getHookState(currentIndex++);
  hookState._value = [
    hookState._value ? hookState._value[0] : initialState,
    function setState(newState) {
      hookState._value[0] = newState;
      render(); // 重新渲染，将会重新执行 Counter
    }
  ];

  return hookState._value;
}

function useEffect(callback, args) {
  const state = getHookState(currentIndex++);
  if (argsChanged(state._args, args)) {
    callback();
    state._args = args;
    render();
  }
}

function useMemo(callback, args) {
  const state = getHookState(currentIndex++);
  if (argsChanged(state._args, args)) {
    state._args = args;
    state._callback = callback;
    state.value = callback();
    return state.value;
  }

  return state.value;
}
```

现在用以上 43 行代码实现了一个简易的 React Hooks。

## 完整渲染过程

我们再通过一次整体的流程图来讲解完整版的实现。

https://codesandbox.io/s/loving-blackburn-o7g8g

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState("Rudi");

  const computed = () => {
    return count * 10 - 2;
  };
  const sum = useMemo(computed, [count]);

  useEffect(() => {
    console.log("init");
  }, []);
  return (
    <div>
      <div>
        {count} * 10 - 2 = {sum}
      </div>
      <button onClick={() => setCount(count + 1)}>点击</button>
      <div>{firstName}</div>
      <button onClick={() => setFirstName("Fred")}>Fred</button>
    </div>
  );
}
```

### 初始化

![1-初始化.png](https://s3.qiufengh.com/blog/1-初始化.png)

###  第一次渲染

将所有的状态都存进闭包中。

![1-第一次渲染.png](https://s3.qiufengh.com/blog/1-第一次渲染.png)

### 事件触发

改变了第二个状态的value值。

![1-事件触发.png](https://s3.qiufengh.com/blog/1-事件触发.png)

### 第二次渲染

将所有状态依次取出，进行渲染。

![1-第二次渲染.png](https://s3.qiufengh.com/blog/1-第二次渲染.png)


## 后记

通过以上的实现，我们也可以明白一些 React Hooks 中看似有点奇怪的规定了。例如为什么不要在循环、条件判断或者子函数中调用？ 因为顺序很重要，我们将缓存（状态）按一定地顺序压入数组，所以取出上一次状态，也必须以同样的顺序去获取。否则的话，会导致获取不一致的情况。。。当然我们可以试想一下，如果每个状态单元，可以有唯一的名字，那么将不会受到这些规定的约束。但是这样会使得开发带来额外的传入参数，就是唯一的名字。也会带来名字冲突等问题，因此采用这样的方式来约定，一定程度上简化了开发者的开发成本，并且也能够消除不一致性。（ps: 如果有人有兴趣，可以实现一版不依赖于顺序，只依赖于名字的，当做小玩具~）

当然真实中的 react 是利用了单链表来代替数组的。略微有些不一样，但是本质的思路是一致的，以及 useEffect 是每次渲染完成后运行的。

以上都是站在巨人的肩膀上（有很多优秀的文章，看参考），再加上查看一些源码得出的整个过程。最后，留出一个小问题给大家，那么每次 `useEffect` 中 `return 函数` 的逻辑又是怎么样的呢？欢迎评论区说出实现方式~ 如果文章有任何问题，也欢迎在评论区指出~ 

## 参考

https://github.com/brickspert/blog/issues/26

https://segmentfault.com/a/1190000019824818

https://www.zhihu.com/question/306916142

https://zh-hans.reactjs.org/docs/hooks-faq.html#can-i-skip-an-effect-on-updates

https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e

https://github.com/preactjs/

https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation