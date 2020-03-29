# 原生JS实现ajax上传文件并显示进度条

html代码

```html
<progress id="progressbar" value="0" max="100" style="width:300px;"></progress><span id="percentage"></span>
<input type="file" id="file" name="file" />
<input type="button" onclick="uploadFile()" value="上传" />
<div id="fileimg">
	<div id="loading-cover"></div>
	<div id="showloading"></div>
</div>
```
css代码
```css
#fileimg{
		width:300px;
		height: 300px;
		overflow: hidden;
		border:1px solid #ddd;
		position: relative;
	}
	#fileimg img {
		width: 100%;
		position: absolute;
		top:0;
		left: 0;
		z-index: 1;
	}
	#loading-cover{
		width: 300px;
		height: 300px;
		position: absolute;
		background: rgba(0,0,0,0.3);
		top:0;
		left: 0;
		z-index: 2;
	}
	#showloading{
		width: 300px;
		position: absolute;
		bottom: 0;
		text-align: center;
		z-index: 3;
	}
```

js代码

```javascript
function uploadFile(){
	var fileObj = document.getElementById('file').files[0];	
	showImg(fileObj);
	if(fileObj){
		var url = "uploadimage.jsp";
		var form = new FormData();
		form.append('myfile',fileObj);
		xhr = new XMLHttpRequest();
		xhr.open("post",url,true);
		xhr.onload = uploadComplete; //请求完成
        xhr.onerror =  uploadFailed; //请求失败
        xhr.upload.onprogress = progressFunction;
        xhr.send(form);
	}else{
	alert('请选择文件');
	}
}

function showImg(fileObj){
	var fileimg = document.getElementById('fileimg');	
	var src = window.URL.createObjectURL(fileObj);
	var img = document.createElement("img");
     img.src = src;
     fileimg.appendChild(img);
}
function progressFunction(evt){
	var loadingCover = document.getElementById('loading-cover');
	var showloading = document.getElementById('showloading');
	var progressBar = document.getElementById('progressbar');
	var percentage = document.getElementById('percentage');
	if(evt.lengthComputable){
		progressbar.max = evt.total;
		progressBar.value = evt.loaded;
		var loading = Math.round(evt.loaded / evt.total * 100);
		percentage.innerHTML = loading + '%';
		showloading.innerHTML = loading + '%';
		loadingCover.style.top = -loading + '%';
		if(loading==100){
			showloading.style.display = 'none';
		}
	}
}
function uploadComplete(evt) {
  //服务断接收完文件返回的结果
  //    alert(evt.target.responseText);
      console.log("上传成功！");
 }
 //上传失败
 function uploadFailed(evt) {
     console.log(evt);
 }
```

github地址：https://github.com/hua1995116/UploadLoading/（包含后台代码）