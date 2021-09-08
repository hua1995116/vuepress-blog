# js实现表格排序


用js实现表格排序。
![这里写图片描述](https://s3.qiufeng.blue/blog/1579506284765.png)
第一点击以降序排列，第二次点击以升序排列
html代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<table border="1">
		<tr>
			<th>学号</th>
			<th>名字</th>
			<th id="sort">成绩</th>
		</tr>
		<tr>
			<td>1002</td>
			<td>小铭</td>
			<td>34</td>
		</tr>
		<tr>
			<td>1003</td>
			<td>小红</td>
			<td>64</td>
		</tr>
		<tr>
			<td>1004</td>
			<td>小黄</td>
			<td>24</td>
		</tr>
		<tr>
			<td>1005</td>
			<td>小米</td>
			<td>53</td>
		</tr>
		<tr>
			<td>1006</td>
			<td>小蒋</td>
			<td>78</td>
		</tr>
		<tr>
			<td>1007</td>
			<td>小捷</td>
			<td>97</td>
		</tr>
		<tr>
			<td>1004</td>
			<td>小邓</td>
			<td>65</td>
		</tr>
	</table>
</body>
</html>	
```
js代码

```javascript
<script>
	var sort = document.getElementById('sort');
	var up = true
	sort.onclick = function(){
		var table = document.getElementsByTagName('table')[0];
		var tr = table.getElementsByTagName('tr');
		var array = [];
		for (var i = 1;i < tr.length;i++) {
			array.push(tr[i]);
		}
		if (up) {
			SortUp (array);
			up = false;
		} else {
			SortDown (array);
			up = true;
		}
		
		for (var i = 0; i < array.length; i++){
			table.appendChild(array[i]);
		}
	}
	function SortUp(array){
		for (var i = 0;i < array.length;i++) {
			for (var j = i + 1;j < array.length;j++) {
				if (array[j] === undefined) {
					continue;
				}
				if (array[i].getElementsByTagName('td')[2].innerText <= array[j].getElementsByTagName('td')[2].innerText) {
					var temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
			}
		}
	}
	function SortDown(array){
		for (var i = 0;i < array.length;i++) {
			for (var j = i + 1;j < array.length;j++) {
				if (array[j] === undefined) {
					continue;
				}
				if (array[i].getElementsByTagName('td')[2].innerText >= array[j].getElementsByTagName('td')[2].innerText) {
					var temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
			}
		}
	}
</script>
```