<script setup lang="ts">
  defineOptions({
    name: 'Fans'
  })
</script>

<template>
  <div safe-area-inset-top class="fans_box">
    <my-list type="fans" />
  </div>
</template>

<style lang="less" scoped>
  .fans_box {
    padding-top: calc(
      var(--van-nav-bar-height) + var(--ai-view-padding-top)
    );
    min-height: 100vh;
    background: #0e080f;
    background-image: url('@/assets/public/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
