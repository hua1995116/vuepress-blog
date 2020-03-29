# 二叉树之重建（js）


输入一颗二叉树的先序遍历和中序遍历，输出它的后序遍历。
输入：
DBACEGF ABCDEFG
BCAD CBAD
输出：
ACBFGED
CDAB

```javascript
	var root = {value: null, left: null, right: null};
    function build(root, s1, s2) {
        if (s1.length === 0 || s2.length === 0 ) {
            return;
        }

        var midnode = s2.indexOf(s1[0]);
        var mleft = s2.substring(0, midnode),
                mright = s2.substring(midnode + 1);
        var pleft = s1.substring(1, mleft.length + 1),
                pright = s1.substring(mleft.length + 1);
        root.value = s1[0];
        root.left = newchild();
        root.right = newchild();

        if(root.value) {
            build(root.left, pleft, mleft);
            build(root.right, pright, mright);
        }
    }
    function newchild() {
        return {value: null, left: null, right: null}
    }
    build(root, 'DBACEGF', 'ABCDEFG');

    function postrav(root) {
        if(root.value!==null){
            postrav(root.left);
            postrav(root.right);
            console.log(root.value);
        }

    }
    postrav(root);
```