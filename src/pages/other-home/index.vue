<script setup lang="ts">
  import { showLoadingToast, showToast } from 'vant'
  import otherHomeAddIcon from '@/assets/public/add.png'
  import addFriendIcon from '@/assets/public/addfriend.png'
  import Head from '@/assets/public/Head.png'
  import likeIcon from '@/assets/public/like.png'
  import reportIcon from '@/assets/public/san_more_icon.png'
  import detailLikeIcon from '@/assets/public/unlike.png'
  import { useAppImgStyle } from '@/hooks/useAppImgStyle'
  import { detailId, useDetail } from '@/hooks/useDetail'
  import { useJump } from '@/hooks/useJump'
  import { useWindow } from '@/hooks/useWindow'
  import { useUserStore } from '@/stores'

  defineOptions({
    name: 'other-home'
  })

  const {
    // reportIcon,
    // otherHomeAddIcon,
    otherHomeMessageIcon
    // otherHomeLikeIcon
  } = useAppImgStyle()
  const { queryId, jumpToDetail, appParams, jumpToPrivateChat, ensureLoggedIn } =
    useJump()
  const { winUserListData, winDynamicData, winChatListData, winFriendRequestData, winPublishImageListData } = useWindow()
  const useData = useUserStore()

  const {
    isVideoLike,
    onVideoLike
  } = useDetail()

  // 举报弹框
  const isReport = ref(false)
  const userInfo = ref<UserInfo>(null)
  const bottomList = ref<DynamicInfo[]>([])
  const loading = ref(true)
  /** 是否显示关注 */
  const isShowFollow = ref(false)
  const allUserList = ref<UserInfo[]>(winUserListData)
  const friendRequestList = ref<FriendRequestInfo[]>(winFriendRequestData)
  const showFriendRequestPopup = ref(false)

  const getData = () => {
    userInfo.value = winUserListData.find(v => v.userId === queryId.value)

    detailId.value = userInfo.value.userId

    bottomList.value = winDynamicData.filter(
      v => v.userId === userInfo.value.userId
    )
    console.log(bottomList.value, '====')
    isShowFollow.value = useData.userInfo.follow.includes(
      userInfo.value.userId
    )
    loading.value = false
  }

  const onGoDetail = (item: DynamicInfo) => {
    jumpToDetail(item.dynamicId, item.dynamicType, queryId.value)
  }

  const syncUserList = () => {
    allUserList.value.forEach(v => {
      if (v.userId === useData.userInfo.userId) {
        v.follow = useData.userInfo.follow
        v.fans = useData.userInfo.fans
      }
      if (v.userId === userInfo.value.userId) {
        v.follow = userInfo.value.follow
        v.fans = userInfo.value.fans
      }
    })
  }

  const followTargetUser = () => {
    useData.userInfo.follow = Array.from(
      new Set([...(useData.userInfo.follow || []), userInfo.value.userId])
    )
    userInfo.value.fans = Array.from(
      new Set([...(userInfo.value.fans || []), useData.userInfo.userId])
    )
    syncUserList()
    isShowFollow.value = true
  }

  const onFollow = () => {
    if (!ensureLoggedIn()) return
    followTargetUser()
    appParams({ key: 'updateUser', value: allUserList.value, state: 1 })
  }

  const getCurrentDateTime = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // getMonth() 是 0-11
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const onAddChat = () => {
    if (!ensureLoggedIn()) return
    const isMutualFollow =
      !!useData.userInfo.follow?.includes(userInfo.value.userId)
      && !!userInfo.value.follow?.includes(useData.userInfo.userId)
    if (!isMutualFollow) {
      showFriendRequestPopup.value = true
      return
    }

    const chatItem = winChatListData.find(v => {
      return (
        v.chatUserIds.includes(userInfo.value.userId) &&
        v.chatUserIds.includes(useData.userInfo.userId)
      )
    })
    if (chatItem) {
      jumpToPrivateChat(chatItem.chatId, queryId.value)
    } else {
      // 时间戳
      const item: ChatInfo = {
        chatId: `${Date.now()}_chatId`,
        chatUserIds: [userInfo.value.userId, useData.userInfo.userId],
        lastSendContent: '',
        lastSendTime: getCurrentDateTime(),
        unreadMsgCount: 0,
        lastSendUserId: useData.userInfo.userId
      }
      window?.chatListJson.push(item)

      showLoadingToast({
        message: 'Loading...',
        forbidClick: true,
        onClose: () => {
          appParams({
            key: 'uploadChat',
            value: window?.chatListJson,
            state: 1
          })
          jumpToPrivateChat(item.chatId, queryId.value)
        }
      })
    }
  }

  const requestExists = computed(() => {
    return friendRequestList.value.some(v => {
      return v.fromUserId === useData.userInfo.userId
        && v.toUserId === userInfo.value?.userId
        && v.status !== 'rejected'
    })
  })

  const onSendFriendRequest = () => {
    if (!ensureLoggedIn()) return
    const hasRequest = requestExists.value
    followTargetUser()

    if (!hasRequest) {
      friendRequestList.value.push({
        requestId: `${Date.now()}_friend_request`,
        fromUserId: useData.userInfo.userId,
        toUserId: userInfo.value.userId,
        status: 'pending',
        createTime: getCurrentDateTime()
      })
    }

    appParams({ key: 'updateUser', value: allUserList.value, state: 1 })
    appParams({
      key: 'uploadFriendRequest',
      value: friendRequestList.value,
      state: 1
    })
    showFriendRequestPopup.value = false
    showToast(hasRequest ? 'Request already sent.' : 'Request sent.')
  }

  onMounted(() => {
    getData()
  })

  const shouldShowReport = (item) => {
    // 不显示自己
    return item.userId !== useData.userInfo.userId
  }

  const onOpenReport = (id: string) => {
    if (!ensureLoggedIn()) return
    isReport.value = true
    detailId.value = id
  }
</script>

<template>
  <div v-if="!loading" class="other-home_box">
    <div
      class="top-user-info"
      :style="{
        backgroundImage: `url(${userInfo.avator || Head})`,
        backgroundSize: 'cover'
      }"
    >
      <div class="avatar-info">
        <van-image
          round
          ai-avatar
          :src="userInfo.avator || Head"
          fit="cover"
          class="user-head"
        />
        <div h-2 w-20 relative>
          <van-image
            v-if="!isShowFollow && shouldShowReport(userInfo)"
            round
            bottom-2
            left-14
            absolute
            :src="otherHomeAddIcon"
            fit="cover"
            :style="{
              width: 'var(--other-home-follow-width)',
              height: 'var(--other-home-follow-height)'
            }"
            @click="onFollow"
          />
        </div>
        <span mt-1 ai-user-name>{{ userInfo.name }}</span>
      </div>
      <ul text-white flex justify-around class="number-box">
        <li>
          <span>{{ bottomList.length }}</span>
          <span>Posts</span>
        </li>
        <li>
          <span>{{ userInfo.fans.length }}</span>
          <span>Fans</span>
        </li>
        <li>
          <span>{{ userInfo.follow.length }}</span>
          <span>Follow</span>
        </li>
      </ul>
      <ul px-layout-padding class="bottom-box">
        <li>{{ userInfo.about }}</li>
        <li
          v-if="shouldShowReport(userInfo)"
        >
          <van-image :src="otherHomeMessageIcon" class="icon-box"
            :style="{
              width: 'var(--other-home-chat-width)',
              height: 'var(--other-home-chat-height)'
            }"
/>
          <span ml-3 class="public-number !mt-0" @click="onAddChat">
            Chat
          </span>
        </li>
      </ul>
    </div>

    <div p-layout-padding class="bottom-card">
      <!-- 内容卡片 -->
      <div
        v-for="(item, index) in bottomList"
        :key="index"
        class="card-item"
        @click="onGoDetail(item)"
      >
        <ul class="top-info">
          <li>
            <van-image round ai-avatar :src="userInfo.avator || Head" fit="cover" />
            <span mx-2 ai-user-name>{{ userInfo.name }}</span>
            <span ai-tag-btn class="tag"># {{ winPublishImageListData.find(v => v.value === item.dynamicType)?.name }}</span>
          </li>
          <li />
          <li>
            <van-image
              v-if="shouldShowReport(item)"
              :src="reportIcon"
              :style="{ width: '20px', height: '20px' }"
              @click.stop="onOpenReport(item.userId)"
            />
          </li>
        </ul>
        <ul class="bottom-img">
          <li w-full>
            <van-image
              rounded-2
              h-50
              w-full
              overflow-hidden
              :src="item.dynamicPic[0] || Head"
              fit="cover"
              position="top"
            />
          </li>
          <!-- <li>
            <van-image rounded-2 h-23.5 w-22 overflow-hidden :src="Head" fit="cover" />
            <van-image rounded-2 h-23.5 w-22 overflow-hidden :src="Head" fit="cover" />
          </li> -->
        </ul>
        <span class="bottom-text" style="padding-right: 56px">{{ item.dynamicDesc }}</span>
        <div class="like-box">
          <van-image
            :src="isVideoLike ? likeIcon : detailLikeIcon"
            class="icon-box"
            :style="{
              width: 'var(--other-home-like-post-width)',
              height: 'var(--other-home-like-post-height)'
            }"
            @click="onVideoLike"
          />
          <!-- <van-image :src="otherHomeLikeIcon" class="icon-box" :style="{
              width: 'var(--other-home-like-post-width)',
              height: 'var(--other-home-like-post-height)'
            }"/> -->
          <span class="public-number">{{ item.dynamicLikeCount }}</span>
        </div>
      </div>
    </div>

    <report-box v-model:show="isReport" />

    <van-overlay
      :show="showFriendRequestPopup"
      z-index="1001"
      @click="showFriendRequestPopup = false"
    >
      <div class="friend-request-mask" @click.stop>
        <div class="friend-request-card">
          <div class="friend-request-icon">
            <van-image :src="addFriendIcon" fit="contain" class="friend-request-icon-image" />
          </div>
          <p>
            You will chat with {{ userInfo.name }}.<br />
            Friendship is required for private chat.
          </p>
        </div>
        <button class="friend-request-btn cancel" @click="showFriendRequestPopup = false">
          Cancel
        </button>
        <button class="friend-request-btn submit" @click="onSendFriendRequest">
          Send Request
        </button>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="less" scoped>
  .other-home_box {
    min-height: 100vh;
    background: var(--ai-other-home-bg-color);
    position: relative;
  }

  .top-user-info {
    position: relative;
    width: 100%;
    height: 346px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
    z-index: 0;
    isolation: isolate; // 创建新的层叠上下文

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 0;
      pointer-events: none;
    }

    .bottom-box {
      position: relative;
      z-index: 2;
      pointer-events: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      li {
        color: var(--ai-other-home-right-desc-text-color);
        font-size: var(--ai-other-home-right-desc-text-weight);
        font-weight: var(--ai-other-home-right-desc-text-size);

        &:nth-child(2) {
          margin-left: 10px;
          width: var(--ai-other-home-right-btn-style-width);
          height: var(--ai-other-home-right-btn-style-height);
          flex-shrink: 0;
          border-radius: var(
            --ai-other-home-right-btn-style-border-radius
          );
          background: var(--ai-other-home-right-btn-style-bg-color);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .number-box {
      position: relative;
      z-index: 2;
      pointer-events: auto;
      margin: 6px 0;

      li {
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          font-size: var(--ai-other-home-top-data-desc-text-size);
          font-weight: var(--ai-other-home-top-data-desc-text-weight);
          color: var(--ai-other-home-top-data-desc-text-color);

          &:nth-child(2) {
            font-size: var(--ai-other-home-top-data-text-text-size);
            font-weight: var(--ai-other-home-top-data-text-text-weight);
            color: var(--ai-other-home-top-data-text-text-color);
          }
        }
      }
    }
  }

  .avatar-info {
    position: relative;
    z-index: 2;
    pointer-events: auto;
    padding: 96px 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .user-head {
      width: 83px;
      height: 83px;
      border: 3px solid #fff;
    }
  }

  .bottom-card {
    .card-item + .card-item {
      margin-top: 20px;
    }

    .card-item {
      background: rgba(1, 23, 51, 1);
      border-radius: 20px;
      position: relative;
      overflow: hidden;

      .top-info {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        li {
          display: flex;
          align-items: center;

          &:first-child {
            flex: 1;
            min-width: 0; // 允许 flex 子元素缩小，使 flex: 1 生效
          }

          .tag {
            background: rgba(255, 255, 255, 0.2);
            padding-left: 8px;
            padding-right: 8px;
            white-space: nowrap;
            text-align: center;
            margin-left: 8px;
            width: auto; // 覆盖 ai-tag-btn 的固定宽度，由内容撑开
            flex-shrink: 0; // 不允许收缩，保持内容宽度
            overflow: hidden; // 防止内容溢出
            text-overflow: ellipsis; // 文本溢出显示省略号
          }
        }
      }

      .bottom-img {
        padding: 0 16px 0 16px;
        display: flex;
        justify-content: space-between;

        li {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }

      .bottom-text {
        position: absolute;
        bottom: 0;
        left: 16px;
        right: 16px;
        background: linear-gradient(
          90deg,
          #0e080f78 0%,
          rgba(14, 8, 15, 0) 100%
        );
        height: 42px;
        width: 100%;
        line-height: 42px;
        padding: 0 16px;
        font-size: var(--ai-other-home-card-desc-text-size);
        font-weight: var(--ai-other-home-card-desc-text-weight);
        color: var(--ai-other-home-card-desc-text-color);
        text-align: var(--ai-other-home-card-desc-text-sort);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .like-box {
        position: absolute;
        bottom: 30px;
        right: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-self: center;
      }
    }
  }

  .friend-request-mask {
    min-height: 100%;
    padding: 28vh 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.58);
  }

  .friend-request-card {
    position: relative;
    width: min(86vw, 360px);
    min-height: 230px;
    padding: 54px 48px 28px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // border: 2px solid rgba(255, 255, 255, 0.7);
    // border-radius: 36px;
    background: url('@/assets/public/addfrienddialog.png') center / 100% 100% no-repeat;
    // box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34);

    // &::before {
    //   content: '';
    //   position: absolute;
    //   top: -14px;
    //   left: -14px;
    //   width: 44px;
    //   height: 44px;
    //   border: 8px solid #ff7b2f;
    //   border-right-color: #2b82ff;
    //   border-bottom-color: transparent;
    //   border-radius: 50%;
    //   transform: rotate(18deg);
    // }

    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: 18px;
    //   left: 18px;
    //   width: 22px;
    //   height: 22px;
    //   border-radius: 50%;
    //   background: #25160e;
    //   box-shadow: inset 0 0 0 4px #fff;
    // }

    p {
      margin: 18px 0 0;
      color: #0b0d13;
      font-size: 18px;
      line-height: 1.38;
      text-align: center;
      font-weight: 500;
    }
  }

  .friend-request-icon {
    width: 78px;
    height: 78px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 52px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.82), #1e52ff);
    box-shadow: 0 12px 28px rgba(31, 91, 255, 0.38);
  }

  .friend-request-icon-image {
    width: 48px;
    height: 48px;
  }

  .friend-request-btn {
    width: min(60vw, 240px);
    height: 50px;
    margin-top: 26px;
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 32px;
    color: #fff;
    font-size: 18px;
    font-weight: 500;

    &.cancel {
      background: linear-gradient(112deg, #bd6123 0%, #001a3b 100%);
    }

    &.submit {
      margin-top: 18px;
      background: #2582f6;
    }
  }
</style>
