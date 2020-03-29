# 二叉树之小球下落问题（js）


有一棵二叉树，最大深度为D，且所有叶子的深度都相同。所有结点从上到下从左到右编号为1，2，3，...，2^D-1。在结点1处放一个小球，它会往下落。每个内结点上都有一个开关，初始全部关闭，当每次有小球落到一个开关上时，它的状态都会改变。当小球到达一个内结点时，如果该结点上的开关关闭，则往左走，否则往右走，知道走到叶子结点，如图。

![这里写图片描述](https://s3.qiufengh.com/blog/1579506284862.png)
一些小球从结点1处开始下落，最后一个小球将会落到哪里呢，输入叶子深度D和小球个数I，输出第I个小球最后的叶子编号。假设I不超过整棵树的叶子个数。D<=20。
**输入**：
4 2
3 4
10 1
**输出**：
12
7
512
		
代码：

```javascript
function drop(depth, count) {
        var arr = [];
        var r;
        for (var i = 0; i < count; i++) {
            for (var root = 1; root < Math.pow(2, depth - 1);) {
                if (arr[root] && arr[root].open) {
                    arr[root].open = false;
                    root = root * 2 + 1;
                } else {
                    if (!arr[root]) {
                        arr[root] = {open: true};
                    } else if (arr[root].open === false) {
                        arr[root].open = true;
                    }
                    root = root * 2;
                }
            }
            r = root;
        }
        return r;
    }
    console.log(drop(4, 2));// 12
    console.log(drop(3, 4));// 7
    console.log(drop(10, 1));// 512
```
