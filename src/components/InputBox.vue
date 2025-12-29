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
      >
        <template #button>
          <div flex items-center>
            <van-image 
              :src="inputSendIcon" 
              @click="onSend"
              :style="{
                width: 'var(--comment-input-image-width)',
                height: 'var(--comment-input-image-height)'
              }"
             />
          </div>
        </template>
      </van-field>
    </div>
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

    .van-field {
      border-radius: var(--ai-field-input-border-radius);
      height: var(--ai-field-input-height);
      font-size: var(--ai-field-input-font-size);
      font-weight: var(--ai-field-input-font-weight);
      background: var(--ai-field-input-bg-color);

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
        //----
        display: flex;
        align-items: center;
        //----
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
      // ---
      :deep(.van-field__button) {
        margin: 0 !important;
        padding: 0 !important;
        margin-right: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-right: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;

        > div {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
      // ---
    }
  }
</style>
