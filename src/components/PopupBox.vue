<script setup lang="ts">
console.log('输入框')

const show = defineModel<boolean>('show', {
  type: Boolean,
  required: true,
  default: false
})

const props = withDefaults(defineProps<{
  background?: string
}>(), {
  background: undefined
})
</script>

<template>
  <van-popup
    v-model:show="show"
    safe-area-inset-top
    safe-area-inset-bottom
    round
    closeable
    position="bottom"
    :z-index="2000"
    class="popup-box"
    :style="props.background ? { background: props.background } : undefined"
  >
    <slot />
  </van-popup>
</template>

<style lang="less" scoped>
.popup-box {
  :deep(.van-popup) {
    padding-top: 0;
  }

  :deep(.van-popup__content) {
    padding-top: 0;
  }
}
</style>
