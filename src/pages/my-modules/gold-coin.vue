<script setup lang="ts">
import MasonryIcon from '@/assets/public/masonry-icon.png'
import MyIcon from '@/assets/public/my-icon.png'
import { useJump } from '@/hooks/useJump'
import { useWindow } from '@/hooks/useWindow'
import { useUserStore } from '@/stores'

defineOptions({
  name: 'GoldCoin'
})

const { userInfo } = useUserStore()
const { winCoinData } = useWindow()
const { appParams } = useJump()

const formData = reactive({
  radio: winCoinData[0]?.key
})

const onRecharge = () => {
  appParams({ key: 'Recharge', value: formData.radio, state: 1 })
}
</script>

<template>
  <div safe-area-inset-top class="gold-coin_box">
    <div p-layout-padding>
      <ul class="top-box">
        <li>
          <van-image h-20 w-20 :src="MasonryIcon" fit="cover" />
        </li>
        <li ml-8 flex flex-col>
          <span ai-user-name>My diamonds</span>
          <span text-6 text-white font-medium>
            {{ userInfo.coins }}
          </span>
        </li>
      </ul>

      <!-- 选项数据 -->
      <ul class="bottom-selsect">
        <li
          v-for="item in winCoinData"
          :key="item.key"
          :class="{ 'on-active': formData.radio === item.key }"
          @click="formData.radio = item.key"
        >
          <div class="left-content">
            <van-image h-4 w-5 :src="MyIcon" fit="cover" />
            <span ml-1 ai-user-name>{{ item.cions }}</span>
          </div>
          <div class="right-content">
            <span ai-text-desc>${{ item.meney }}</span>
            <div class="radio-circle" />
          </div>
        </li>
      </ul>

      <!-- 按钮 -->
      <div mt-6 flex justify-center>
        <p ai-gradient-btn @click="onRecharge">Recharge</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.gold-coin_box {
  padding-top: calc(var(--van-nav-bar-height) + var(--ai-view-padding-top));
  background: #0e080f;
  background-image: url("@/assets/public/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.top-box {
  border-radius: 20px;
  background: url(@/assets/public/diamonds_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // border: 4px solid rgba(255, 255, 255, 0.09);
  display: flex;
  align-items: center;
  padding: 20px;
  padding-bottom: 10px;
}

.bottom-selsect {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    width: 100%;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: var(--ai-coin-select-style-border-radius);
    background: var(--ai-coin-select-style-bg-color);
    padding: 14px;
    cursor: pointer;
    transition: background-color 0.3s;

    .left-content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .right-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .radio-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #fff;
      background: transparent;
      flex-shrink: 0;
      transition: background-color 0.3s;
    }
  }

  .on-active {
    // background: var(--ai-coin-select-style-selected-color);

    .radio-circle {
      background: linear-gradient(90deg, rgba(172, 94, 255, 1) 0%, rgba(139, 31, 255, 1) 100%);
      border-color: #fff;
    }
  }
}
</style>
