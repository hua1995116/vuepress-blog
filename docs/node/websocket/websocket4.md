# 消息未读之点不完的小红点(Node+Websocket)

# 前言
https://github.com/hua1995116/webchat 

这个项目本来是我学生时代为了找工作的一个练手项目，但是没想到受到了很多的关注，star也快要破K了，这也激励着我不断去完善他，一方面是得对得起关注学习的人，另一方面也是想让自己能过通过慢慢完善一个项目来让自己提高。

![](https://s3.qiufengh.com/blog/1568533450654.jpg)

今天给大家带来的是基于Websocket+Node+Redis未读消息功能，可能更加偏向于实战方向，需要对Websocket和Node有一些了解，当然不了解也可以看看效果，效果链接（ https://www.qiufengh.com/ ）说不定会激起你学习的动力~

下面我通过自己思考的方式来进行讲解，代码可能讲的不多，但是核心逻辑都进行了讲解，上面也有github地址，有兴趣的可以进行详细地查看。自己的idea或多或少会有一些不成熟，但是我还是厚着脸皮出来抛头露脸，如果有什么建议还请大家多多提出，能让我更加完善这个作品。


# 设计

首先对于消息未读，大家都很熟悉，就是各种聊天的时候，出现的红点点，且是强迫症者必须清理的一个小点点，如👇所示。我会带大家实现一个这样的功能。
![](https://s3.qiufengh.com/blog/1568533450630.jpg)

由于一对一的方式更加简单，我现在只考虑多对多的情况，也就是在一个房间（也可以称为群组，后面都以房间称呼）中的未读消息，那么设计这样的一个功能，首相我将它分成了3种用户。

- 离线用户
- 在线用户
- 在线用户且进入群组的用户

### 离线用户
这种场景就相当于我们退出微信，但是别人在房间里发的消息，当我们再次打开的时候依然能够看到房间增长的未读消息。

### 在线用户
这种场景就是相当我们停留在聊天列表页面，当他人在房间中发送消息，我们能够实时的看到未读消息的条数在增长。

场景示例。
<img src="https://user-gold-cdn.xitu.io/2018/11/19/16729eb68b18a543?w=2000&h=2000&f=png&s=231925" style="width:500px;text-align: center">


### 在线用户且在房间的用户
这种场景其实就比较普通了，当别人发送新的消息，我们就能实时看到，此时是不需要标记未读消息的。

场景示例。
<img src="https://user-gold-cdn.xitu.io/2018/11/19/16729ebe4cc2ff41?w=2000&h=2000&f=png&s=500000" style="width:500px;text-align: center">

# 流程图

主要流程可以简化为三个部分，分别为用户，推送功能，消息队列。

用户可以是消息提供者也可以是消息接受者。以下就是这个过程。
![image](https://s3.qiufengh.com/blog/1568533450629.png)

当然在这个过程中涉及比较复杂的消息的存储，如何推送，获取，同步等问题，下面就是对这个过程进行详细的描述

![image](https://s3.qiufengh.com/blog/1568533450696.png)

**图上的流程解释**

A. 存储在Node缓存中的房间用户列表（此处信息也可以存在Redis中）

B. 存储在Redis中的未读消息列表

C. 存储在MongoDB中的未读消息列表

1. 用户1进入首页。
2. 用户1进入房间，重置用户在房间1的未读消息，触发更新模块去更新B未读消息列表。
3. 用户1向向房间B中发送了一条消息。
4. 后端需要去获取房间用户列表，判断用户是否在房间？
5. 是，因为在房间中的用户已经读取了最新消息，不需要进行计数。
6. 否，若用户不在房间中，更新其的未读消息计数
7. 从缓存中获取用户的消息进行分发。
8. 用户2登录我们的项目，从离线用户变成了在线用户。
9. 用户2登录时，触发查询模块，去获取其当前在各个房间未读消息情况。
10. 查询模块去查询Redis中的未读消息，若Redis中没有数据，会继续向数据库中查询，若没有则返回0给用户。
11. Redis缓存将会每分钟和数据库同步一次，保证数据的持久化。

# 环境

- Node: 8.5.0 +

- Npm: 5.3.0 +

- MongoDB

- Redis


##  为什么是redis ？

### 介绍

Redis 是互联网技术领域使用最为广泛的存储中间件，它是「Remote Dictionary Service」的首字母缩写，是一个高性能的key-value数据库。具有性能极高，丰富的数据类型，原子，丰富的特性等优势。


redis 具有以下5种数据结构

- String——字符串
- Hash——字典
- List——列表
- Set——集合
- Sorted Set——有序集合

想要深入了解这5种存储结构可以查看[http://www.runoob.com/w3cnote/redis-use-scene.html](http://www.runoob.com/w3cnote/redis-use-scene.html)

### 安装
**windows**
> http://www.cnblogs.com/jaign/articles/7920588.html

**mac**
> brew install redis

**ubuntu**
> apt-get install redis

**redhat**
> yum install redis

**centos**
>https://www.cnblogs.com/zuidongfeng/p/8032505.html

**运行客户端**
> redis-cli

### 可视化工具安装

**windows**
>https://pan.baidu.com/s/1kU8sY3P

**mac**
>https://pan.baidu.com/s/10vpdhw7YfDD7G4yZCGtqQg

**源码编译**
>http://docs.redisdesktop.com/en/latest/install/#build-from-source

### 项目中的数据结构
在本项目中我们用String 来存储用户的未读消息记录，利用其incr命令来进行自增操作。利用Hash结构 来存储我们websocket连接时用户的socket-id。

上面说了计数利用Redis的Stirng数据结构,
在Redis 我们的计数key-value是这样的。

username-roomid - number

例子: hua1995116-room1 - 1



我们的Socket-id则为Hash结构。

- socketId
    - username - socketid

例子:
- socketId
    - hua1995116 - En4ilYqDpk-P5_tzAAAG



# MongoDB

本项目一开始就使用了MongoDB，Node天然搭配的MongoDB的优势，这里就不再进行讲解，Node操作MongoDB的模块叫做mongoose，具体的参数方法，可以查看官方文档。

[https://mongoosejs.com/docs/4.x/index.html](https://mongoosejs.com/docs/4.x/index.html)

MongoDB下载地址

https://www.mongodb.com/download-center/community

可视化下载地址

https://github.com/mrvautin/adminMongo


# websocket + node 实现

下面我们通过一开始的3种用户的场景来具体说明实现的代码。

### 离线用户变成在线用户

![image](https://s3.qiufengh.com/blog/1568533450632.png)

客户端在登录时会发送一个login事件，以下是后端逻辑。

```Javascript
// 建立连接
socket.on('login',async (user) => {
    console.log('socket login!');
    const {name} = user;
    if (!name) {
      return;
    }
    socket.name = name;
    const roomInfo = {};
    // 初始化socketId
    await updatehCache('socketId', name, socket.id);
    
    for(let i = 0; i < roomList.length; i++) {
      const roomid = roomList[i];
      const key = `${name}-${roomid}`;
      // 循环所有房间
      const res = await findOne({username: key});
      const count = await getCacheById(key);
    
      if(res) {
        // 数据库查数据， 若缓存中没有数据，更新缓存
        if(+count === 0) {
          updateCache(key, res.roomInfo);
        }
        roomInfo[roomid] = res.roomInfo;
      } else {
        roomInfo[roomid] = +count;
      }
    }
    // 通知自己有多少条未读消息
    socket.emit('count', roomInfo);
        
});
```

用户从离线变成在线状态，建立socket连接时候，会发送一个login事件, 服务端就会去查询当前用户的未读消息情况，从MongoDB和Redis分别查询，若Redis中没有数据，则像数据库查询。

### 在线用户进入房间

![image](https://s3.qiufengh.com/blog/1568533451348.png)

客户端在加入房间说话会发送一个room事件，以下是后端逻辑

```Javascript
// 加入房间
socket.on('room', async (user) => {
    console.log('socket add room!');
    const {name, roomid} = user;
    if (!name || !roomid) {
      return;
    }
    socket.name = name;
    socket.roomid = roomid;
    
    if (!users[roomid]) {
      users[roomid] = {};
    }
    // 初始化user
    users[roomid][name] = Object.assign({}, {
      socketid: socket.id
    }, user); 
    
    // 初始化user
    const key = `${name}-${roomid}`;
    await updatehCache('socketId', name, socket.id);
    
    // 进入房间默认置空，表示全部已读
    await resetCacheById(key);
    // 进行会话
    socket.join(roomid);
    
    const onlineUsers = {};
    for(let item in users[roomid]) {
      onlineUsers[item] = {};
      onlineUsers[item].src = users[roomid][item].src;
    }
    io.to(roomid).emit('room', onlineUsers);
    global.logger.info(`${name} 加入了 ${roomid}`);
});
```
服务端接收到客户端发送的room事件，来重置该用户房间内的未读消息，并且该用户加入房间列表。

### 在房间中的用户发送消息 

![image](https://s3.qiufengh.com/blog/1568533450721.png)

客户端在加入房间说话会发送一个message事件，以下是后端逻辑
```Javascript
socket.on('message', async (msgObj) => {
    console.log('socket message!'); 
    //向所有客户端广播发布的消息
    const {username, src, msg, img, roomid, time} = msgObj;
    if(!msg && !img) {
      return;
    }
    ... // 此处为向数据库存入消息
    const usersList = await gethAllCache('socketId');// 所有用户列表
    usersList.map(async item => {
      if(!users[roomid][item]) {  // 判断是否在房间内
        const key = `${item}-${roomid}`
        await inrcCache(key);
        const socketid = await gethCacheById('socketId', item);
        const count = await getCacheById(key);
        const roomInfo = {};
        roomInfo[roomid] = count;
        socket.to(socketid).emit('count', roomInfo);
    }
}) 
```

此步骤略微复杂，主要是房间中的用户发送消息，需要经过判断，哪部分用户需要计数，哪部分用户不需要计数，从图中可以看出，不在房间内的用户都需要计数。

接下来还需要推送，那么哪些用户需要实时地推送呢，对的，就是那些在线用户并且不在房间内的用户。因此在这里也需要一个判断。

这样就完美了，能够精确地给用户增加计数，并且精确地推送给需要的用户。


# 后记

在线演示: https://www.qiufengh.com/

github地址: https://github.com/hua1995116/webchat

如果有什么建议或者疑问可以加入微信群进行探讨。

<p style="text-align:center">
    <img src="https://user-gold-cdn.xitu.io/2018/11/19/16729ed23f9be3a2?w=674&h=896&f=jpeg&s=64232" style="width:300px">
</p>

# 更多请关注

![](https://s3.qiufengh.com/blog/gongzhonghao.png)

