# nginx-https升级http2

## 概要
HTTP/2 （原名HTTP/2.0）即超文本传输协议 2.0，是下一代HTTP协议。是由互联网工程任务组（IETF）的Hypertext Transfer Protocol Bis (httpbis)工作小组进行开发。是自1999年http1.1发布后的首个更新。HTTP 2.0在2013年8月进行首次合作共事性测试。在开放互联网上HTTP 2.0将只用于https://网址，而 http://网址将继续使用HTTP/1，目的是在开放互联网上增加使用加密技术，以提供强有力的保护去遏制主动攻击。DANE RFC6698允许域名管理员不通过第三方CA自行发行证书。
## 前提
https 升级到http2两个必要条件
nginx 大于等于1.9.5
openssl 大于等于 1.0.2
参考：https://www.nginx.com/blog/supporting-http2-google-chrome-users/
升级openssl
https://www.openssl.org/source/

```
wget https://www.openssl.org/source/openssl-1.1.0c.tar.gz

tar -zxf openssl-1.1.0c.tar.gz

cd openssl-1.1.0c

./config

make

make install

#把旧版本的openssl重命名
mv /usr/bin/openssl /usr/bin/openssl.bak

#设置软连接指向刚编译好的新版本的openssl-1.1.0c
ln -s /usr/local/bin/openssl /usr/bin/openssl

#添加libssl.so.1.1的软链接
ln -s /usr/local/lib64/libssl.so.1.1 /usr/lib64/libssl.so.1.1
ln -s /usr/local/lib64/libcrypto.so.1.1 /usr/lib64/libcrypto.so.1.1

#查看openssl版本
openssl version
```

### 安装nginx
nginx有两种情况，一种是基于你已经安装过nginx，但是你的版本过低，或者没有安装一些额外的扩展导致无法升级，另外一种是还未安装。
1.重新安装nginx
nginx 编译参数
官网
http://nginx.org/en/docs/configure.html
中文版
http://www.ttlsa.com/nginx/nginx-configure-descriptions/
```
#进入你存在目录your path替换成你自己服务器的目录
cd your path
#下载
wget http://nginx.org/download/nginx-1.15.5.tar.gz
#解压
tar zxvf nginx-1.15.5.tar.gz
#进入源码目录
cd nginx-1.15.5

#参数
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_v2_module --with-http_gzip_static_module  --with-http_sub_module --with-openssl=/root/openssl-1.1.0c #对应openssl源码解压后的路径

make && make install

```


2.平滑升级nginx到最新的稳定版

```
#进入你存在目录your path替换成你自己服务器的目录
cd your path
#下载
wget http://nginx.org/download/nginx-1.15.5.tar.gz
#解压
tar zxvf nginx-1.15.5.tar.gz
#进入源码目录
cd nginx-1.15.5
#参数
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_v2_module --with-http_gzip_static_module  --with-http_sub_module --with-openssl=/root/openssl-1.1.0c #对应openssl源码解压后的路径
make
#不要执行make install
mv /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.old
#将新的编译好的文件拷贝
cp objs/nginx /usr/local/nginx/sbin/
#在源码目录执行make upgrade开始升级
make upgrade
#查看下版本
nginx -V

```

### 配置http2
下面配置http2的nginx.conf部分代码。
```
server {

	listen 443 ssl http2;
	server_name domain.com;

	ssl_certificate /path/to/public.crt;
	ssl_certificate_key /path/to/private.key;
	
	ssl_session_timeout 5m; 
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2; 
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;     
	ssl_prefer_server_ciphers on;
	

```

大功告成。下面看效果图。



效果图

![1679de4dfd9c54f2](https://s3.qiufengh.com/blog/1679de4dfd9c54f2.jpg)

如果没有协议这一栏，可以右键工具栏。

![1679de75bd365cae](https://s3.qiufengh.com/blog/1679de75bd365cae.jpg)

参考资料
https://blog.fazero.me/2017/01/06/upgrate-nginx-and-use-http2/