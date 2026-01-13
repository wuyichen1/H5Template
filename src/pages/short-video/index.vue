<script setup lang="ts">
  import addIcon from '@/assets/public/add.png'
  import Head from '@/assets/public/Head.png'
  import likeIcon from '@/assets/public/like.png'
  import detailLikeIcon from '@/assets/public/unlike.png'
  import { useAppImgStyle } from '@/hooks/useAppImgStyle'
  import { useDetail } from '@/hooks/useDetail'
  import { useUserStore } from '@/stores'

  defineOptions({
    name: 'ShortVideo'
  })

  const { reportIcon, messageIcon } =
    useAppImgStyle()
  const { userInfo } = useUserStore()
  const {
    loding,
    dynamicInfo,
    commentList,
    isVideoLike,
    isFollow,
    onAvator,
    onFollow,
    onSend,
    onVideoLike
  } = useDetail()

  const videoRef = ref(null)
  const isPlaying = ref(true)
  const isPopup = ref(false)
  // 举报弹框
  const isReport = ref(false)

  const togglePlay = async () => {
    if (!videoRef.value) return

    if (isPlaying.value) {
      videoRef.value.pause()

      // videoRef.value.play().catch((err) => {
      //   console.error('播放失败:', err)
      // })

      isPlaying.value = false
    } else {
      try {
        await videoRef.value.play()
        isPlaying.value = true
      } catch (error) {
        console.warn('自动播放被阻止:', error)
      }
    }
  }
</script>

<template>
  <div v-if="!loding" class="video-box">
    <video
      ref="videoRef"
      :src="dynamicInfo?.dynamicVideo"
      :poster="dynamicInfo?.dynamicPic[0]"
      webkit-playsinline
      playsinline
      x5-playsinline
      autoplay
      muted
      width="100%"
      height="100%"
      @click="togglePlay"
    />
    <van-icon
      v-if="!isPlaying"
      :name="isPlaying ? 'pause-circle' : 'play-circle'"
      class="play-box"
      @click="togglePlay"
    />
    <div p-layout-padding class="bottom-box">
      <div mb-5 flex>
        <div h-12 w-12 relative>
          <van-image
            round
            ai-avatar
            :src="dynamicInfo?.avator || Head"
            fit="cover"
            class="user-head"
            @click="onAvator"
          />
          <van-image
            v-if="!isFollow && userInfo.userId !== dynamicInfo?.userId"
            round
            right-3
            top-9.5
            absolute
            :src="addIcon"
            fit="cover"
            :style="{
              width: 'var(--video-details-follow-width)',
              height: 'var(--video-details-follow-height)'
            }"
            @click="onFollow"
          />
        </div>
        <ul ml-3 shrink w-full>
          <li flex justify-between>
            <span ai-user-name>{{ dynamicInfo?.name }}</span>
            <van-image
              v-if="userInfo.userId !== dynamicInfo?.userId"
              :src="reportIcon"
              :style="{
                width: '22px',
                height: '22px'
              }"
              @click="isReport = true"
            />
          </li>
          <li>
            <span mt-1 ai-text-desc>
              {{ dynamicInfo?.dynamicDesc }}
            </span>
          </li>
        </ul>
      </div>
      <ul class="bottom-btn">
        <li @click="isPopup = true">
          <van-image
            :src="messageIcon"
            class="icon-box"
            :style="{
              width: 'var(--video-details-comment-width)',
              height: 'var(--video-details-comment-height)'
            }"
          />
          <span class="public-number">
            {{ dynamicInfo?.dynamicCommentCount }}
          </span>
        </li>
        <li>
          <van-image
            :src="isVideoLike ? likeIcon : detailLikeIcon"
            class="icon-box"
            :style="{
              width: 'var(--unlike-image-width)',
              height: 'var(--unlike-image-height)'
            }"
            @click="onVideoLike"
          />
          <span class="public-number">
            {{ dynamicInfo?.dynamicLikeCount }}
          </span>
        </li>
      </ul>
    </div>

    <popup-box v-model:show="isPopup">
      <div
        class="popup-content bg-gradient-comment"
        style="background: linear-gradient(90deg, rgba(46, 35, 146, 0.753) 0%, rgba(83, 9, 112, 0.686) 100%);"
      >
        <div px-layout-padding pt-layout-padding>
          <van-divider content-position="left">Comments</van-divider>
        </div>
        <div class="h-[56vh] overflow-y-auto">
          <comment-card
            :list="commentList"
            class="video-comment-card_box"
          />
        </div>
        <input-box @send="v => onSend(v, 1)" />
      </div>
    </popup-box>

    <report-box v-model:show="isReport" />
  </div>
</template>

<style lang="less" scoped>
  .popup-content {
    padding-top: 12px;
    margin-top: 0;

    :deep(.van-divider) {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .video-comment-card_box {
    padding-bottom: calc(60px + var(--ai-view-padding-bottom));
  }
  .video-box {
    width: 100%;
    height: 100vh;
    position: relative;

    video {
      width: 100%;
      height: 100%;
      // background: var(--ai-short-video-bg-color);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      min-height: 100vh;
    }

    .play-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 64px;
      color: rgba(255, 255, 255, 0.7);
    }

    .bottom-box {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      // background: linear-gradient(180deg, rgba(14, 8, 15, 0.8) 0%, rgba(14, 8, 15, 0) 100%);
    }

    .user-head {
      width: var(--ai-short-video-avatar-width);
      height: var(--ai-short-video-avatar-height);
    }

    .bottom-btn {
      display: flex;
      justify-content: space-between;

      li {
        position: relative;
        width: var(--ai-short-video-bottom-btn-width);
        height: var(--ai-short-video-bottom-btn-height);
        border-radius: var(--ai-short-video-bottom-btn-border-radius);
        background: var(--ai-short-video-bottom-btn-bg-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .icon-box {
          position: absolute;
          bottom: 26px;
          z-index: 1;
        }

        .public-number {
          font-size: 20px !important;
          margin-top: 22px;
        }
      }
    }
  }
</style>
