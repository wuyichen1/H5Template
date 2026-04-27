<script setup lang="ts">
  import Head from '@/assets/public/Head.png'
  import { useJump } from '@/hooks/useJump'
  import { useWindow } from '@/hooks/useWindow'
  import { useUserStore } from '@/stores'

  defineOptions({
    name: 'FriendRequests'
  })

  interface FriendRequestItem extends FriendRequestInfo {
    user?: UserInfo
  }

  const { appParams, ensureLoggedIn } = useJump()
  const { userInfo } = useUserStore()
  const { winFriendRequestData, winUserListData } = useWindow()

  const requestList = ref<FriendRequestInfo[]>(winFriendRequestData)
  const allUserList = ref<UserInfo[]>(winUserListData)

  const receivedRequests = computed<FriendRequestItem[]>(() => {
    return requestList.value
      .filter(v => v.toUserId === userInfo.userId && v.status !== 'rejected')
      .map(v => ({
        ...v,
        user: allUserList.value.find(user => user.userId === v.fromUserId)
      }))
      .filter(v => !!v.user)
  })

  const syncUserList = () => {
    allUserList.value.forEach(v => {
      if (v.userId === userInfo.userId) {
        v.follow = userInfo.follow
        v.fans = userInfo.fans
      }
    })
  }

  const onAccept = (item: FriendRequestItem) => {
    if (!ensureLoggedIn()) return
    if (item.status === 'accepted') return

    userInfo.follow = Array.from(
      new Set([...(userInfo.follow || []), item.fromUserId])
    )
    userInfo.fans = Array.from(
      new Set([...(userInfo.fans || []), item.fromUserId])
    )

    const fromUser = allUserList.value.find(v => v.userId === item.fromUserId)
    if (fromUser) {
      fromUser.follow = Array.from(
        new Set([...(fromUser.follow || []), userInfo.userId])
      )
      fromUser.fans = Array.from(
        new Set([...(fromUser.fans || []), userInfo.userId])
      )
    }

    requestList.value.forEach(v => {
      if (v.requestId === item.requestId) {
        v.status = 'accepted'
      }
    })

    syncUserList()
    appParams({ key: 'updateUser', value: allUserList.value, state: 1 })
    appParams({
      key: 'uploadFriendRequest',
      value: requestList.value,
      state: 1
    })
  }

  const onRemove = (item: FriendRequestItem) => {
    if (!ensureLoggedIn()) return
    requestList.value = requestList.value.filter(
      v => v.requestId !== item.requestId
    )
    window.friendRequestJson = requestList.value
    appParams({
      key: 'uploadFriendRequest',
      value: requestList.value,
      state: 1
    })
  }
</script>

<template>
  <div safe-area-inset-top safe-area-inset-bottom class="friend-request-page">
    <main class="request-list">
      <empty v-if="receivedRequests.length === 0" />
      <div
        v-for="item in receivedRequests"
        :key="item.requestId"
        class="request-item"
      >
        <div class="request-user">
          <van-image
            round
            fit="cover"
            class="request-avatar"
            :src="item.user?.avator || Head"
          />
          <span>{{ item.user?.name }}</span>
        </div>
        <button
          class="accept-btn"
          :class="{ accepted: item.status === 'accepted' }"
          @click="onAccept(item)"
        >
          {{ item.status === 'accepted' ? 'Accepted' : 'Accept' }}
        </button>
        <button class="remove-btn" @click="onRemove(item)">
          <van-icon name="cross" />
        </button>
      </div>
    </main>
  </div>
</template>

<style lang="less" scoped>
  .friend-request-page {
    padding-top: calc(
      var(--van-nav-bar-height) + var(--ai-view-padding-top)
    );
    min-height: 100vh;
    background:
      linear-gradient(180deg, rgba(132, 62, 22, 0.98) 0%, rgba(36, 14, 6, 0.96) 36%, #001a38 100%);
    color: #fff;
  }

  .request-list {
    padding: 0 20px 40px;
  }

  .request-item {
    min-height: 94px;
    padding: 0 18px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto 48px;
    gap: 14px;
    align-items: center;
    border-radius: 24px;
    background: #001d40;

    & + .request-item {
      margin-top: 20px;
    }
  }

  .request-user {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;

    span {
      overflow: hidden;
      color: #fff;
      font-size: 18px;
      font-weight: 400;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .request-avatar {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
  }

  .accept-btn {
    min-width: 84px;
    height: 34px;
    padding: 0 10px;
    border: 0;
    border-radius: 24px;
    background: #fff;
    color: #151515;
    font-size: 20px;
    line-height: 34px;
    font-weight: 400;

    &.accepted {
      pointer-events: none;
    }
  }

  .remove-btn {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #111;
    font-size: 20px;
  }
</style>
