# css3实现圆环加载进度条动画


最近有人问我关于css3圆环的问题，要实现一个圆环，并且有加载特效。于是我看了看一般关于圆环实现的原理，以及自己手写了一个加载动画。可能体验还不是特别好，但是能用。话不多说，一下是代码：

####**html结构**：
```html
<div class="circle">
	<div class="left">
		<div class="left_con"></div>
	</div>
	<div class="right">
		<div class="right_con"></div>
	</div>
	<div class="mask">
		<span>60</span>%
	</div>
</div>
```

####**css**：
```css
.circle{
	width: 200px;
	height: 200px;
	position: relative;
	border-radius: 50%;
	background:  rgba(0,120,200,0.2);
}
.circle .left,.circle .right{
	width: 200px;
	height: 200px;
	position: absolute;
	top: 0;
	left: 0;
}
.left{
	clip: rect(0,100px,auto,0);
}
.right{
	clip: rect(0,auto,auto,100px);
}
.left_con,.right_con{
	display: block;
	width: 200px;
	height: 200px;
	border-radius: 50%;
	background: rgb(0,120,200);	
	position: absolute;
	top: 0;
	left: 0;
}
.left_con{
	clip: rect(0,100px,auto,0);
}
.right_con{
	clip: rect(0,auto,auto,100px);
}
.mask {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	left: 25px;
	top: 25px;
	background: #FFF;
	position: absolute;
	text-align: center;
	line-height: 150px;
	font-size: 16px;
}
```
**为操作方便引入了jq**

```html
<script src="http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
```

####**js代码**：
```javascript
var annulus = function(speed){
	var _this = this;
	_this.speed = speed||10;
	function init(){
		circle();
	}
	function circle(){
		$('.circle').each(function(index, el) {
			var numStart = 0;
			var num = $(this).find('span').text() * 3.6;
			var timer = null;
			var that = this;
			timer = setInterval(function(){
				if(numStart>num){
					clearInterval(timer);
					tiemr = null;
				}
				animateLoading(that,numStart);
				numStart += 3.6;
			},_this.speed);
		});
	}
	function animateLoading(_this,num){
		if (num <= 180) {
			$(_this).find('.right_con').css({'transform':"rotate(" + num + "deg)"});

		} else {
			$(_this).find('.right_con').css({'transform': "rotate(180deg)"});
			$(_this).find('.left_con').css({'transform': "rotate(" + (num - 180) + "deg)"});
		};
	};
	return {
		init:init
	}
}

var a = new annulus(10);
a.init();
```