# js中事件绑定3种方法以及事件委托

###事件绑定
首先，我先来介绍我们平时绑定事件的三种方法。
**1.嵌入dom**
```html
<button onclick="open()">按钮</button>

<script>
function open(){
	alert(1)
}
</script>
```
**2.直接绑定**
```html
<button id="btn">按钮</button>
<script>
document.getElementById('btn').onclick = function(){
	alert(1)
}
</script>

```
**3.事件监听**
```html
<button id="btn">按钮</button>
<script>
document.getElementById('btn').addEventListener('click',function(){
	alert(1)
})
//兼容IE
document.getElementById('btn').attachEvent('click',function(){
	alert(1)
})
</script>
```
###事件委托
对“事件处理程序过多”问题的解决方案就是事件委托。事件委托利用了事件冒泡，只制定一个事件处理程序，就可以管理某一类型的所有事件。例如click事件一直会冒泡到document层。也就是我们可以只指定onclick事件处理程序，而不必给每个事件分别添加处理程序。
**下面我们来看一个阿里巴巴笔试题的例子。**

![这里写图片描述](https://s3.qiufengh.com/blog/1579506284537.png)

**样式以及DOM结构**

```css
 <style>
   * {
     padding: 0;
     margin: 0;
   }
   
   .head, li div {
     display: inline-block;
     width: 70px;
     text-align: center;
   }

   li .id, li .sex, .id, .sex {
     width: 15px;
   }

   li .name, .name {
     width: 40px;
   }

   li .tel, .tel {
     width: 90px;
   }

   li .del, .del {
     width: 15px;
   }

   ul {
     list-style: none;
   }

   .user-delete {
     cursor: pointer;
   }

 </style>
</head>

<body>
<div id="J_container">
	<div class="record-head">
	  <div class="head id">序号</div><div class="head name">姓名</div><div class="head sex">性别</div><div class="head tel">电话号码</div><div class="head province">省份</div><div class="head">操作</div>
	</div>
   <ul id="J_List">
     <li><div class="id">1</div><div class="name">张三</div><div class="sex">男</div><div class="tel">13788888888</div><div class="province">浙江</div><div class="user-delete">删除</div></li>
     <li><div class="id">2</div><div class="name">李四</div><div class="sex">女</div><div class="tel">13788887777</div><div class="province">四川</div><div class="user-delete">删除</div></li>
     <li><div class="id">3</div><div class="name">王二</div><div class="sex">男</div><div class="tel">13788889999</div><div class="province">广东</div><div class="user-delete">删除</div></li>
   </ul>
 </div>
 </body>
```

**不用事件委托。**而这种方法造成的代价是，性能的大量浪费。如果是成千上万条数据，**页面将会严重卡顿，甚至崩溃。**

```javascript
function Contact(){
    this.init();
}
	

Contact.prototype.init = function(){
	var userdel = document.querySelectorAll('.user-delete');
	for(var i=0;i<lis.length;i++){
		(function(j){
			userdel[j].onclick = function(){
	userdel[j].parentNode.parentNode.removeChild(userdel[j].parentNode);
			}
		})(i);
	}	
}

new Contact();
```

**使用事件委托**，只绑定一次事件，大大减少了性能的损耗。也是在需要大量事件处理程序中一种非常好的解决方式。

```javascript
function Contact(){
    this.init();
}
	

Contact.prototype.init = function(){
	var lis = document.querySelector('#J_List');
	lis.addEventListener('click', function(e){
		var target = e.target || e.srcElement;
		if (!!target && target.className.toLowerCase()==='user-delete') {				target.parentNode.parentNode.removeChild(target.parentNode);
		}
	})
}

new Contact();
```