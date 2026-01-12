<script setup lang="ts">
  import EmptyIcon from '@/assets/public/empty-icon.png'
</script>

<template>
  <div class="empty-container">
    <div class="empty-image-wrapper">
      <van-image
        :src="EmptyIcon"
        fit="scale-down"
        class="empty-image"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.empty-container {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.empty-image-wrapper {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-image {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  border-radius: 50%;
  background: transparent;
  display: block;
}
</style>
