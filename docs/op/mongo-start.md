# mongodb安装教程以及常用命令

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

cd ..

./bin/mongod --dbpath=data/db logpath = data/logs/mongodb.log --fork
```

## 备份数据库

```
mongodump -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 -o 文件存在路径  
```

> 如果没有用户谁，可以去掉-u和-p。
如果导出本机的数据库，可以去掉-h。
如果是默认端口，可以去掉--port。
如果想导出所有数据库，可以去掉-d。


导出所有数据库

```
mongodump -h 127.0.0.1 -o /home/mongodb/
```

导出指定数据库

```
mongodump -h xxx.xxx.xx -d test -o /home/mongodb/
```

还原数据库

```
mongorestore -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 --drop 文件存在路径 
```

恢复所有数据库
```
mongorestore /home/mongodb/
```

还原指定的数据库

```
mongorestore -d test /home/mongodb/test/ 
```



https://www.jianshu.com/p/667fd4fd6ff7