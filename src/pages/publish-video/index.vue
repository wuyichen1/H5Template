<script setup lang="ts">
import { closeToast, showLoadingToast, showSuccessToast, showToast } from 'vant'
import { useJump } from '@/hooks/useJump'
import { useWindow } from '@/hooks/useWindow'
import { useUserStore } from '@/stores'

defineOptions({
  name: 'publish-video'
})

const { userInfo } = useUserStore()
const { winDynamicData } = useWindow()
const { appParams } = useJump()

const listData = ref<DynamicInfo[]>(winDynamicData)

const formData = reactive({
  userId: userInfo.userId,
  dynamicType: 1,
  dynamicDesc: '',
  dynamicTitleType: 0,
  dynamicPic: []
})

const onSubmit = async () => {
  if (!formData.dynamicDesc) {
    return showToast('Please enter the content')
  }
  if (formData.dynamicPic.length === 0) {
    return showToast('Please upload the video')
  }
  if (formData.dynamicPic[0].status === 'uploading') {
    return showToast('Please wait for the video to upload')
  }

  const videoItem = formData.dynamicPic[0]
  let coverUrl = videoItem.objectUrl

  // 检查封面是否还是本地 blob URL，如果是则等待封面上传完成
  if (coverUrl && coverUrl.startsWith('blob:')) {
    console.log('检测到封面还是 blob URL，等待封面上传完成...', coverUrl)
    // 等待封面上传完成（最多等待 10 秒）
    let waitCount = 0
    while (coverUrl && coverUrl.startsWith('blob:') && waitCount < 20) {
      await new Promise(resolve => setTimeout(resolve, 500))
      coverUrl = videoItem.objectUrl
      waitCount++
      console.log(`等待封面上传... (${waitCount}/20)`, coverUrl)
    }

    // 如果等待超时，使用视频 URL 作为封面
    if (coverUrl && coverUrl.startsWith('blob:')) {
      console.warn('封面上传超时，使用视频 URL 作为封面')
      coverUrl = videoItem.url
    }
  }

  // 确保封面 URL 是有效的（不是 blob:）
  if (!coverUrl || coverUrl.startsWith('blob:')) {
    coverUrl = videoItem.url
  }

  console.log('=== 提交数据 ===')
  console.log('视频 URL:', videoItem.url)
  console.log('封面 URL:', coverUrl)
  console.log('是否 blob URL:', coverUrl?.startsWith('blob:'))

  const data = {
    ...formData,
    dynamicTag: [],
    dynamicVideo: videoItem.url,
    dynamicLikeCount: 0,
    dynamicCommentCount: 0,
    dynamicId: `${Date.now()}_video`,
    dynamicPic: [coverUrl]
  } as DynamicInfo

  listData.value.unshift(data)
  // 1. 显示 Loading（手动控制）
  showLoadingToast({
    message: 'Loading...',
    forbidClick: true,
    duration: 0
  })

  // 2. 随机延迟 500–2000ms
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (2000 - 500 + 1)) + 500)
  )

  // 3. 关闭 Loading
  closeToast()

  // 4. 成功提示
  showSuccessToast('Published successfully.')

  // 5. 延迟 1 秒再执行后续逻辑
  setTimeout(() => {
    appParams({
      key: 'updatePost',
      value: listData.value,
      state: 0
    })
  }, 1000)
}
</script>

<template>
  <div px-layout-padding class="publish-video_box">
    <text-box v-model="formData.dynamicDesc" bg="rgba(255, 255, 255, 0.2)" maxlength="50" rows="3" />

    <!-- 视频上传 -->
    <div my-6>
      <div ai-input-title>Upload(video)</div>
      <uploader-box v-model:list="formData.dynamicPic" :max-count="1" accept="video" />
    </div>

    <!-- 输入框 -->
    <!-- <div>
      <div ai-input-title>Payment(Optional)</div>
      <van-field v-model="formData.content" placeholder="Example 300" class="public-input" />
    </div> -->

    <!-- 底部按钮 -->
    <div mt-20 flex justify-center class="public-btoom-btn">
      <div ai-gradient-btn class="public_btn" @click="onSubmit">Release</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.publish-video_box {
  min-height: 100vh;
  padding-top: calc(var(--van-nav-bar-height) + var(--ai-view-padding-top));
  background: #0e080f;
  background-image: url("@/assets/public/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
