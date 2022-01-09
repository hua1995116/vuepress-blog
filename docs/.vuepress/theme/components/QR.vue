<template>
  <div class="qr">
    <img src="https://s3.qiufeng.blue/blog/erweima.jpg" alt="秋风的比较" width="120" height="120" loading="lazy">
    <p class="we-intro">
      如果你对前端，Node，开源项目感兴趣请关注我的公众号 <a target="_blank" href="https://mp.weixin.qq.com/s/pKoliWlgtV-qm6orbyTz0Q">秋风的笔记</a>。
    </p>
  </div>
</template>

<script>
export default {
  name: "QR",
};
</script>

<style>
.qr {
  margin-top: 10px;
  margin-bottom: -1rem;
  display: flex;
}

.qr .we-intro {
  color: #0006;
  font-size: 0.8em;
  width: 54%;
}

.qr .we-highlight {
  color: #3eaf7c;
  font-weight: 900;
  font-style: italic;
}
</style>
