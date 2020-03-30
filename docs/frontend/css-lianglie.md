# css实现左边定宽右边自适应的两列布局5种方法


在项目实践中不乏有需要两列式布局，左侧固定右侧自适应是比较常见的布局方式，现在我就来总结一下我自己所知道的5种方法。
html代码结构：

```html
<div class="box">
	<div class="con1">
		我是左边
	</div>
	<div class="con2">
		我是右边
	</div>
</div>
```
第一种：
css代码：

```css
.box{
	display: flex;
	display: -webkit-flex;
}
.con1{
	flex:0 1 100px;
	background: #ff0;
}
.con2{
	flex:1;
	background: #fe3;
}
```
效果如下
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284786.png)
第二种：
css代码：

```css
.con1{
	width: 100px;
	float: left;
	background: #ff0;
}
.con2{
	overflow: hidden;
	background: #fe3;
}
```
第三种：
css代码：

```css
.con1{
	width: 100px;
	float: left;
	background: #ff0;
}
.con2{
	margin-left:100px;
	background: #fe3;
}
```
第四种：
css代码：

```css
.box{
	position: relative;
}
.con1{
	position: absolute;
	left: 0;
	top:0;
	width: 100px;
	background: #ff0;
}
.con2{
	margin-left:100px;
	background: #fe3;
}
```
第五种：
css代码：

```css
.box{
	position: relative;
}
.con1{
	position: absolute;
	left: 0;
	top:0;
	width: 100px;
	background: #ff0;
}
.con2{
	position: absolute;
	left: 100px;
	top:0;
	right: 0;
	width: 100%;
	background: #fe3;
}
```