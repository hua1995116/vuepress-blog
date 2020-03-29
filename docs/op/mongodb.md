# MongoDB系列一: Replica Set 集群搭建实战

随着内部产品业务的搭建，单机的mongo已经无法满足生产需求，对于单机迁移、损坏等问题，简单的单机数据备份已经无法满足，因为采用了集群方式来满足容灾以及数据快速恢复等功能，下面我就来讲讲如何搭建集群来避免这些问题。

### 准备工作

机器信息: 3 台机器

mongo1
mongo2
mongo3

环境: CentOS 6.5

### 采用策略

Mongo有三种集群方式
1.Replica Set副本
2.Sharding分片
3.Master-slave主备

比较常用的为1，2两种方式， 在日后的篇章中将详细介绍两者的区别。

当前我们采用的是  Replica Set 搭建方式。这是官方教程，我们会跟着官方教程，以及对官方未说明的一些信息进行补充。https://docs.mongodb.com/manual/tutorial/deploy-replica-set/#overview



### 简述

副本集是一组维护相同数据集的 mongo 实例。副本集包含多个数据节点和一个仲裁节点。在数据承载节点中，只能含有一个主节点，其他节点被视为复制节点。

![](https://docs.mongodb.com/manual/_images/replica-set-read-write-operations-primary.bakedsvg.svg)



复制节点复制主节点的 oplog 并将操作应用于其数据集，使得复制节点成为主节点的一个镜像。 如果主节点停止时候，在复制节点中将会选出新的主节点。

![](https://docs.mongodb.com/manual/_images/replica-set-primary-with-two-secondaries.bakedsvg.svg)

自动故障转移，当主节点与集合中的其他成员通信的时间超过配置的electionTimeoutMillis期间（默认为10秒）时，符合条件的复制节点将会被选举成新主节点。 群集尝试完成新主节点的选举并恢复正常操作。

![](https://docs.mongodb.com/manual/_images/replica-set-trigger-election.bakedsvg.svg)

写操作，默认情况下，客户端从主节点读取， 但是，客户端可以设置从复制节点读取。

![](https://docs.mongodb.com/manual/_images/replica-set-read-preference-secondary.bakedsvg.svg)

#### 特性

优势

1.提供容错功能，在主节点故障时，复制节点代替主节点

2.数据的快速恢复

3.增加节点可提高读能力

4.快速横向扩展

劣势

1.所有写操作都从主节点进行，增加节点无法提高写能力

2.每个节点都是完整备份，数据冗余



### 基础搭建


分别在 3 台机器安装 mongo


用户权限

mongo1

```shell
cd ~

wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.4.6.tgz

tar zxvf mongodb-linux-x86_64-3.4.6.tgz

mv mongodb-linux-x86_64-3.4.6 mongodb

cd mongodb

mkdir data
mkdir data/db
mkdir data/logs

touch data/mongodb.log

cd data
```

在这里我们采用配置文件的方式启动，先不配置验证，等设置完用户组后，再进行， 为了安全考虑，我们将修改默认端口，分别使用 8410,8411,8412。  `[your replSet name]` 改成你自己 replSet 的名字， 例如 `rs0` (自己取)

```
vim mongodb.conf
```
```shell
#端口号
port = 8410
#集群名字
replSet = [your replSet name]
#数据目录(自己刚才设置的位置)
dbpath = ~/mongodb/data/db
#日志目录(自己刚才设置的位置))
logpath = ~/mongodb/data/logs/mongodb.log
#设置后台运行
fork = true
#日志输出方式
logappend = true
#开启认证
#auth = true
#安全文件地址
#keyFile = ~/mongodb/data/keyFile
```

启动mongo

```
cd ..
./bin/mongod --config ~/mongodb/data/mongodb.conf
```


mongo2,mongo3 同 mongo1。只需要修改端口, 其他都与 mongo1 一样的步骤。

mongo2

mongodb.conf

```
...
port = 8411
...
```

mongo3

mongodb.conf

```
...
port = 8412
...
```


在三台机器都启动好后，我们来到 mongo1 机器。

连接 mongodb

```
./bin/mongo 127.0.0.1:8410
```

配置集群(mongo1为你的机器地址)

```shell
cfg = {"_id" : "[your replSet name]", "members" : [{"_id" : 0,"host" : "mongo1:8410"}]}
rs.initiate(cfg);
```

效果如图:
![1567682388618.jpg](https://s3.qiufengh.com/blog/1567682388618.jpg)

运行 `rs.status()` 查看状态。

health: 1 代表正常 0 代表异常， stateStr 为描述主节点或者复制节点。

![1567682478469.jpg](https://s3.qiufengh.com/blog/1567682478469.jpg)

现在我们已经添加了一个主节点了，接下来继续添加剩余的两个节点。

![1567682673974.jpg](https://s3.qiufengh.com/blog/1567682673974.jpg)

运行 `rs.status()` 查看状态。

![1567682754525.jpg](https://s3.qiufengh.com/blog/1567682754525.jpg)

到现在我们已经完成了我们的集群搭建。

接下来我们就要来验证下我们的数据同步问题。

继续保持在主节点连接状态。

创建一条测试数据。

![1567683075113.jpg](https://s3.qiufengh.com/blog/1567683075113.jpg)

退出我们的主节点连接，连接复制节点。

```
 ./bin/mongo mongo2:8411
```
![1567683192236.jpg](https://s3.qiufengh.com/blog/1567683192236.jpg)

发现我们并不能直接查看

原因是: mongodb默认是从主节点读写数据的。

我们对复制节点进行进行设置。

```
db.getMongo().setSlaveOk();

db.test.find();

// { "_id" : ObjectId("5d70f1f19384bf8d850e2042"), "test" : "123" }

```
数据已经从主节点同步过来了。


模拟宕机 mongo 故障

我们将主节点停止。 (也可以直接kill，但是推荐安全退出)

```shell
./bin/mongo 127.0.0.1:8410

use admin

db.shutdownServer()

```

登录我们的复制mongo2来进行查看，确认是否成功迁移了 mongo 。

来到mongo2
```
./bin/mongo 127.0.0.1:8411

rs.status();
```

![1567683538699.jpg](https://s3.qiufengh.com/blog/1567683538699.jpg)

可以看到通过选举，mongo2 成功成为主节点。


重启 mongo1 ， 连接实例

```
cd ~

./bin/mongod --config /opt/meituan/mongodb/data/mongodb.conf

./bin/mongo 127.0.0.1:8410

rs.status();
```

![1567683684469.jpg](https://s3.qiufengh.com/blog/1567683684469.jpg)

原来的 mongo1 成功地成为了 mongo 2 的复制节点。

mongoose 连接测试

```javascript
const mongoose = require("mongoose");

const uri =
  "mongodb://mongo1:8410,mongo2:8411,mongo3:8412/test?authSource=admin";
const opts = {
  poolSize: 5,
  auto_reconnect: true,
  useNewUrlParser: true,
  keepAlive: 300000,
  replicaSet: "banmars",
  readPreference: "secondaryPreferred"
};

global.db = mongoose.createConnection(uri, opts);
mongoose.connection = global.db;

db.on("error", function(err) {
  console.error(err);
});
db.on("open", function() {
  console.log("dbopen");
});

```

到此我们的 mongo 集群已经搭建并且测试完成，然后就拿着集群兴高采烈地去进行使用，但是发现，因为集群到现在没有设置任何安全认证，任意用户可以进行登录修改数据。这可是个大隐患，你的库随时都有被删除的风险。。。这可不好交代，所以我们接下来讲解如何搭建一个安全的 mongodb 环境。



### 安全验证

首先来到主节点(mongo2，刚才测试的时候 mongo2 成为主节点了)

创建管理员用户 ([权限说明](https://blog.csdn.net/WI_232995/article/details/78881408))

管理员用户，用来添加用户以及授权

```
use admin

db.createUser( {
 user: "root",
 pwd: "root",
 roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
});
```

集群管理用户，用来查看集群状态
```
db.createUser(
  {
    "user" : "cluster",
    "pwd" : "cluster",
    roles: [ { "role" : "clusterAdmin", "db" : "admin" } ]
  }
)
```

https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#deploy-repl-set-with-auth
查看官网我们可以看到 mongo 采用的是 keyFile 的方式

由于一开始我没有采用这个方式，直接采用 auth=true 的方式，导致一直报以下的错误。

```
Error in heartbeat request to X.X.X.X:8410; Unauthorized: not authorized on admin to execute command
```

生成 keyFile

```
cd ~
cd mongodb
openssl rand -base64 756 > data/keyFile
chmod 400 data/keyFile
vim data/mongodb.conf
```

```shell
#端口号
port = 8410
#集群名字
replSet = [your replSet name]
#数据目录(自己刚才设置的位置)
dbpath = ~/mongodb/data/db
#日志目录(自己刚才设置的位置))
logpath = ~/mongodb/data/logs/mongodb.log
#设置后台运行
fork = true
#日志输出方式
logappend = true
#开启认证
auth = true
#安全文件地址
keyFile = ~/mongodb/data/keyFile
```
将 auth 开启， 指定 keyFile 路径。

将 mongo1 停止，再重启。

```
./bin/mongo 127.0.0.1:8410

use admin

db.shutdownServer()

./bin/mongod --config ~/mongodb/data/mongodb.conf

```

将 mongo1中的 keyFile 文件拷贝到 mongo2 以及 mongo3.

这里我采用的是 rsync 方式。

所以我们还得配置 ssh。(你也可以采用其他方式，我这里为了后续同步方便采用了 ssh )


mongo1
```
cd ~/.ssh
ssh-keygen

一路回车...

cat id_rsa.pub

复制内容
```

mongo2
```
cd ~/.ssh/

vim authorized_keys

```
将刚才复制的添加最后。

mongo3 同 mongo2


mongo1
```
cd ~/mongodb

rsync -Cavzt ./data/keyFile mongodb02:~/mongodb/data/
rsync -Cavzt ./data/keyFile mongodb03:~/mongodb/data/
```

分别到mongo2，mongo3，

编辑配置文件

```shell
...
#开启认证
auth = true
#安全文件地址
keyFile = ~/mongodb/data/keyFile
...
```

重启 mongo2,mongo3 上的 mongo实例


来到 mongo1

```
./bin/mongo 127.0.0.1:8410
```
![1567686047066.jpg](https://s3.qiufengh.com/blog/1567686047066.jpg)

我们看到通过不验证的方式登录已经无法查看信息了。

下面我们用认证方式来进行登录。
```
./bin/mongo 127.0.0.1:8410 -u "root" -p "root" --authenticationDatabase "admin"
```

![1567686155667.jpg](https://s3.qiufengh.com/blog/1567686155667.jpg)

通过认证方式登录已经正常使用了。


退出登录，使用集群管理员登录。
```
./bin/mongo 127.0.0.1:8410 -u "cluster" -p "cluster" --authenticationDatabase "admin"
```

```
rs.status();
```
![1567686701852.jpg](https://s3.qiufengh.com/blog/1567686701852.jpg)

三台机器已经都正常运行了。


还记得我们一开始创建的 test 集合吗。

我们给它创建一个用户来进行管理。

```
db.createUser(
  {
    "user" : "test",
    "pwd" : "test",
    roles: [ { "role" : "read", "db" : "test" }, { "role" : "readWrite", "db" : "test" } ]
  }
)
```

mongoose 测试

```javascript
const mongoose = require("mongoose");

const uri =
  "mongodb://test:test@10.48.172.11:8410,10.48.181.145:8411,10.48.144.74:8412/test?authSource=admin";
const opts = {
  poolSize: 5,
  auto_reconnect: true,
  useNewUrlParser: true,
  keepAlive: 300000,
  replicaSet: "banmars",
  readPreference: "secondaryPreferred"
};

global.db = mongoose.createConnection(uri, opts);
mongoose.connection = global.db;

db.on("error", function(err) {
  console.error(err);
});
db.on("open", function() {
  console.log("dbopen");
  const Schema = mongoose.Schema;

  const TestSchema = new Schema({
    name: {type: String, default: ""},
  });

  var Test = mongoose.model("test", TestSchema);

  const testModal = new Test({ name: "123" });

  testModal.save(function (err, test) {
    if (err) return console.error(err);
    console.log('success');
  });
});
```
最终效果

![1568188107165.jpg](https://s3.qiufengh.com/blog/1568188107165.jpg)

到此，真正地结束了本教程，我们可以愉快地拿着集群去交代了。。。



下期预告

MongoDB系列二: Sharded Cluster 集群搭建实战 



### 参考

https://blog.csdn.net/WI_232995/article/details/78881408

https://docs.mongodb.com/manual/tutorial/deploy-replica-set/#deploy-a-replica-set