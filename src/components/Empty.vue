<script setup lang="ts">
  import EmptyIcon from '@/assets/public/empty-icon.png'
</script>

<template>
  <div class="empty-container">
    <van-image
      :src="EmptyIcon"
      fit="scale-down"
      class="empty-image"
    />
  </div>
</template>

<style lang="less" scoped>
.empty-container {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 让图片完整显示不被裁切 */
  background: transparent;
}

.empty-image {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  border-radius: 50%;
  background: transparent;
}
</style>
