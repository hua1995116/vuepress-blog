# vue+websocket+express+mongodb实战项目（实时聊天）（二）

原项目地址：
【 vue+websocket+express+mongodb实战项目（实时聊天）（一）】
[http://blog.csdn.net/blueblueskyhua/article/details/70807847](http://blog.csdn.net/blueblueskyhua/article/details/70807847)

github地址: https://github.com/hua1995116/webchat
在线演示地址：http://www.qiufengh.com:8081/#/
在原项目（vue+websocket+express+mongodb实战项目（实时聊天）（一））的基础上，我又继续开发，增加了两个新功能，多个聊天室以及上传图片功能。觉得不错可以关注我，点波star。这个项目我会继续更新的。


###多个聊天室

首先我们先来看看socket.io的 [API](https://socket.io/docs/rooms-and-namespaces/)

加入某个分组
```javascript
io.on('connection', function(socket){
  socket.join('some room');
});
```
向某个分组发送消息
```javascript
io.to('some room').emit('some event');
```
而在我们这边也是一样的。

build/der-server.js
```javascript
socket.on('login',function (obj) {
    socket.name = obj.name
    socket.room = obj.roomid
    if (!global.users[obj.roomid]) {
      global.users[obj.roomid] = {}
    }
    global.users[obj.roomid][obj.name] = obj
    socket.join(obj.roomid)
    io.to(obj.roomid).emit('login', global.users[obj.roomid])
    console.log(obj.name + '加入了' + obj.roomid)
  })
```
当一个用户加入一个房间时。让他加入一个分组。当然我们需要用户在加入的时候传递一个参数，房间名。

```javascript
socket.on('message', function (obj) {
    //向所有客户端广播发布的消息
    var mess = {
      username: obj.username,
      src:obj.src,
      msg: obj.msg,
      img: obj.img,
      roomid: obj.room
    }
    io.to(mess.roomid).emit('message', mess)
    console.log(obj.username + '对房' + mess.roomid+'说：'+ mess.msg)
    if (obj.img === '') {
      var message = new Message(mess)
      message.save(function (err, mess) {
        if (err) {
          console.log(err)
        }
        console.log(mess)
      })
    }
  })
```
这样就可以向对应的房间发消息啦。
**核心**就是在加入的时候一定要传入房间名，否则就无法加入到某个分组中了。
###图片上传
1.客户端
利用了formdata 
```javascript
fileup() {
    var that = this
    var file1 = document.getElementById('inputFile').files[0]
    if (file1) {
        var formdata = new window.FormData()
        formdata.append('file', file1)
        formdata.append('username', that.getusername)
        formdata.append('src', that.getusersrc)
        formdata.append('roomid', that.getuserroom)
        // username: this.getusername,
        // src: this.getusersrc,
        this.$store.dispatch('uploadimg', formdata)
        var fr = new window.FileReader()
        fr.onload = function () {
            var obj = {
                username: that.getusername,
                src: that.getusersrc,
                img: fr.result,
                msg: '',
                room: that.getuserroom
            }
            console.log(obj)
            that.getsocket.emit('message', obj)
        }
        fr.readAsDataURL(file1)
    } else {
        console.log('必须有文件')
    }
}
```
2.服务器端
运用了multiparty模块。
```javascript
app.post('/file/uploadimg', function (req, res, next) {
    // console.log(util.inspect(req.body, { showHidden: true, depth: null }))
    // console.log(util.inspect(req.header, { showHidden: true, depth: null }))
    // //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form()
    // //设置编辑
    form.encoding = 'utf-8'
    // //设置文件存储路径
    form.uploadDir = "./static/files/"
    // //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024
    // form.maxFields = 1000;  设置所以文件的大小总和
    // 上传完成后处理
    form.parse(req, function (err, fields, files) {
      console.log(fields)
      var filesTmp = JSON.stringify(files, null, 2)
      console.log(filesTmp)
      if (err) {
        console.log('parse error: ' + err)
        res.json({
          errno: 1
        })
      } else {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path
        var array = inputFile.originalFilename.split('.')
        var imgtype = array[array.length - 1]
        var dstPath = './static/files/' + new Date().getTime() + '.' + imgtype
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function (err) {
          if (err) {
            console.log('rename error: ' + err)
            res.json({
              errno: 1
            })
          } else {
            var mess = {
              username: fields.username,
              src: fields.src,
              img: dstPath,
              roomid: fields.roomid
            }
            var message = new Message(mess)
            message.save(function (err, mess) {
              if (err) {
                console.log(err)
              }
              console.log(mess)
            })
            console.log('rename ok')
            res.json({
              errno: 0
            })
          }
        })
      }
    })

  })
```

如果对于上传有问题可以看这个[axios上传formdata失败以及nodejs接受formdata失败](http://blog.csdn.net/blueblueskyhua/article/details/73178204)

效果图
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284730.png)
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284731.png)