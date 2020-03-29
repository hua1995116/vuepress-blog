# 一个免费功能强大的谷歌翻译api

分享一个免费且功能强大谷歌翻译api，具有以下方式：

- 批量翻译
- 免费无限制
- 快速可靠，和 translate.google.com 相同源
- 浏览器插件/node/浏览器
- 支持代理

使用方式

单段文本
```javascript
import translate from 'google-translate-open-api';
const result = await translate(`I'm fine.`, {
  tld: "cn",
  to: "zh-CN",
});
const data = result.data[0];

// 我很好。
```

多段文本
```javascript
import translate from 'google-translate-open-api';

const result = await translate([`I'm fine.`, `I'm ok.`], {
  tld: "cn",
  to: "zh-CN",
});
const data = result.data[0];
// [[[["我很好。"]],null,"en"],[[["我可以。"]],null,"en"]]
```

> 注意: 多段文本的返回值和单段文本的返回值不同，你需要额外的注意

多段文本中含有多个句子

```javascript
import translate, { parseMultiple } from 'google-translate-open-api';

const result = await translate([`I'm fine. And you?`,`I'm ok.`], {
  tld: "cn",
  to: "zh-CN",
});
// [[[[["<i>I&#39;m fine.</i> <b>我很好。</b> <i>And you?</i> <b>你呢？</b>"]],null,"en"],[[["我可以。"]],null,"en"]]]

// use parseMultiple
const data = result.data[0];
const parseData = parseMultiple(data);
// ["我很好。你呢？","我可以。"]
```

代理

proxy-config [https://github.com/axios/axios#request-config](https://github.com/axios/axios#request-config)
```javascript
const result = await translate([`I'm fine. And you?`,`I'm ok.`], {
  tld: "cn",
  to: "zh-CN",
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  }
});
```

浏览器

```javascript
const result = await translate([`I'm fine. And you?`,`I'm ok.`], {
  tld: "cn",
  to: "zh-CN",
  browers: true
});

const data = result.data[0];

// 我很好。
```
