# React 条件渲染最佳实践(7 种方法)

> 译文来自 https://dev.to/syakirurahman/react-conditional-rendering-best-practices-with-7-different-methods-16e3#6_Conditional_Rendering_with_HOC
>
> 原作者 Syakir Rahman
>
> 译者: 蓝色的秋风(github/hua1995116)

在 React 中，条件渲染可以通过多种方式，不同的使用方式场景取决于不同的上下文。 在本文中，我们将讨论所有可用于为 React 中的条件渲染编写更好的代码的方法。

~~

条件渲染在每种编程语言（包括 javascript）中都是的常见功能。 在 javascript 中，我们通常使用`if else` 语句，`switch case`语句和三元运算符编写条件渲染。

以上所有这些方法都适用于 React。 但是问题是，我们如何才能有效地使用它们？

像你知道的那样，React 具有 `JSX` 标记，通常我们需要实现条件逻辑去控制组件。 但是，我们不能在 `JSX` 中直接使用常见的 `if else`或`switch case`语句。

在 JSX 中，我们应该使用其他条件渲染方法，例如三元运算符和&&运算符。 在这里，我们将讨论更多细节。

以下是我积累的 7 种条件渲染方法，它们可以在 React 中使用。 每种方式在一定的情况下都有自己的优势。

目录

- `If Else`条件渲染

- 使用三元运算符进行条件渲染

- &&运算符的条件渲染

- 带`switch case`多条件渲染

- 枚举对象的多条件渲染

- HOC(高阶组件)条件渲染

- 带有外部库的 JSX 条件渲染

## 1.`If Else`条件渲染

**最佳实践概述**

- 在 JSX 标记之外的任何地方使用

- 或者，如果你想在 if-else 块中执行多行代码

~~

这是所有程序员都能想到的第一个方法，即常见的 `if-else`语句。 我们可以在 React 项目中的任何地方使用它。

在 React 中，如果要在 if 或者 else 块内部或 JSX 外部的任何地方执行多行代码，最好使用通用的 if-else 语句。

例如，如果用户登录，我们想执行一些代码。

```js
// * Conditional rendering with common if-else statement.
if (isLoggedIn) {
  setUserProfile(userData);
  setUserHistory(userHistory);
  // other block of codes;
}
```

或者，当你想基于用户角色定义可访问的内容时。

```js
if (userProfile.role === "superadmin") {
  initSuperAdminFunction();
  initSuperAdminComponent();
  // other block of codes;
} else if (userProfile.role === "admin") {
  initAdminFunction();
  initAdminComponent();
  // other block of codes;
} else {
  initUserComponent();
  // other block of codes;
}
```

如果你只想执行一行代码，例如在 if 或 else 块中调用函数，则可以删除括号。

```js
if (userProfile.role === "superadmin") initSuperAdminComponent();
else if (userProfile.role === "admin") initAdminFunction();
else initUserComponent();
```

if-else 中不带括号的条件仅适用于其正下方的一行代码。

**JSX 中的 if else 语句**

你可能知道，我们可以在 JSX 中的方括号{}中注入和混合一些 javascript 代码。 但是它有一些局限性。

你不能直接向其中插入 if-else 语句。 在 JSX 中注入 if-else 语句仅适用于立即调用函数表达式（IIFE），如下所示：

```js
return (
  <div>
    {(() => {
      if (isLoggedIn) {
        return <div>I'm logged in.</div>;
      }
    })()}
  </div>
);
```

如你所见，仅 if 语句就太冗长了。 这就是为什么我不建议在 JSX 中使用 if-else 语句的原因。

继续阅读 JSX 中还有其他一些条件渲染的方法。

## 2. 使用三元运算符进行条件渲染

**最佳实践概览**

- 条件变量或函数返回值赋值

- 当你只想写一行代码来做条件判断

- 于 JSX 中的条件渲染

三元运算符是常见 if-else 语句的快捷方式。 使用三元运算符，你可以在行内编写条件渲染，也可以只编写一行代码。

让我们看一下条件渲染的变量值分配示例。

```js
// Conditional rendering with common if else
let isDrinkCoffee;
if (role === "programmer") {
  isDrinkCoffee = true;
} else {
  isDrinkCoffee = false;
}

// Conditional rendering with ternary operator
let isDrinkCoffee = role === "programmer" ? true : false;
```

这是函数返回值的条件渲染示例：

```js
// Conditional rendering with common if else
function isDrinkCoffee(role) {
  if (role === "programmer") {
    return true;
  } else {
    return false;
  }
}

// Conditional rendering with ternary operator
function isDrinkCoffee(role) {
  return role === "programmer" ? true : false;
}
```

如你所见， 你用了三元运算符，就用用一行代码来代替 `if-else` 语句。

你也可以在 JSX 中使用三元运算符，而不是将 if-else 与立即调用函数表达式（IIFE）一起使用。

假设我们要基于 isShow 状态有条件地渲染一个小组件。 您可以这样编写条件渲染。

```js
return <div>{isShow ? <SmallComponent /> : null}</div>;
```

**`if-else if-else`使用三元运算符**

在上面的示例中，我仅向你展示如何使用三元运算符替换 if-else 语句。

三元运算符还可用于替换多个条件渲染（`if-else if-else`）或嵌套的条件渲染。

但是，我不建议你使用它，因为它比普通的 `if-else` 语句更难读。

假设你要在 JSX 中实现嵌套的条件渲染。

```js
return (
  <div>
    {condition_a ? (
      <ComponentA />
    ) : condition_b ? (
      <ComponentB />
    ) : condition_c ? (
      <ComponentC />
    ) : (
      <ComponentD />
    )}
  </div>
);
```

看起来非常乱，是吧？

对于这种情况，使用 IIFE，switch-case 语句或枚举对象比三元运算符更好。

## 3.&&运算符的条件渲染

**最佳实践概览**

- 使用它进行简单的条件渲染，不必去执行"else"块中的代码。

~~

使用三元运算符，可以缩短 if-else 语句的代码量，并为 JSX 中的条件渲染提供更好的选择。

但是，你知道有比三元运算符更简单的方法吗？

&&运算符可用于替换此类 if 语句。

```js
// Instead of using ternary operator,
{
  isShow ? <SmallComponent /> : null;
}

// Use short-circuit && operator
{
  isShow && <SmallComponent />;
}
```

在三元运算符中，即使没有"else"条件，也需要写"null"表达式以避免语法错误。

使用&&运算符，你不需要写多余的代码。

但是，请记住，不能将&&运算符替换为`if-else`语句，更不用说`if-else if-else`语句了。

## 4.带 switch 的多条件渲染-案例

- 可以在任何位置使用它来进行多个条件渲染，而只有一个变量可以判断条件。

~~

像`if-else`语句一样，`switch-case`语句也是几乎每种编程语言中的常见功能。

它用于具有相同类型条件的多个条件渲染。

例如，我们可以使用`switch-case`语句根据用户角色呈现特定的变量值。

```js
let welcomeMessage;
switch (role) {
  case "superadmin":
    welcomeMessage = "Welcome Super Admin";
  // you can put other codes here as well.
  case "admin":
    welcomeMessage = "Welcome Admin";
  // you can put other codes here as well.
  case "user":
    welcomeMessage = "Welcome User";
  // you can put other codes here as well.
  default:
    welcomeMessage = "Welcome Guest";
  // you can put other codes here as well.
}
```

你还可以使用`switch-case`语句在 JSX 中进行条件渲染。 但是，你需要将其包装在 IIFE 中。

假设你要呈现一个基于 `alert` 状态设置样式的`alert`组件。

```js
return (
  <div>
    {(() => {
      switch (status) {
        case "warning":
          return <AlertComponent status="warning" message={messageState} />;
        case "error":
          return <AlertComponent status="error" message={messageState} />;
        case "success":
          return <AlertComponent status="success" message={messageState} />;
        default:
          return <AlertComponent status="info" message={messageState} />;
      }
    })()}
  </div>
);
```

你可能已经注意到，两个示例都只有一个变量（`role` 和`status`）来判断条件。 这就是我之前所说的相同类型的条件。

`switch-case`语句不能用于处理复杂和不同类型的条件。但是你可以使用通用的`if-else if-else`语句去处理那些场景。

## 5.枚举对象的多重条件渲染

- 仅当您要分配具有多个条件的变量值或返回值时，才使用它。

~~

枚举对象还可以用于在 React 中实现多个条件渲染。 对于 JSX 标记中的 `switch-case`语句，它是更好的选择。

如你所知，在第 5 种方法中，你应该将`switch-case`语句包装在 JSX 的 IIFE 中。 使用枚举对象，你不需要这样做。

让我们用一个以前的一个示例来距离。 你要基于状态呈现 alert 组件。 这是使用枚举对象有条件地呈现它的方式。

```js
const ALERT_STATUS = {
  warning: <AlertComponent status="warning" />,
  error: <AlertComponent status="error" />,
  success: <AlertComponent status="success" />,
  info: <AlertComponent status="info" />,
};

return <div>{ALERT_STATUS[status]}</div>;
```

你需要创建一个枚举对象，首先称为“ ALERT_STATUS”。 然后，只需在 JSX 中使用 `[]`括号内的状态变量来调用它，该变量的值为'warning'，'error'，'success'或'info'。

如果<AlertComponent />需要传递其他道具或属性，则可以将 ALERT_STATUS 更改为这样的函数。

```js
const ALERT_STATUS = (message) => ({
  warning: <AlertComponent status="warning" message={message} />,
  error: <AlertComponent status="error" message={message} />,
  success: <AlertComponent status="success" message={message} />,
  info: <AlertComponent status="info" message={message} />,
});

return <div>{ALERT_STATUS(messageState)[status]}</div>;
```

你还可以将变量传递给 alert 组件。

```js
let newVariable = ALERT_STATUS(messageState)[status];
```

当然，你应该首先定义枚举对象。

**将枚举对象拆分到单独文件来复用**

关于使用枚举对象进行条件渲染的最好的特性是可以复用。

回到示例案例，Alert 组件是 React 中通常可重用的组件。 因此，当你要有条件地渲染它时，也可以让它复用。

你可以在单独的文件中定义枚举，然后将它导出。

```js
import React from "react";
import AlertComponent from "./path/to/AlertComponent";

export const ALERT_STATUS = (message) => ({
  warning: <AlertComponent status="warning" message={message} />,
  error: <AlertComponent status="error" message={message} />,
  success: <AlertComponent status="success" message={message} />,
  info: <AlertComponent status="info" message={message} />,
});
```

然后，在要在组件中使用它时将其导入。

```js
import { ALERT_STATUS } from "./alertStatus";
```

用法与以前相同。

## 6.HOC 条件渲染

**最佳做法摘要**

- 如果要在渲染组件之前实现或检查某些条件，请使用它。

~~

高阶组件（HOC）可用于在 React 中实现条件渲染。 当你要运行某些逻辑或在渲染组件之前进行检查时，可以使用它。

例如，你要在访问某些组件之前检查用户是否已通过身份验证。

你可以使用 HOC 来保护那些组件，而不是在每个需要身份验证的组件中编写`if-else`语句。

```js
// This is Higher Order Component
import React from "react";
export default function withAuthentication(Component) {
  // some code of authentication logic/service that result an isLoggedIn variable/state:
  let isLoggedIn = true;

  return function AuthenticatedComponent(props) {
    if (isLoggedIn) {
      return <Component {...props} />;
    } else {
      return <div class="alert alert-danger">You're not authenticated!</div>;
    }
  };
}
```

然后，您可以将其导入并在组件中使用。

```js
import withAuthentication from "./withAuthentication";
```

```js
const AuthenticatedUIComponent = withAuthentication(AnUIComponent);

return (
  <div>
    <AuthenticatedUIComponent />
  </div>
);
```

这样更棒了，是吗？

你可以将 HOC 用于其他可复用的条件渲染，例如`加载指示器实现`，`空值检查` 等。

有关 HOC（具有功能组件）的更多详细信息，可以在 medium (https://medium.com/@albertchu539/higher-order-components-in-a-react-hooks-world-69fe1f0b0791)。

## 7.带有外部库的 JSX 条件渲染

**最佳做法摘要**

- 避免使用此方法。 熟悉上面的 6 种方法：D

尽管我不建议你使用此方法，但我只是想让你知道，有一个 babel 插件使 JSX 具有自己的条件渲染标记。

使用 JSX 控制语句，您可以像这样在 JSX 中编写条件渲染。

```js
<If condition={test}>
  <span>Truth</span>
</If>;

<Choose>
  <When condition={test1}>
    <span>IfBlock</span>
  </When>
  <When condition={test2}>
    <span>ElseIfBlock</span>
    <span>Another ElseIfBlock</span>
    <span>...</span>
  </When>
  <Otherwise>
    <span>ElseBlock</span>
  </Otherwise>
</Choose>;
```

在编译中，这些标签将转换为三元运算符。

一些开发人员使用此插件，因为它对于 JSX 中的条件渲染看起来更具可读性。

~~

译者注: 你还可以实现一个简单的 IF 组件来实现简单的判断。

```js
const If = (props) => {
  const condition = props.condition || false;
  const positive = props.then || null;
  const negative = props.else || null;

  return condition ? positive : negative;
};
```

```js
<IF condition={isLoggedIn} then={<Hello />} else={<div>请先登录</div>} />
```

这就是你可以在 React 中用于条件渲染的所有 7 种方法。

编码愉快！
