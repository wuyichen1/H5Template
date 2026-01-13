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

const { reportIcon, messageIcon } = useAppImgStyle()
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

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isPopup = ref(false)
// 举报弹框
const isReport = ref(false)

// 切换播放/暂停
const togglePlay = async (event?: Event) => {
  if (!videoRef.value) return

  // 阻止默认行为和事件冒泡
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    try {
      await videoRef.value.play()
    } catch (error) {
      console.warn('播放失败:', error)
    }
  }
}

// 阻止视频的默认行为（右键菜单、双击全屏等）
const handleVideoContextMenu = (event: Event) => {
  event.preventDefault()
}

const handleVideoDoubleClick = (event: Event) => {
  event.preventDefault()
  // 双击也切换播放暂停
  togglePlay(event)
}

// 事件处理函数
const handlePlay = () => {
  isPlaying.value = true
}
const handlePause = () => {
  isPlaying.value = false
}
const handleEnded = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    videoRef.value.play().catch((error) => {
      console.warn('重新播放失败:', error)
    })
  }
}

// 初始化视频自动播放
const initVideo = () => {
  if (videoRef.value && dynamicInfo.value?.dynamicVideo) {
    // 尝试自动播放
    videoRef.value
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((error) => {
        console.warn('自动播放被阻止:', error)
        isPlaying.value = false
      })
  }
}

// 监听视频源变化，自动播放
watch(
  () => dynamicInfo.value?.dynamicVideo,
  () => {
    nextTick(() => {
      initVideo()
    })
  },
  { immediate: true }
)

onMounted(() => {
  if (videoRef.value) {
    // 禁用原生控制
    videoRef.value.controls = false
    videoRef.value.setAttribute('controls', 'false')

    // 添加事件监听器
    videoRef.value.addEventListener('play', handlePlay)
    videoRef.value.addEventListener('pause', handlePause)
    videoRef.value.addEventListener('ended', handleEnded)

    // 初始化播放
    initVideo()
  }
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.removeEventListener('play', handlePlay)
    videoRef.value.removeEventListener('pause', handlePause)
    videoRef.value.removeEventListener('ended', handleEnded)
  }
})
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
      controlslist="nodownload nofullscreen noremoteplayback"
      disablepictureinpicture
      @click="togglePlay"
      @contextmenu="handleVideoContextMenu"
      @dblclick="handleVideoDoubleClick"
    />
    <van-icon
      v-if="!isPlaying"
      name="play-circle"
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
              height: 'var(--video-details-follow-height)',
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
                height: '22px',
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
              height: 'var(--video-details-comment-height)',
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
              height: 'var(--unlike-image-height)',
            }"
            @click="onVideoLike"
          />
          <span class="public-number">
            {{ dynamicInfo?.dynamicLikeCount }}
          </span>
        </li>
      </ul>
    </div>

    <popup-box
      v-model:show="isPopup"
      background="linear-gradient(90deg, rgba(46, 35, 146, 1) 0%, rgba(83, 9, 112, 1) 100%)"
    >
      <!-- px-layout-padding pt-layout-padding -->
      <div style="padding-top: 0px; padding-bottom: 0px; margin-left: 20px; margin-right: 20px;">
        <van-divider content-position="left">Comments</van-divider>
      </div>
      <div class="h-[56vh] overflow-y-auto">
        <comment-card :list="commentList" class="video-comment-card_box" />
      </div>
      <input-box @send="(v) => onSend(v, 1)" />
    </popup-box>

    <report-box v-model:show="isReport" />
  </div>
</template>

<style lang="less" scoped>
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
    object-fit: cover;
    // 隐藏原生控制栏
    &::-webkit-media-controls {
      display: none !important;
    }
    &::-webkit-media-controls-enclosure {
      display: none !important;
    }
    &::-webkit-media-controls-panel {
      display: none !important;
    }
    &::-webkit-media-controls-play-button {
      display: none !important;
    }
    &::-webkit-media-controls-start-playback-button {
      display: none !important;
    }
  }

  .play-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 64px;
    color: rgba(255, 255, 255, 0.2);
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
