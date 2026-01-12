<script setup lang="ts">
  import CallBg from '@/assets/public/call-bg.png'
  import HangIcon from '@/assets/public/hang-icon.png'
  import Head from '@/assets/public/Head.png'
  import { useJump } from '@/hooks/useJump'
  import { useWindow } from '@/hooks/useWindow'

  defineOptions({
    name: 'CallIndex'
  })

  const router = useRouter()
  const route = useRoute()
  const { queryId } = useJump()
  const { winUserListData } = useWindow()
  const userData = ref<UserInfo>(null)
  const loading = ref(true)
  const getData = () => {
    userData.value = winUserListData.find(v => v.userId === queryId.value)
    loading.value = false
  }

  const onBack = () => {
    router.replace({
      path: `/private-chat`,
      query: { id: route.query.cid as string }
    })
  }

  // 计算背景图URL
  const backgroundImage = computed(() => {
    const avatar = userData.value?.avator
    return avatar ? `url(${avatar})` : `url(${CallBg})`
  })

  onMounted(() => {
    getData()
  })
</script>

<template>
  <div class="call-box" :style="{ backgroundImage }">
    <div v-if="!loading" flex flex-col justify-center items-center>
      <div flex flex-col justify-center items-center>
        <van-image
          round
          ai-avatar
          :src="userData.avator || Head"
          fit="cover"
          class="mt-[14vh] !h-20 !w-20"
        />
        <span ai-user-name my-4>{{ userData.name }}</span>
        <span ai-text-desc>Calling...</span>
      </div>
      <p
        ai-gradient-btn
        class="mt-[26vh] !rounded-full !flex !justify-center !items-center !h-16 !w-16"
        @click="onBack"
      >
        <van-image round :src="HangIcon" fit="cover" />
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .call-box {
    width: 100%;
    height: 100vh;
    background: #0e080f;
    background-image: url('@/assets/public/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }

    > * {
      position: relative;
      z-index: 2;
    }
  }
</style>
