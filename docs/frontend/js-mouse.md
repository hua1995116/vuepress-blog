# javascript中onmousemove、onmouseover、onmouseenter 的不同


在比较onmousemove、onmouseover、onmouseenter 的不同之前，首先我们先看看各种onmouse事件的作用：

 - onmousedown    当元素上按下鼠标按钮时出发
 - onmousemove    当鼠标指针移动到水元素上时触发
 - onmouseover    当鼠标指针移动元素上时触发
 - onmouseout    当鼠标指针移出指定的对象时发生。
 - onmouseup      当在元素上释放鼠标按钮时触发
 - onmouseenter   事件在鼠标指针移动到元素上时触发。(不冒泡)
 - onmouseleave   事件在鼠标移除元素时触发。(不冒泡)

要知道onmouseenter 和onmouseleave事件是不冒泡的
以下例子可以知道onmousemove、onmouseover、onmouseenter的不同之处，以及各个onmouse事件执行先后顺序，在onmouseover、onmouseenter中，over还可以通过子元素的触发。
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style>
		.bg{
			width: 200px;
			height: 200px;
			background: #ddd;
			margin-top: 20px;
		}
	</style>
</head>
<body>
	<div class="bg" id="demo1" onmousemove="mymouseMove()" onmousedown="mymouseDown()" onmouseup="mymouseUp()" onmouseover="mymouseOver()" onmouseout="mymouseOut()" onmouseenter="mymouseEnter()" onmouseleave="mymouseLeave()"> 
		
	</div>
	<div class="bg" id="demo2" >
		 <p>onmouseover: <br> <span id="demo22">鼠标移动到我这!</span></p>
	</div>
	<div class="bg" id="demo3" >
		<p>onmouseenter: <br> <span id="demo33">鼠标移动到我这!</span></p>
	</div>
	<div class="bg" id="demo4" >
		 <p>onmousemove: <br> <span id="demo44">鼠标移动到我这!</span></p>
	</div>
</body>
<script>
	var x = 0;
	var y = 0;
	var z = 0;
	function mymouseDown(){
		document.getElementById('demo1').innerHTML = 'down';
		console.log('down');
	}
	function mymouseMove(){
		document.getElementById('demo1').innerHTML = 'move';
		console.log('move');
	}
	function mymouseUp(){
		document.getElementById('demo1').innerHTML = 'up';
		console.log('up');
	}
	function mymouseOver(){
		document.getElementById('demo1').innerHTML = 'over';
		console.log('over');
	}
	function mymouseOut(){
		document.getElementById('demo1').innerHTML = 'out';
		console.log('out');
	}
	function mymouseEnter(){
		document.getElementById('demo1').innerHTML = 'enter';
		console.log('enter');
	}
	function mymouseLeave(){
		document.getElementById('demo1').innerHTML = 'leave';
		console.log('leave');
	}

	document.getElementById('demo2').onmouseover = function(){
		document.getElementById("demo22").innerHTML = x+=1;
	}
	document.getElementById('demo3').onmouseenter = function(){
		document.getElementById("demo33").innerHTML = y+=1;
	}
	document.getElementById('demo4').onmousemove = function(){
		document.getElementById("demo44").innerHTML = z+=1;
	}
</script>
</html>
```