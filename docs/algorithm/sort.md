# 排序算法之堆排序（js）


```javascript
	var floor = Math.floor;
    var H = {
        1: 9,
        2: 8,
        3: 7,
        4: 6,
        5: 5,
        6: 4,
        7: 3,
        8: 2,
        9: 1
    };
    // 向上
    function sift_up(H, i) {
        var done = false;
        if (i !== 1) {
            while (!done && i !== 1) {
                if (H[i] > H[floor(i / 2)]) {
                    var temp;
                    temp = H[i];
                    H[i] = H[floor(i / 2)];
                    H[floor(i / 2)] = temp;
                } else {
                    done = true;
                }
                i = floor(i / 2);
            }
        }
        return H;
    }
    // 向下
    function sift_down(H, n, i) {
        var done = false;
        if ((2 * i) < n) {
            while (!done && ((i = i * 2) <= n)) {
                if ((i + 1) < n && (H[i + 1] > H[i])) {
                    i = i + 1;
                }
                if (H[floor(i / 2)] < H[i]) {
                    var temp;
                    temp = H[i];
                    H[i] = H[floor(i / 2)];
                    H[floor(i / 2)] = temp;
                } else {
                    done = true;
                }
            }
        }
        return H;
    }
    // 增加
    function insert(H, n, x) {
        n = n + 1;
        H[n] = x;
        return sift_up(H, n);
    }
    // 删除
    function deleteobj(H, n, i) {
        var x, y;
        x = H[i];
        y = H[n];
        delete H[n];
        n = n - 1;
        if (i <= n) {
            H[i] = y;
            if (y > x) {
                return sift_up(H, i);
            } else {
                return sift_down(H, n, i);
            }
        }
    }
    // 创建
    function meakup(A, H, n) {
        var i, m = 0;
        for (i = 1; i <= n; i++) {
            H = insert(H, m, A[i]);
            m++;
        }
        return H;
    }
    // 创建
    var H1 = {};
    H1 = meakup(H,H1,9)
    console.log(H1);
    // 向上
    H[9] = 10;
    var cc = sift_up(H, 9);
    console.log(cc);
    // 删除
    console.log(deleteobj(H, 9, 3));
```