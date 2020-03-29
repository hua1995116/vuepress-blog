# 阿里云linux服务器配置(node环境)


# 前言
今天看到了阿里云上有这个[活动](https://promotion.aliyun.com/ntms/campus2017.html?utm_medium=text&utm_source=baidu&utm_campaign=xsj&utm_content=se_466551)

![这里写图片描述](https://s3.qiufengh.com/blog/1579506286911.jpg)
我就顺势买了一台阿里云的服务器，之前买了一台windows server的，这次就试试这个linux的。其实发现只要你对linux熟悉，配置还是比较容易的。我选择的是CentOS 7.3 64位的。
# 配置环境
为了方便，我在服务器上装的是node环境
node环境配置可以查看，[帮助文档](https://help.aliyun.com/document_detail/50775.html?spm=5176.doc25429.6.644.3D2aMv)

这里我就不展开讲了。
当我把环境配置好后，通过服务器给定的外网+端口，进行访问，结果发现并不能同。后来我也进行了ping。发现还是不同，后来查了一些资料。发现是防火墙的原因。
点击你所购买的服务器的详情。可以看到有一个本实例安全组。
![这里写图片描述](https://s3.qiufengh.com/blog/1579506286278.jpg)
点击快速创建规则。
![这里写图片描述](https://s3.qiufengh.com/blog/1579506288006.jpg)
在这里应该要配上基本的ssh，http80，当然你可以自定义宽口。
配上这两个，并且你的服务内容也是在对应开放端口，这样就可以通过外网访问到你的网站内容了。
# 用ssh 登录服务器
我用的是macOS 系统所以自带ssh。windows可以看 [ssh安装](http://blog.sina.com.cn/s/blog_4a0a8b5d01015b0n.html)

```
ssh laowang@你的ip -p 22（如果改端口了，换成你的端口）
```

# 修改默认的ssh端口
我们知道，如果默认暴露22端口，是很危险的，为了安全起见，很多用户会将端口号由22改为其他的端口号。 
如果你看了上面的帮助文档，你应该安装了vim编辑器，
这个时候

```
vi /etc/ssh/sshd_config
```
去掉#Port 22一行开头的#号， 后面就是你所要改的端口。（假设是888）

```
service sshd restart
```
重启sshd服务

```
netstat -natlp 
```
检查 ssh服务是否侦听到了新端口

完毕之后，你还需要在安全组，开放对应的端口。
# 增加普通用户
在我们一般情况下，我们不可能一直用管理员用户，所以我们需要创建一个普通用户

```
useradd laowang
```
并对其设置密码
```
passwd laowang
```
然后输入密码，这样我们就为laowang这个用户设置了密码。
下次登录的时候我就可以用 

```
ssh laowang@你的ip -p 22（如果改端口了，换成你的端口）
```
来登录你的主机了。

# 别名登录

我们每次在登录服务器的时候，需要敲

```
ssh laowang@你的ip -p 22（如果改端口了，换成你的端口）
```
这么一大段，都说技术是来解放劳动力的，当然我们也不希望通过这样的方式，而且对于多台服务器，这样的方式很容易忘记ip。
下面就让我们来解放劳动力。
以下我讲的是基于（linux/mac）

首先查看在~/.ssh 是否有一个config文件

```
cd ~/.ssh
ls 
```
试过没有，我们就mkdir config

```
Host aliyun1  别名
HostName 47.95.208.249 ip
User root  用户
Port 22 端口
IdentitiesOnly yes  只接受SSH key 登录
```
配置好后
进入bash 

```
ssh aliyun1 
```
输入密码。
这样是否很方便呢？

