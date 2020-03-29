# 你不知道的javascript之node类型详解


前段时间有做过一个关于节点操作的排序问题，
[http://blog.csdn.net/blueblueskyhua/article/details/68929578](http://blog.csdn.net/blueblueskyhua/article/details/68929578)
今天就node类型，进行详细的讲解。首先看下他的兼容性。
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284759.png)
node共有12类型。
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284764.png)
类型详情可以参考[http://www.w3school.com.cn/jsref/prop_node_nodetype.asp](http://www.w3school.com.cn/jsref/prop_node_nodetype.asp)
**1.nodeValue和nodeName**
其中最常用的就是1和3，那今天我们就1和3来展开讲解，了解节点的属性主要有nodeValue和nodeName两个属性。分别获取节点类型和节点的名字。
**2.节点关系**
每个节点含有childNodes属性，其中保存着一个NodeList对象，NodeList对象是一个类数组对象，用于保存有序的节点，可以通过位置来访问。虽然可以用过方括号来访问NodeList的值，而且这个对象也有length属性，但是它并不是一个Array的实例。

```javascript
//展示节点访问
var node1 = node.childNodes[0];
var node2 = node.childNodes.item(0);
var length = node.childNodes.length;
```
如果需要操作NodeList就需要将它转化成数组。我就是因为一开始不知道他是个类数组对象，将他一直以数组进行操作，利用slice进行删除，怎么都删除不了。下面我就讲讲转化为数组的方法。

```javascript
function ToArray(nodes){
	var array = null;
	try{
		array = Array.prototype.slice.call(nodes, 0);
	} catch(ex) {
		array = new Array();
		for(var i = 0;i<nodes.length;i++){
			array.push(node[i]);
		}
	}
	return array;
}
```
通过转化成数组，可以进行一些常见的操作，例如表单排序，删除等操作。
下面用一张图讲解一些关于node的父子兄弟节点的关系。

![这里写图片描述](https://s3.qiufengh.com/blog/1579506286331.jpg)

**3.操作节点**
appendChild，用于向childeNodes的尾部追加一个节点。

```html
<ul id="ul">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
</ul>
<script>
	var lis = document.getElementById('ul');
	var lis4 = document.getElementById('ul').childNodes[3];
	lis.appendChild(lis4);
</script>
```
追加前
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284398.png)
追加后
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284907.png)

insertBefore，接受两个参数：要插入的节点和参照的节点。

```javascript
//插入后成为最后一个节点
returnedNode = someNode.insertBefore(newNode, null);
//插入后成为第一个节点
returnedNode = someNode.insertBefore(newNode, someNode.firstNode);
//插入到最后一个节点前面
returnedNode = someNode.insertBefore(newNode,some.lastChild);
```
这里需要防坑

```html
<ul id="ul">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
</ul>
```
以上获得的childNodes个数为9个。因为Chrome、Firefox、IE9+等标准浏览器下，使用childNodes获取节点，它会将空格符、回车符、换行符也看做一个文本节点，而IE8及以下，则会无视空格、回车符。
所以，想要获取正确的节点个数。
需要使得node.nodeType === 1来过滤空白节点。
replaceChild，接受两个参数：要插入的节点和要替换的节点。

```javascript
//替换第一个子节点
var returnedNode = someNode.replaceChild(newNode, someNode.firstChild);
```
