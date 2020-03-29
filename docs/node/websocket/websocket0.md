# 实现一个 websocket 框架 

项目地址: https://github.com/hua1995116/websocket-ws

## 前置知识

1 kb = 1024 byte

1 byte = 8 bit

## websocket 数据帧

前面已经说过了WebSocket在客户端与服务端的“Hand-Shaking”实现，所以这里讲数据传输。
WebSocket传输的数据都是以Frame（帧）的形式实现的，就像TCP/UDP协议中的报文段Segment。下面就是一个Frame：（以bit为单位表示）

```
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
 |     Extended payload length continued, if payload len == 127  |
 + - - - - - - - - - - - - - - - +-------------------------------+
 |                               |Masking-key, if MASK set to 1  |
 +-------------------------------+-------------------------------+
 | Masking-key (continued)       |          Payload Data         |
 +-------------------------------- - - - - - - - - - - - - - - - +
 :                     Payload Data continued ...                :
 + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 |                     Payload Data continued ...                |
 +---------------------------------------------------------------+
```


### FIN： 1bit
```
表示此帧是否是消息的最后帧。第一帧也可能是最后帧。
```

### RSV1，RSV2，RSV3： 各1bit
```
必须是0，除非协商了扩展定义了非0的意义。如果接收到非0，且没有协商扩展定义  此值的意义，接收端必须使WebSocket连接失败。
```
### Opcode： 4bit
```
定义了"Payloaddata"的解释。如果接收到未知的操作码，接收端必须使WebSocket       连接失败。下面的值是定义了的。

%x0 表示一个后续帧

%x1 表示一个文本帧

%x2 表示一个二进制帧

%x3-7 为以后的非控制帧保留

%x8 表示一个连接关闭

%x9 表示一个ping

%xA 表示一个pong

%xB-F 为以后的控制帧保留
```
 

### Mask： 1bit
```
定义了"Payload data"是否标记了。如果设为1，必须有标记键出现在masking-key，用   来unmask "payload data"，见5.3节。所有从客户端发往服务器的帧必须把此位设为1。
```
 

### Payload length： 7bit, 7 + 16bit, 7 + 64bit
```
"Payloaddata"的长度，字节单位。如果值是0-125，则是有效载荷长度。如果是126，   接下来的2字节解释为16位无符号整数，作为有效载荷长度。如果127，接下来的8  字节解释为64位无符号整数（最高位必须是0），作为有效载荷长度。多字节长度数值    以网络字节序表示。注意，在任何情况下，必须用最小数量的字节来编码长度，例如，       124字节 长的字符串不能编码为序列126, 0, 124。有效载荷长度是"Extension data"的长     度加上"Application data"的长度。"Extension data"的长度可能是0，在这种情况下，    有效载荷长度是"Applicationdata"的长度。
```

### Masking-key：0或4字节
```
所有从客户端发往服务器的帧必须用32位值标记，此值在帧里。如果mask位设为1， 此字段（32位值）出现，否则缺失。更多的信息在5.3节，客户端到服务器标记。
```
 

### Payload data： (x + y)字节
```
"Payloaddata" 定义为"extensiondata" 后接"application data"。
```
 

### Extension data： x 字节
```
"Extensiondata"是0字节，除非协商了扩张。所有扩张必须指定"extensiondata"的长度，      或者如何计算长度，如何使用扩展必须在打开握手时进行协商。如果有，"Extension data"包括在有效载荷长度。
```
 

### Application data： y字节
```
任意"Applicationdata"占据了帧的剩余部分，在"Extensiondata"之后。 "Applicationdata"的长度等于有效载荷长度减去"Extensiondata"的长度。
```


**示意图**

![ws.png](https://s3.qiufengh.com/blog/ws.png)


## parse

因为 JavaScript 语言没有用于读取或操作二进制数据流的机制，而是用 buffer 来进行代替操作。

### 第一个字节

首先我们先来解析出前 8 个字节。占比情况如下(单位 bit)：

FIN(1)，RSV1(1)，RSV2(1)，RSV3(1)，Opcode(4)

我们先来获取出 buffer 中的第一个字节，buffer 可以理解为一个类似的数组，每一个值代表一个字节，并且以16进制存储。而一个字节等于八个bit。

例如读出第一个 buffer 值为 7b, 如果将他转化为 10 进制为 123, 转化为2进制为 01111011, 因此我们肉眼可以看出, FIN = 0, RSV1 = 1, RSV2 = 1, RSV3 = 1, Opcode = 1011 (2进制表示)

但是我们在代码中无法使用这样的方式来查看，因此我们需要用到位移(>>)符号和按位与(&)符号。

```javascript
r_queue // buffer  
var FIN = r_queue[0] >> 7;
var Opcode = r_queue[0] & 0x0F;
```
0x0F 转化为 2 进制为 `00001111`，获取后4位。

### 第二个字节

有了上面的描述相信你对如何解析数据有了初步的了解, 继续来解析第二个字节, 占比情况(单位 bit ):

Mask(1), Payload length(7)

```javascript
r_queue // buffer  
var MASK = r_queue[1] >> 7;
var Payload_len = r_queue[1] & 0x7F;
```
0x7F 转化为 2 进制为 `01111111`, 用来获取后7位。


如果 Payload_len 为 125， 则 Payload_len 长度就到此为止，如果Payload_len 为 126， 则后面的 2个字节 来代表长度， 可取范围为 0 - 65535。 如果Payload_len 为 127，则后面 8个字节 用来标识长度，可取范围为 0 - 2 ^ 64 -1  (1kb = 2 ^ 13 bit), 可以想象这个数值还是非常大的，基本可以认为 websocket 的存储数据量基本上没什么限制。

**总结**：
```
Payload_len = 125， Payload_len = 4bit
Payload_len = 126， Payload_len = 4 + 16 bit
Payload_len = 125， Payload_len = 4 + 64 4bit
```

### 第三部分（因为可能前面 Payload_len 会占据额外的2个字节或者8个字节，所以称第三部分） 

Masking-key(0/4 字节)

如果前面获取的 mask = 1， 则在 Payload_len 后会额外占据 4个字节。


Payload data 
情况1:
mask = 0，直接将获取剩余的buffer，转化为 string，即为我们传输的数据。
情况2：
mask = 1， 需要根据以下公式来进行额外计算。
https://tools.ietf.org/html/rfc6455#page-32
```
Octet i of the transformed data ("transformed-octet-i") is the XOR of
octet i of the original data ("original-octet-i") with octet at index
i modulo 4 of the masking key ("masking-key-octet-j"):

    j                   = i MOD 4
    transformed-octet-i = original-octet-i XOR masking-key-octet-j

The payload length, indicated in the framing as frame-payload-length,
does NOT include the length of the masking key.  It is the length of
the "Payload data", e.g., the number of bytes following the masking
key.
```
公式：`当前字节[i]的实际值 = 当前数据[i] ^(异或) masking-key[j] (j = i % 4)`

## generate

有了解析的过程，生成的过程就非常简单了。下面只考虑最简单的情况。不考虑掩码的情况, 只考虑长度小于 125， 126 的情况。

```javascript
const json = JSON.stringify(data)
// 获取 buffer 长度
const jsonByteLength = Buffer.byteLength(json);
// 判断长度
const lengthByteCount = jsonByteLength < 126 ? 0 : 2; 
const payloadLength = lengthByteCount === 0 ? jsonByteLength : 126; 
// 构造 buffer 长度 =  前面两个字节 + 后面的第三部分
const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength); 
// 写入第一个字节
buffer.writeUInt8(0b10000001, 0); 
// 写入第二个字节
buffer.writeUInt8(payloadLength, 1);
let payloadOffset = 2; 
// 如果长度大于 126
if (lengthByteCount > 0) { 
    // 偏移 2个字节写入
    buffer.writeUInt16BE(jsonByteLength, 2); 
    payloadOffset += lengthByteCount; 
}
// 写入数据
buffer.write(json, payloadOffset); 
```

## 工具

1. 进制转化工具 https://tool.lu/hexconvert/
2. js 进制转化 num.toStrong(2); (十进制转二进制)， parseInt(stringNum, 2); (二进制转十进制)
3. js 数字范围 -(2 ** 53 - 1) ~ (2 ** 53 -1)
4. websocket 规范 https://tools.ietf.org/html/rfc6455#page-32


## 参考
1. https://github.com/abbshr/RocketEngine
2. https://hackernoon.com/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8