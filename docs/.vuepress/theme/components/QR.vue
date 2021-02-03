<template>
  <div class="qr">
    <img src="https://s3.qiufengh.com/blog/erweima.jpg" alt="秋风的比较" width="120" height="120" loading="lazy">
    <p class="we-intro">
      如果你对前端，Node，开源项目感兴趣请关注我的公众号<span class="we-highlight">秋风的笔记</span>。
    </p>
  </div>
</template>

<script>
export default {
  name: 'QR'
}
</script>

<style>
.qr {
  margin-top: 10px;
  margin-bottom: -1rem;
  display: flex;
}

.qr .we-intro {
  color: #0006;
  font-size: .8em;
  width: 54%;
}

.qr .we-highlight {
  color: #3eaf7c;
  font-weight: 900;
  font-style: italic;
}
</style>
