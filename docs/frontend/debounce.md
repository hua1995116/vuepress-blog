# debounce与throttle实现与原理

# 前言
前端时间在面试中，面试官让我写一个关于input输入框，并且实时搜索的问题，我就当然用keyup事件来写，写完面试官还是挺满意的。又问我一个问题，如何减少每次输入频繁请求的性能开销。这个我就犯难了。事后，我百度了下，查到了throttle（节流）和debounce（去抖）。
我还百度到，这些事件的运用场景：

- 鼠标事件：mousemove(拖曳)/mouseover(划过)/mouseWheel(滚屏)
- 键盘事件：keypress(基于ajax的用户名唯一性校验)/keyup(文本输入检验、自动完成)/keydown(游戏中的射击)
- window的resize/scroll事件(DOM元素动态定位)

# debounce实现
throttle：连续的时间间隔(每隔一定时间间隔执行callback)。

debounce：空闲的时间间隔(callback执行完，过一定空闲时间间隔再执行callback)。

## 自己实现一个debounce：
主要思路是通过一个不断清除定时器，创建定时器的过程。
```javascript
/**
 *
 * @param func {Function}   实际要执行的函数
 * @param wait {Number}  延迟时间，单位是毫秒（ms）
 * @param wait {Boolean}  一定时间内，先执行／后执行
 * 
 * @return {Function}     返回一个“去抖”了的函数
 */

var debounce = function(func, wait, immediate) {
	// 设置定时器
	let timeout;
	return (...args) => {
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(this, args);
		};
		const callNow = immediate && !timeout;
		// 进入先清除定时器 
		claerTimeout(timeout);
		// 重新设置一个定时器，如果没有连续触发函数，就执行定时器，也是就是核心原理
		timeout = setTimeout(later, wait);
		if (callNow) 
			func.apply(this, args);
	}
}；
```
我们下面来看一个实例：
```javascript
window.addEventListener('resize',debounce(function(){
    	console.log(1);
    },1000,true));
```
可以看到，你如果一直快速的改变浏览器的大小，console.log(1);只会执行一次。只有在你规定的时间内，不发生第二次改变，他才会再一次地输出console.log。

## _的.debounce()分析

**underscore(v1.8.3)：**
```javascript
_.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {

        var last = _.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
            // wait-last 用来补充触发时的时间，从而达到从触发到下一次触发这又一个设定的闭环时间。
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = _.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
};
```
可以看到underscore的实有些不同，他的每一次定时器不清除timeout = setTimeout(later, wait);这个语句，每隔wait时间，会触发一次，但是在later函数中，会进行判断，如果在规定时间内再次触发这个函数，是不会触发func的。
**lodash：**

在lodash中的实现和我自己实现的异曲同工。想要看细节，请移步lodash官网吧。
# throttle实现

## 自己实现一个throttle
核心思想，通过记录时间差，来判断是否执行func。
```javascript
/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  执行间隔，单位是毫秒（ms）
*
* @return {Function}     返回一个“节流”函数
*/

function throttle(fn, threshhold) {

  // 记录上次执行的时间
  var last

  // 定时器
  var timer

  // 默认间隔为 250ms
  threshhold || (threshhold = 250)

  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    var now = +new Date()

    // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshhold) {
      clearTimeout(timer)

      // 保证在当前时间区间结束后，再执行一次 fn
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)

    // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}
```
## _的.underscore()分析

**underscore(v1.8.3)：**
```javascript
_.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = _.now();
    // 记录第一次进入时间
    if (!previous && options.leading === false) previous = now;
    // 剩余时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 判断是否间隔规定时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
```
lodash中的实现只是将debounce封装了一层，就不进行讲解了。

参考文章：http://www.qidiantong.com/javascript/3876.html