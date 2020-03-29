# 2018网易前端实习笔试题


前端时间做了网易前端实习的笔试题，偶像想起，总结一下，前面的选择题，我就不一一细说了，主要考察的是对于前端的基础，以及计算机基础，这次主要讲下算法题。所有算法我均用js所写，不同语言思路均相同。
（以下都是我对题目的简述）
**1.小易学了集合，已知集合有三个性质：确定性、互异性、无序性，现有以下算式**![这里写图片描述](https://s3.qiufengh.com/blog/1579506284518.png)
**输入x,y,z,w确定集合内元素的个数。**
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284561.png)
**input:1,2,3,4**
**output:4**

首先拿到这题，可以看到集合的特性，其中最重要的就是这个确定性，说的就是不能重复，我就想到了数组去重，按着这个思路下去，我便找到了解题的思路。上代码，算法实现都是在node环境下。例如，将以下代码保存为array.js ,执行node  array.js。输入四个数字，遇到换行为结束。

```javascript
process.stdin.resume(); 
process.stdin.setEncoding('ascii'); 

var input = ""; 
var input_array = ""; 

process.stdin.on('data', function (data) { 
    input += data; //接受到的输入
    chunk = data.slice(0,-2);
    if(chunk === ""){//遇到空字符执行end
        process.stdin.emit('end');
        return
    }
}); 

process.stdin.on('end', function () { 
    input_array = input.split("\n"); 将输入的以换行符进行分割
    var s = input_array[0];//取第一行
    s = s.split(' ');以空格进行分割输入的字符
    var count=[];//空数组
    var a = parseInt(s[0]);var b = parseInt(s[1]); var c = parseInt(s[2]);var d = parseInt(s[3]); //保存输入的数字
    for(var i = a;i<=b;i++){
        for(var j = c;j<=d;j++){
            var num = i/j;
            if(count.indexOf(num)===-1){//检查空数组是否含有当前数字
               count.push(num);
            }
        }
    }
    
    console.log(count.length);
});
```

**2.小易生活的世界没有除号，而且所有的运算都是从左往右依次进行计算**
**input: 3+6*5**
**output: 45**

```javascript
我想的就是首先让他第一次运算直接执行，如果后面还有字符，那就判断间隔判断符号，依次进行计算

process.stdin.resume(); 
process.stdin.setEncoding('ascii'); 

var input = ""; 
var input_array = ""; 

process.stdin.on('data', function (data) { 
    input += data; 
    chunk = data.slice(0,-2);
    if(chunk === ""){
        process.stdin.emit('end');
        return
    }
}); 

process.stdin.on('end', function () { 
    input_array = input.split("\n"); 
    var s = input_array[0];
    s = s.split('');
    var data=0;
    if(s[1]=='*'){
    	data = parseInt(s[0])*parseInt(s[2]);
	}else if(s[1]=='+'){
		data = parseInt(s[0])+parseInt(s[2]);
	}else{
		data = parseInt(s[0])-parseInt(s[2]);
	} 
    if(s.length>4){
    	for(var i=3;i<s.length-1;i=i+2){
	    	if(s[i]=='*'){
	    		data = data*parseInt(s[i+1]);
	    	}else if(s[i]=='+'){
	    		data = data + parseInt(s[i+1]);
	    	}else{
	    		data = data - parseInt(s[i+1]);
	    	} 
	    }
    }
    console.log(data);
});


```
**3.有一串数字。如下，去重，并且取重复数字的最后一次出现位置。并输出。**
**input：100，99，99，100，99，100，100**
**output：99，100**
乍一看这题还是蛮简单，我想着，这不是直接将序列倒叙一下，再进行排序不就好了吗，其实并不是这样。
我的思路是，新建一个数组a，读取当前数组b中的一个数字，查询新数组a中是否含有这个数字，如果不存在，就查询当前数组b这个数字的最后的索引。将新建数组a的与b中相同索引的位置插入此数字，这样。就直接能排好序列了，而且还能去重复，最后将数组中的空位置去掉。
```javascript


process.stdin.resume(); 
process.stdin.setEncoding('ascii'); 

var input = ""; 
var input_array = ""; 

process.stdin.on('data', function (data) { 
    input += data; 
    chunk = data.slice(0,-2);
    if(chunk === ""){
        process.stdin.emit('end');
        return
    }
}); 

process.stdin.on('end', function () { 
    input_array = input.split("\n"); 
    var s = input_array[1];
    s = s.split(' ');
    s[s.length-1] = s[s.length-1].replace('\r','');
    var a = [];
    for(var i =0;i<s.length;i++){
    	// console.log(a.lastIndexOf(s[i]));
    	if(a.indexOf(s[i])===-1){//查询是否含有数字
    		var num = s.lastIndexOf(s[i]);查询最后的索引
    		a[num] = s[i];
    	}
    }
    console.log(a.join(' ').replace(/\s+/g, ' ').trim());//此步骤是为了去除空格，为了和最后的输出的格式相同。
});


```

**除了以上算法题目最后还有一题js的demo题**
有以下表格。点击成绩能够使表格按成绩从高到底排序。
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284511.png)

此题的方法就查看我之前的一篇博客
[http://blog.csdn.net/blueblueskyhua/article/details/68929578](http://blog.csdn.net/blueblueskyhua/article/details/68929578)

