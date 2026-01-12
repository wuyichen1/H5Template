<script setup lang="ts">
  import ChatBack from '@/assets/public/chat-index.png'
  import ChatBotImage from '@/assets/public/gYFdrTokerNA7UtH.png'
  import MasonryIcon from '@/assets/public/masonry-icon.png'
  import { useAppImgStyle } from '@/hooks/useAppImgStyle'
  import { useJump } from '@/hooks/useJump'
  import { useWindow } from '@/hooks/useWindow'
  import { useUserStore } from '@/stores'

  defineOptions({
    name: 'ChatView'
  })

  const { chatBgImage } = useAppImgStyle()
  const { winUserData, winUserListData, winChatBotDesc } = useWindow()
  const { userInfo } = useUserStore()
  const { jumpToRecharge, appParams, jumpToChatDetail } = useJump()

  /** 弹框  */
  const show = ref(false)

  const onSubmit = () => {
    show.value = !(userInfo.coins >= winChatBotDesc.points)
    if (userInfo.coins >= winChatBotDesc.points) {
      const data = {
        ...winUserData,
        coins: userInfo.coins - winChatBotDesc.points
      }

      const list = winUserListData.map(v => {
        if (v.userId === data.userId) {
          v.coins = data.coins
        }
        return v
      })
      appParams({ key: 'updateUser', value: list, state: 1 })
      jumpToChatDetail()
    }
  }
</script>

<template>
  <div relative class="chat-view_box">
    <van-image :src="ChatBack" fit="cover" class="top-back" />
    <div class="text-center w-full top-34vh absolute">
      <ul p-layout-padding>
        <!-- 增加一个图片显示 -->
        <van-image :src="ChatBotImage" fit="contain" class="chat-bot-image" />
        <li ai-input-title style="font-size: 26px; font-weight: 700;">{{ winChatBotDesc.title }}</li>
        <li
          ai-text-desc
          class="mt-7 !text-[var(--ai-chat-view-text-color)] content_box text-center"
        >
          {{ winChatBotDesc.content }}
        </li>
        <li flex justify-center class="public-btoom-btn">
          <p
            ai-gradient-btn
            class="bottom-btn public_btn"
            @click="onSubmit"
          >
            <van-image h-12 w-12 :src="MasonryIcon" fit="cover" />
            <span text-5 font-700 ml-1>
              X {{ winChatBotDesc.points }}
            </span>
            <span text-4 font-500 ml-8 mr-1>Chat</span>
            <!-- <van-image
              :src="chatBtnIcon"
              fit="cover"
              :style="{
                width: 'var(--ai-btn-arr-image-width)',
                height: 'var(--ai-btn-arr-image-height)'
              }"
            /> -->
          </p>
        </li>
      </ul>
    </div>

    <van-overlay :show="show" @click="show = false">
      <div flex h-full justify-center>
        <div class="block" @click.stop>
          <div
            :style="{ 'background': `url(${chatBgImage})`, 'background-size': '100% 100%', 'background-repeat': 'no-repeat' }"
            class="content"
          >
            <!-- 添加一个图片 -->
            <van-image :src="MasonryIcon" fit="contain" class="recharge-bot-image" />
            <span mt-2 style="font-size: 24px; color: #000;">Sorry</span>
            <span mt-3 style="font-size: 16px; color: #0E080F; display: flex; justify-content: center; align-items: center; text-align: center; padding-left: 40px; padding-right: 40px;">
              your current balance is insufficient
            </span>
          </div>
          <div mt-8 flex justify-center>
            <p ai-gradient-btn @click="jumpToRecharge()">Recharge</p>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="less" scoped>
  .chat-view_box {
    background: #0e080f;
    background-image: url('@/assets/public/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    .content_box {
      // padding-bottom: calc(50px + var(--ai-view-padding-bottom));
      padding-bottom: 100px;
      padding-left: 20px;
      padding-right: 20px;
      text-align: center;
    }
  }

  .top-back {
    width: 100%;
    height: 510px;
  }

  .chat-bot-image {
    width: 135px;
    height: 135px;
    margin-bottom: 10px;
  }

  .recharge-bot-image {
    width: 100px;
    height: 100px;
  }

  .bottom-btn {
    width: var(--ai-chat-view-btn-width);
    height: var(--ai-chat-view-btn-height);
    color: var(--ai-chat-view-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    border: 1px solid #fff; /* 增加一个白色border */
  }

  .block {
    margin-top: 20vh;
    height: 300px;

    .content {
      width: calc(var(--ai-chat-view-popup-bg-img-width) + 40px);
      height: calc(var(--ai-chat-view-popup-bg-img-height) + 40px);
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      span {
        color: var(--ai-chat-view-popup-title-text-color);
        font-size: var(--ai-chat-view-popup-title-font-size);
        font-weight: var(--ai-chat-view-popup-title-font-weight);

        &:nth-child(2) {
          color: var(--ai-chat-view-popup-desc-text-color);
          font-size: var(--ai-chat-view-popup-desc-text-size);
          font-weight: var(--ai-chat-view-popup-desc-text-weight);
        }
      }
    }
  }
</style>
