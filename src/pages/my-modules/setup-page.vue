<script setup lang="ts">
import type { AppCommunication } from '@/hooks/useJump'
import RightIcon from '@/assets/public/right-icon.png'
import { useJump } from '@/hooks/useJump'

defineOptions({
  name: 'SetupPage'
})

const { appParams, jumpToUserAgreement, jumpToBlackList } = useJump()

const listData = [
  { label: 'Privacy Agreement', value: '0' },
  { label: 'User Agreement', value: '1' },
  { label: 'Blacklist', value: '2' }
]

const onState = (key: AppCommunication) => {
  appParams({ key, state: 2 })
}

const onSelect = (value: string) => {
  if (value === '2') {
    jumpToBlackList()
  }
  if (value === '0') {
    jumpToUserAgreement('/privacy-agreement')
  }
  if (value === '1') {
    jumpToUserAgreement('/user-agreement')
  }
}
</script>

<template>
  <div safe-area-inset-top class="setup-page_box">
    <ul p-layout-padding class="list-btn">
      <li v-for="item in listData" :key="item.value" @click="onSelect(item.value)">
        <span>{{ item.label }}</span>
        <van-image h-5 w-5 :src="RightIcon" fit="cover" />
      </li>
    </ul>

    <!-- 按钮 -->
    <ul mt-60>
      <li flex justify-center>
        <p
          ai-gradient-btn
          class="bottom-btn delete-btn"
          @click="onState('deleteaccount')"
        >
          Delete account
        </p>
      </li>
      <li mt-5 flex justify-center>
        <p ai-gradient-btn class="bottom-btn logout-btn" @click="onState('logout')">
          Log out
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.setup-page_box {
  padding-top: calc(var(--van-nav-bar-height) + var(--ai-view-padding-top));
  min-height: 100vh;
  background: #0e080f;
  background-image: url("@/assets/public/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.list-btn {
  li + li {
    margin-top: 16px;
  }

  li {
    width: var(--ai-setting-select-style-width);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    height: var(--ai-setting-select-style-height);
    border-radius: var(--ai-setting-select-style-border-radius);
    background: var(--ai-setting-select-style-bg-color);

    span {
      font-size: var(--ai-setting-select-style-text-size);
      font-weight: var(--ai-setting-select-style-text-weight);
      color: var(--ai-setting-select-style-text-color);
    }
  }
}

.bottom-btn {
  // border: 1px solid #fff; /* 增加一个白色border */
  // background-image: var(--ai-setting-btn-color) !important;
  background: linear-gradient(
    201.44deg,
    rgba(28, 123, 255, 1) 0%,
    rgba(0, 0, 0, 1) 51.28%,
    rgba(255, 129, 51, 1) 100%
  ) !important;
  font-size: var(--ai-setting-btn-text-size) !important;
  font-weight: var(--ai-setting-btn-text-weight) !important;
  color: var(--ai-setting-btn-text-color) !important;
}

.delete-btn {
  background: rgba(255, 87, 51, 1) !important;
}

.logout-btn {
  background: linear-gradient(
    90deg,
    rgba(172, 94, 255, 1) 0%,
    rgba(139, 31, 255, 1) 100%
  ) !important;
}
</style>
