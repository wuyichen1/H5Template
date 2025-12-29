<script setup lang="ts">
  import { useAppImgStyle } from '@/hooks/useAppImgStyle'

  const { inputSendIcon } = useAppImgStyle()

  const value = ref('')

  const emit = defineEmits<{
    send: [_: string]
  }>()
  const onSend = () => {
    emit('send', value.value)
    value.value = ''
  }
</script>

<template>
  <div safe-area-inset-bottom px-layout-padding class="input-box">
    <div class="input--width">
      <van-field
        v-model="value"
        safe-area-inset-bottom
        placeholder="Say something"
        class="input-field"
      />
    </div>
    <van-image 
      class="send-icon"
      :src="inputSendIcon" 
      @click="onSend"
      :style="{
        width: 'var(--comment-input-image-width)',
        height: 'var(--comment-input-image-height)'
      }"
    />
  </div>
</template>

<style lang="less" scoped>
  .input-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;

    opacity: 1;
    background: linear-gradient(
      0deg,
      rgba(14, 8, 15, 0.8) 0%,
      rgba(14, 8, 15, 0) 100%
    );

    .input--width {
      width: var(--ai-field-input-width);
      padding-bottom: calc(10px + var(--ai-view-padding-bottom));
    }

    .send-icon {
      position: absolute;
      right: 20px;
      bottom: calc(10px + var(--ai-view-padding-bottom));
      margin: 0;
      padding: 0;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      height: var(--ai-field-input-height);
    }

    .input-field {
      border-radius: var(--ai-field-input-border-radius);
      height: var(--ai-field-input-height);
      font-size: var(--ai-field-input-font-size);
      font-weight: var(--ai-field-input-font-weight);
      background: var(--ai-field-input-bg-color);
      padding-left: 16px;

      // 移除 van-cell 的默认 padding
      :deep(.van-cell) {
        padding: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 0;
        padding-left: 0;
      }

      :deep(.van-field__body) {
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: var(--ai-field-input-padding-left, 16px);
        padding-right: 0;

        input {
          color: var(--ai-field-input-text-color);

          &::placeholder {
            color: var(--ai-field-placeholder-text-color);
            font-size: var(--ai-field-input-font-size);
            font-weight: var(--ai-field-input-font-weight);
          }
        }
      }
    }
  }
</style>
