<script setup lang="ts">
  import EmptyIcon from '@/assets/public/empty-icon.png'
</script>

<template>
  <div class="empty-container">
    <van-image round :src="EmptyIcon" fit="cover" />
  </div>
</template>

<style lang="less" scoped>
.empty-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
