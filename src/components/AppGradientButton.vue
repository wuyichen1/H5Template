<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <button ai-gradient-btn class="app-gradient-btn" type="button">
    {{ label || 'Log in' }}
  </button>
</template>

<style scoped lang="less">
  .app-gradient-btn {
    width: 100%;
    border: 1px solid #fff;
    background:
      linear-gradient(201.44deg, #1c7bff 0%, #000 51.28%, #ff8133 100%) !important;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
  }
</style>

