export let requestHostCallback;
export let cancelHostCallback;
export let shouldYieldToHost;
export let getCurrentTime;

const ANIMATION_FRAME_TIMEOUT = 100;
let rAFID;
let rAFTimeoutID;
// ② 调用 requestAnimationFrame, 并对执行时间超过 100 ms 的任务用 setTimeout 进行处理
const requestAnimationFrameWithTimeout = function(callback) {
  rAFID = requestAnimationFrame(function(timestamp) {
    clearTimeout(rAFTimeoutID);
    callback(timestamp); // 一帧中任务调用的核心流程的实现, 接着看第 ③ 步
  });
  // 如果在一帧中某个任务执行时间超过 100 ms 则终止该帧的执行并将该任务放入下一个事件队列中
  rAFTimeoutID = setTimeout(function() {
    cancelAnimationFrame(rAFID);
    callback(getCurrentTime());
  }, ANIMATION_FRAME_TIMEOUT);
};

getCurrentTime = function() {
  return performance.now();
};

let scheduledHostCallback = null; // 调度器回调函数
let isMessageEventScheduled = false; // 消息事件是否执行
let timeoutTime = -1;

let isAnimationFrameScheduled = false;

let isFlushingHostCallback = false;

let frameDeadline = 0; // 当前帧的截止时间

// 假设最开始的 FPS(feet per seconds) 为 30, 但这个值会随着动画帧调用的频率而动态变化
let previousFrameTime = 33; // 一帧的时间: 1000 / 30 ≈ 33
let activeFrameTime = 33;

shouldYieldToHost = function() {
  return frameDeadline <= getCurrentTime();
};

const channel = new MessageChannel();
const port = channel.port2;
// ④ 接受 `postMessage` 指令, 触发消息事件的执行。在其中判断任务是否在当前帧执行，如果在的话执行该任务
channel.port1.onmessage = function(event) {
  isMessageEventScheduled = false;

  const prevScheduledCallback = scheduledHostCallback;
  const prevTimeoutTime = timeoutTime;
  scheduledHostCallback = null;
  timeoutTime = -1;

  const currentTime = getCurrentTime();

  let didTimeout = false; // 是否超时
  // 如果当前帧已经没有时间剩余, 检查是否有 timeout 参数，如果有的话是否已经超过这个时间
    console.log('是否有时间', frameDeadline - currentTime);
  if (frameDeadline - currentTime <= 0) {
    if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
      // didTimeout 为 true 后, 在当前帧中执行(针对优先级较高的任务)
      didTimeout = true;
    } else {
      // 在下一帧中执行
      if (!isAnimationFrameScheduled) {
        isAnimationFrameScheduled = true;
        requestAnimationFrameWithTimeout(animationTick);
      }
      scheduledHostCallback = prevScheduledCallback;
      timeoutTime = prevTimeoutTime;
      return;
    }
  }

  if (prevScheduledCallback !== null) {
    isFlushingHostCallback = true;
    try {
      prevScheduledCallback(didTimeout);
    } finally {
      isFlushingHostCallback = false;
    }
  }
};

// ③ requestAnimationFrame 的回调函数。传入的 rafTime 为执行该帧的时间戳。
const animationTick = function(rafTime) {
  console.log("rafTime", rafTime);
  // 如果存在调度器回调函数则在一帧的开头急切地安排下一帧的动画回调(急切是因为如果在帧的后半段安排动画回调的话, 就会增大下一帧超过 100ms 的几率, 从而会浪费一个帧的利用, 可以结合步骤②来理解这句话), 如果不存在调度器回调函数否则立马终止执行。
  if (scheduledHostCallback !== null) {
    requestAnimationFrameWithTimeout(animationTick);
  } else {
    isAnimationFrameScheduled = false;
    return;
  }
  console.log(
    "frameDeadline, activeFrameTime",
    frameDeadline,
    "-",
    activeFrameTime
  );
  let nextFrameTime = rafTime - frameDeadline + activeFrameTime; // 当前帧开始调用动画的时间 - 上一帧调用动画的截止时间 + 当前帧执行的时间，这里的 nextFrameTime 仅仅是临时变量
  // 如果连续两帧的时间都小于当前帧的时间, 则说明得调高 FPS
  if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
    // 将 activeFrameTime 的值减小相当于调高 FPS。同时取 nextFrameTime 与 previousFrameTime 中较大的一个以让前后两帧都不出问题。
    activeFrameTime =
      nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    console.log("activeFrameTime==", activeFrameTime);
  } else {
    previousFrameTime = nextFrameTime;
    console.log("previousFrameTime==", previousFrameTime);
  }
  frameDeadline = rafTime + activeFrameTime; // 当前帧的截止时间(上面几行代码的目的是得到该 frameDeadline 值, 该值在 postMessage 会用来判断)
  console.log("frameDeadline", frameDeadline);
  if (!isMessageEventScheduled) {
    isMessageEventScheduled = true;
    port.postMessage(undefined); // 最后进入第④步, 通过 postMessage 触发消息事件。
  }
};

// DOM 环境下 requestIdleCallback 的实现, 这里第二个参数在最新的 requestIdleCallback 中因为对象类型
requestHostCallback = function(callback, absoluteTimeout) {
  scheduledHostCallback = callback; // 这里的 callback 为调度器回调函数
  timeoutTime = absoluteTimeout;
  if (isFlushingHostCallback || absoluteTimeout < 0) {
    // 针对优先级较高的任务不等下一个帧，在当前帧通过 postMessage 尽快执行
    port.postMessage(undefined);
  } else if (!isAnimationFrameScheduled) {
    // ① 如果 rAF 在当前帧没有安排任务, 则开始一个帧的流程
    isAnimationFrameScheduled = true;
    requestAnimationFrameWithTimeout(animationTick);
  }
};

cancelHostCallback = function() {
  scheduledHostCallback = null;
  isMessageEventScheduled = false;
  timeoutTime = -1;
};
