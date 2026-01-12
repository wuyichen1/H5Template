<script setup lang="ts">
  defineOptions({
    name: 'Follow'
  })
</script>

<template>
  <div safe-area-inset-top class="follow_box">
    <my-list />
  </div>
</template>

<style lang="less" scoped>
  .follow_box {
    padding-top: calc(
      var(--van-nav-bar-height) + var(--ai-view-padding-top)
    );
    background: #0e080f;
    background-image: url('@/assets/public/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
  }
</style>
