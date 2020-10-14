# 谈谈React 5种最流行的状态管理库

> 原文地址: https://dev.to/dabit3/react-state-6-ways-2bem
> 作者: Nader Dabit
> 译者: 蓝色的秋风（github.com/hua1995116）

代码仓库地址: https://github.com/dabit3/react-state-5-ways

在 React 中，似乎有无数种处理状态管理的方法。 想要了解各种库，去比较它们之间的如何选择以及它们如何原作都是一件令人头疼的事情。

当我尝试学习一些东西时，比较喜欢去比较那些实现相同功能的库，这有助于我理解各种库之间的差异，并且能够形成一个自己在构建应用的时候如何选择使用它们的思维模型。

在本文中，我将一一介绍如何在 React App 中使用 5 种最流行的库/APIS（使用最现代和最新版本的库）如何在 React App程序中使用全局状态管理，并且达到一样的效果。

1. [Recoil](https://dev.to/dabit3/react-state-6-ways-2bem?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email#recoil)
2. [MobX](https://dev.to/dabit3/react-state-6-ways-2bem?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email#mobx)
3. [XState](https://dev.to/dabit3/react-state-6-ways-2bem?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email#xstate)
4. [Redux (with hooks)](https://dev.to/dabit3/react-state-6-ways-2bem?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email#redux)
5. [Context](https://dev.to/dabit3/react-state-6-ways-2bem?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email#context)

我还将试着解释它们之间的差异，本文以 概述 - 代码 - 结论的方式讲解。

为了演示 APIS，我们将使用这些库来做一个`如何创建和展示笔记`的应用。

## 入门

如果你准备好了，那么请先创建一个新的 React App，我们将使用它来开始我们的实践：

```
npx create-react-app react-state-examples

cd react-state-examples
```

无论何时何地，使用 `start` 命令启动你的命令。

```
npm start
```

## Recoil

[Recoil Docs](https://recoiljs.org/)

代码行数:30

我最喜欢 Recoil 的点是因为它基于 Hooks 的 API 以及它的直观性。

与其他一些库相比，我想说 Recoil 的和 API 比大多数库更容易。

### Recoil 实践

开始使用`Recoil`前，先安装依赖：

```bash
npm install recoil
```

接下来，将 `RecoilRoot` 添加到 App 程序的根/入口点：

```js
import App from './App'
import { RecoilRoot } from 'recoil'

export default function Main() {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}
```

下一步，要创建一些状态，我们将使用来自Recoil 的 `atom` 并设置`key`和一些初始状态：

```js
import { atom } from 'recoil'

const notesState = atom({
  key: 'notesState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial state)
});
```

现在，你可以在你app的任何位置使用来自 Recoil 的`useRecoilState`。 这是使用 Recoil 实现的笔记 App：

```js
import React, { useState } from 'react';
import { RecoilRoot, atom, useRecoilState } from 'recoil';

const notesState = atom({
  key: 'notesState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial state)
});

export default function Main() {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}

function App() {
  const [notes, setNotes] = useRecoilState(notesState);
  const [input, setInput] = useState('')
  function createNote() {
    const notesArray = [...notes, input]
    setNotes(notesArray)
    setInput('')
  }
  return (
    <div>
      <h1>My notes app</h1>
      <button onClick={createNote}>Create Note</button>
      <input value={input} onChange={e => setInput(e.target.value)} />
      { notes.map(note => <p key={note}>Note: {note}</p>) }
    </div>
  );
}
```

**Recoil selectors**

来自文档

> selectors 用于计算基于 state 的派生属性。 这能让我们避免冗余 state，通常无需使用 reducers 来保持状态同步和有效。 相反，最小状态集存储在 atoms 中。

使用 Recoil selectors，你可以根据 state 计算派生属性，例如，可能是已过滤的待办事项数组（在todo app 中）或已发货的订单数组（在电子商务应用程序中）：

```js
import { selector, useRecoilValue } from 'recoil'

const completedTodosState = selector({
  key: 'todosState',
  get: ({get}) => {
    const todos = get(todosState)
    return todos.filter(todo => todo.completed)
  }
})

const completedTodos = useRecoilValue(completedTodosState)
```

### 结论

recoil 文档说："Recoil 是一个用于 React 状态管理的实验性使用工具集。" 当我决定在生产环境中使用库时，听到"实验性"可能会非常担心，所以至少在此刻，我不确定我现在对使用 Recoil 的感觉如何 。

Recoil 很棒，我会为我的下一个 app 使用上它，但是担心实验性属性，因此我将密切关注它，但现在不将它用于生产中。

## Mobx

[MobX React Lite Docs](https://github.com/mobxjs/mobx-react-lite)

代码行数: 30

因为我在使用 Redux 之后使用了MobX React， 所以它一直是我最喜欢的管理 React 状态库之一。 多年来，两者之间的明显差异，但是对我而言我不会改变我的选择。

MobX React 现在有一个轻量级版本（MobX React Lite），这个版本专门针对函数组件而诞生，它的有点是速度更快，更小。

MobX 具有可观察者和观察者的概念，然而可观察的API有所改变，那就是不必指定希望被观察的每个项，而是可以使用 `makeAutoObservable` 来为你处理所有事情。

如果你希望数据是响应的并且需要修改 store ，则可以用`observer`来包装组件。

### MobX 实践

开始使用`Mobx`前，先安装依赖：

```
npm install mobx mobx-react-lite
```

该应用的状态已在 Store 中创建和管理。

我们应用的 store 如下所示：

```js
import { makeAutoObservable } from 'mobx'

class NoteStore {
  notes = []
  createNote(note) {
    this.notes = [...this.notes, note]
  }
  constructor() {
    /* makes all data in store observable, replaces @observable */
    makeAutoObservable(this)
  }
}

const Notes = new NoteStore()
```

然后，我们可以导入`notes`，并在 app 中的任何位置使用它们。 要使组件是可观察修改，需要将其包装在`observer`中：

```js
import { observer } from 'mobx-react-lite'
import { notes } from './NoteStore'

const App = observer(() => <h1>{notes[0]|| "No notes"}</h1>)
```

让我们看看它们如何一起运行的：

```js
import React, { useState } from 'react'
import { observer } from "mobx-react-lite"
import { makeAutoObservable } from 'mobx'

class NoteStore {
  notes = []
  createNote(note) {
    this.notes = [...this.notes, note]
  }
  constructor() {
    makeAutoObservable(this)
  }
}

const Notes = new NoteStore()

const App = observer(() => {
  const [input, setInput] = useState('')
  const { notes } = Notes
  function onCreateNote() {
    Notes.createNote(input)
    setInput('')
  }
  return (
    <div>
      <h1>My notes app</h1>
      <button onClick={onCreateNote}>Create Note</button>
      <input value={input} onChange={e => setInput(e.target.value)} />
      { notes.map(note => <p key={note}>Note: {note}</p>) }
    </div>
  )
})

export default App
```

### 总结

MobX 已经诞生了一段时间，它很好用。 与许多其他公司一样，我在企业公司的大量线上应用中使用了它。

最近再次使用它之后的感受是，与其他一些库相比，我觉得文档略有不足。 我会自己再尝试一下，然后再做决定。

## XState

[XState Docs](https://xstate.js.org/docs/packages/xstate-react/)

代码行数:44

XState 试图解决现代UI复杂性的问题，并且依赖于[有限状态机](https://en.wikipedia.org/wiki/Finite-state_machine)的思想和实现。

XState 是由 [David Khourshid](https://twitter.com/DavidKPiano), 创建的，自发布以来，我就看到过很多关于它的讨论，所以我一直在观望。 这是在写本文之前唯一不熟悉的库。

在使用之后，我可以肯定地说它的实现方式是与其他库截然不同的。 它的复杂性比其他任何一种都要高，但是关于状态如何工作的思维模型确实很 cool 而且对于提高能力很有帮助，在用它构建一些 demo app 之后，让我感到它很精妙。

> 要了解有关 XState 试图解决的问题的更多信息，请查看David Khourshid的[这段视频](https://www.youtube.com/watch?v=RqTxtOXcv8Y)或我也发现有趣的[帖子](https://dev.to/hectorleiva/how-writing-state-machines-made-me-feel-like-a-programmer-2ndc)。

XState 在这里的使用不是特别好，因为它更适合在更复杂的状态下使用，但是这个简短的介绍至少可以希望为你提供一个选择，以帮助你全面了解其工作原理。

### XState实践

要开始使用XState，请安装这些库：

```bash
npm install xstate @xstate/react
```

要创建`machine`，请使用`xstate`中的`Machine`实用程序。 这是我们将用于 Notes app 的`machine`：

```js
import { Machine } from 'xstate'

const notesMachine = Machine({
  id: 'notes',
  initial: 'ready',
  context: {
    notes: [],
    note: ''
  },
  states: {
    ready: {},
  },
  on: {
    "CHANGE": {
      actions: [
        assign({
          note: (_, event) => event.value
        })
      ]
    },
    "CREATE_NOTE": {
      actions: [
        assign({
          note: "",
          notes: context => [...context.notes, context.note]
        })
      ]
    }
  }
})
```

我们将使用的数据存储在 `context` 中。 在这里，我们有一个 notes 列表 和一个 input 输入框。 有两种操作，一种用于创建 note（CREATE_NOTE），另一种用于设置 input（CHANGE）。

整个示例：

```js
import React from 'react'
import { useService } from '@xstate/react'
import { Machine, assign, interpret } from 'xstate'

const notesMachine = Machine({
  id: 'notes',
  initial: 'ready',
  context: {
    notes: [],
    note: ''
  },
  states: {
    ready: {},
  },
  on: {
    "CHANGE": {
      actions: [
        assign({
          note: (_, event) => event.value
        })
      ]
    },
    "CREATE_NOTE": {
      actions: [
        assign({
          note: "",
          notes: context => [...context.notes, context.note]
        })
      ]
    }
  }
})

const service = interpret(notesMachine).start()

export default function App() {
  const [state, send] = useService(service)
  const { context: { note, notes} } = state

  return (
    <div>
      <h1>My notes app</h1>
      <button onClick={() => send({ type: 'CREATE_NOTE' })}>Create Note</button>
      <input value={note} onChange={e => send({ type: 'CHANGE', value: e.target.value})} />
      { notes.map(note => <p key={note}>Note: {note}</p>) }
    </div>
  )
}
```

要在应用中修改状态，我们使用 `xstate-react` 中的 useService hooks。

### 总结

`XState` 就像劳斯莱斯 或者说 状态管理的瑞士军刀。 可以做很多事情，但是所有功能都带来额外的复杂性。

我希望将来能更好地学习和理解它，这样我就可以将它应用到 AWS 的相关问题和参考它的架构，但是对于小型项目，我认为这可能它太过庞大。

## Redux

[React Redux docs](https://react-redux.js.org/)

代码行数:33

Redux 是整个 React 生态系统中最早，最成功的状态管理库之一。 我已经在许多项目中使用过Redux，如今它依然很强大。

新的 Redux Hooks API 使 redux 使用起来不再那么麻烦，而且使用起来也更容易。

Redux Toolkit 还改进了 Redux，并大大降低了学习曲线。

### Redux 实践

开始使用`Redux`前，先安装依赖：

```
npm install @reduxjs-toolkit react-redux
```

要使用 Redux，您需要创建和配置以下内容：

1. A store
2. Reducers
3. A provider

为了帮助解释所有这些工作原理，我在实现 Redux 中的 Notes app 的代码中做了注释：

```js
import React, { useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { configureStore, createReducer, combineReducers } from '@reduxjs/toolkit'

function App() {  
  const [input, setInput] = useState('')

  /* useSelector 允许你检索你想使用的状态，在我们的例子中是notes数组。 */
  const notes = useSelector(state => state.notes)

  /* dispatch 允许我们向 store 发送更新信息 */
  const dispatch = useDispatch()

  function onCreateNote() {
    dispatch({ type: 'CREATE_NOTE', note: input })
    setInput('')
  }
  return (
    <div>
      <h1>My notes app</h1>
      <button onClick={onCreateNote}>Create Note</button>
      <input value={input} onChange={e => setInput(e.target.value)} />
      { notes.map(note => <p key={note}>Note: {note}</p>) }
    </div>
  );
}

/* 在这里，我们创建了一个 reducer，它将在`CREATE_NOTE`动作被触发时更新note数组。 */
const notesReducer = createReducer([], {
  'CREATE_NOTE': (state, action) => [...state, action.note]
})

/* Here we create the store using the reducers in the app */
const reducers = combineReducers({ notes: notesReducer })
const store = configureStore({ reducer: reducers })

function Main() {
  return (
    /* 在这里，我们使用app中的reducer来创建store。 */
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Main
```

### 总结

如果你正在寻找一个具有庞大社区、大量文档以及大量问答的库，那么Redux是一个非常靠谱的选择。 因为它已诞生了很长时间，你只要在 Google 搜索，或多或少都能找到一些相关的答案。

在使用异步操作（例如数据获取）时，通常需要添加其他中间件，这会增加它的成本和复杂性。

对我来说，Redux 起初很难学习。 一旦我熟悉了框架，就可以很容易地使用和理解它。 过去，对于新开发人员而言，有时会感到不知所措，但是随着 Redux Hooks 和 Redux Toolkit 的改进，学习过程变得容易得多，我仍然强烈建议 Redux 作为前置的选择。

## Context

[Context docs](https://reactjs.org/docs/hooks-reference.html#usecontext)

代码行数: 31

context 的优点在于，不需要安装和依赖其他库，它是 React 的一部分。

使用 context 非常简单，当你尝试管理大量不同的 context 值时，问题通常会出现在一些大或者复杂的应用程序中，因此你通常必须构建自己的抽象来自己管理这些情况。

### Context 实践

要创建和使用 context ，请直接从React导入钩子。 下面是它的工作原理：

```js
/* 1. Import the context hooks */
import React, { useState, createContext, useContext } from 'react';

/* 2. Create a piece of context */
const NotesContext = createContext();

/* 3. Set the context using a provider */
<NotesContext.Provider value={{ notes: ['note1', 'note2'] }}>
  <App />
</NotesContext.Provider>

/* 4. Use the context */
const { notes } = useContext(NotesContext);
```

全部代码

```js
import React, { useState, createContext, useContext } from 'react';

const NotesContext = createContext();

export default function Main() {
  const [notes, setNotes] = useState([])
  function createNote(note) {
    const notesArray = [...notes, note]
    setNotes(notesArray)
  }
  return (
    <NotesContext.Provider value={{ notes, createNote }}>
      <App />
    </NotesContext.Provider>
  );
}

function App() {
  const { notes, createNote } = useContext(NotesContext);
  const [input, setInput] = useState('')
  function onCreateNote() {
    createNote(input)
    setInput('')
  }

  return (
    <div>
      <h1>My notes app</h1>
      <button onClick={onCreateNote}>Create Note</button>
      <input value={input} onChange={e => setInput(e.target.value)} />
      { notes.map(note => <p key={note}>Note: {note}</p>) }
    </div>
  );
}

```

### 总结

context 是一种管理 app 状态的真正可靠且直接的方法。 它的API可能不如其他一些库那么好，但是如果你了解如何使用它，并且可以在你的 app 中使用它创建正确的数据抽象，那么选择 context 来管理你的全局状态就不会错。

