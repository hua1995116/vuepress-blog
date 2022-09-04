(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{483:function(a,s,t){"use strict";t.r(s);var e=t(44),n=Object(e.a)({},(function(){var a=this,s=a.$createElement,t=a._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"阿里云linux服务器配置-node环境"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#阿里云linux服务器配置-node环境"}},[a._v("#")]),a._v(" 阿里云linux服务器配置(node环境)")]),a._v(" "),t("h1",{attrs:{id:"前言"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#前言"}},[a._v("#")]),a._v(" 前言")]),a._v(" "),t("p",[a._v("今天看到了阿里云上有这个"),t("a",{attrs:{href:"https://promotion.aliyun.com/ntms/campus2017.html?utm_medium=text&utm_source=baidu&utm_campaign=xsj&utm_content=se_466551",target:"_blank",rel:"noopener noreferrer"}},[a._v("活动"),t("OutboundLink")],1)]),a._v(" "),t("p",[t("img",{attrs:{src:"https://s3.qiufeng.blue/blog/1579506286911.jpg",alt:"这里写图片描述"}}),a._v("\n我就顺势买了一台阿里云的服务器，之前买了一台windows server的，这次就试试这个linux的。其实发现只要你对linux熟悉，配置还是比较容易的。我选择的是CentOS 7.3 64位的。")]),a._v(" "),t("h1",{attrs:{id:"配置环境"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#配置环境"}},[a._v("#")]),a._v(" 配置环境")]),a._v(" "),t("p",[a._v("为了方便，我在服务器上装的是node环境\nnode环境配置可以查看，"),t("a",{attrs:{href:"https://help.aliyun.com/document_detail/50775.html?spm=5176.doc25429.6.644.3D2aMv",target:"_blank",rel:"noopener noreferrer"}},[a._v("帮助文档"),t("OutboundLink")],1)]),a._v(" "),t("p",[a._v("这里我就不展开讲了。\n当我把环境配置好后，通过服务器给定的外网+端口，进行访问，结果发现并不能同。后来我也进行了ping。发现还是不同，后来查了一些资料。发现是防火墙的原因。\n点击你所购买的服务器的详情。可以看到有一个本实例安全组。\n"),t("img",{attrs:{src:"https://s3.qiufeng.blue/blog/1579506286278.jpg",alt:"这里写图片描述"}}),a._v("\n点击快速创建规则。\n"),t("img",{attrs:{src:"https://s3.qiufeng.blue/blog/1579506288006.jpg",alt:"这里写图片描述"}}),a._v("\n在这里应该要配上基本的ssh，http80，当然你可以自定义宽口。\n配上这两个，并且你的服务内容也是在对应开放端口，这样就可以通过外网访问到你的网站内容了。")]),a._v(" "),t("h1",{attrs:{id:"用ssh-登录服务器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#用ssh-登录服务器"}},[a._v("#")]),a._v(" 用ssh 登录服务器")]),a._v(" "),t("p",[a._v("我用的是macOS 系统所以自带ssh。windows可以看 "),t("a",{attrs:{href:"http://blog.sina.com.cn/s/blog_4a0a8b5d01015b0n.html",target:"_blank",rel:"noopener noreferrer"}},[a._v("ssh安装"),t("OutboundLink")],1)]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("ssh laowang@你的ip -p 22（如果改端口了，换成你的端口）\n")])])]),t("h1",{attrs:{id:"修改默认的ssh端口"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#修改默认的ssh端口"}},[a._v("#")]),a._v(" 修改默认的ssh端口")]),a._v(" "),t("p",[a._v("我们知道，如果默认暴露22端口，是很危险的，为了安全起见，很多用户会将端口号由22改为其他的端口号。\n如果你看了上面的帮助文档，你应该安装了vim编辑器，\n这个时候")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("vi /etc/ssh/sshd_config\n")])])]),t("p",[a._v("去掉#Port 22一行开头的#号， 后面就是你所要改的端口。（假设是888）")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("service sshd restart\n")])])]),t("p",[a._v("重启sshd服务")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("netstat -natlp \n")])])]),t("p",[a._v("检查 ssh服务是否侦听到了新端口")]),a._v(" "),t("p",[a._v("完毕之后，你还需要在安全组，开放对应的端口。")]),a._v(" "),t("h1",{attrs:{id:"增加普通用户"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#增加普通用户"}},[a._v("#")]),a._v(" 增加普通用户")]),a._v(" "),t("p",[a._v("在我们一般情况下，我们不可能一直用管理员用户，所以我们需要创建一个普通用户")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("useradd laowang\n")])])]),t("p",[a._v("并对其设置密码")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("passwd laowang\n")])])]),t("p",[a._v("然后输入密码，这样我们就为laowang这个用户设置了密码。\n下次登录的时候我就可以用")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("ssh laowang@你的ip -p 22（如果改端口了，换成你的端口）\n")])])]),t("p",[a._v("来登录你的主机了。")]),a._v(" "),t("h1",{attrs:{id:"别名登录"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#别名登录"}},[a._v("#")]),a._v(" 别名登录")]),a._v(" "),t("p",[a._v("我们每次在登录服务器的时候，需要敲")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("ssh laowang@你的ip -p 22（如果改端口了，换成你的端口）\n")])])]),t("p",[a._v("这么一大段，都说技术是来解放劳动力的，当然我们也不希望通过这样的方式，而且对于多台服务器，这样的方式很容易忘记ip。\n下面就让我们来解放劳动力。\n以下我讲的是基于（linux/mac）")]),a._v(" "),t("p",[a._v("首先查看在~/.ssh 是否有一个config文件")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("cd ~/.ssh\nls \n")])])]),t("p",[a._v("试过没有，我们就mkdir config")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("Host aliyun1  别名\nHostName 47.95.208.249 ip\nUser root  用户\nPort 22 端口\nIdentitiesOnly yes  只接受SSH key 登录\n")])])]),t("p",[a._v("配置好后\n进入bash")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("ssh aliyun1 \n")])])]),t("p",[a._v("输入密码。\n这样是否很方便呢？")])])}),[],!1,null,null,null);s.default=n.exports}}]);