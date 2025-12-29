<script setup lang="ts">
  import Head from '@/assets/public/Head.png'
  import swipeOne from '@/assets/public/swipe-1.png'
  import reportIcon from '@/assets/public/san_more_icon.png'
  import { useAppImgStyle } from '@/hooks/useAppImgStyle'
  import { useDetail } from '@/hooks/useDetail'
  import { useWindow } from '@/hooks/useWindow'
  import { useUserStore } from '@/stores'
  import { detailId } from '@/hooks/useDetail'

  defineOptions({
    name: 'ArticleDetail'
  })

  const { detailLikeIcon, likeIcon } = useAppImgStyle()
  const { winPublishImageListData } = useWindow()
  const { userInfo } = useUserStore()
  const {
    loding,
    dynamicInfo,
    commentList,
    isLike,
    onAvator,
    onLike,
    onSend
  } = useDetail()

  // 举报弹框
  const isReport = ref(false)

  const handleReport = (userId: string) => {
    isReport.value = true
    detailId.value = userId
  }
</script>

<template>
  <div v-if="!loding" class="article-detail_box">
    <div relative>
      <van-swipe class="my-swipe" indicator-color="white">
        <van-swipe-item
          v-for="(item, index) in dynamicInfo?.dynamicPic"
          :key="index"
        >
          <van-image
            h-full
            w-full
            :src="item || swipeOne"
            fit="cover"
            position="top"
          />
        </van-swipe-item>
      </van-swipe>
      <div
        p-5
        text-end
        flex
        flex-col
        items-center
        right-0
        absolute
        class="bottom-[-64px]"
      >
        <van-image 
          :src="isLike ? likeIcon : detailLikeIcon"
          :style="{
            width: 'var(--unlike-image-width)',
            height: 'var(--unlike-image-height)'
          }"
          fit="cover"
          @click="onLike"
        />
        <span class="public-number">
          {{ dynamicInfo?.dynamicLikeCount }}
        </span>
      </div>
    </div>

    <div mt-5 px-layout-padding w-full>
      <ul flex>
        <li flex shrink flex-col items-center @click="onAvator">
          <van-image
            round
            ai-avatar
            :src="dynamicInfo?.avator || Head"
            fit="cover"
          />
          <span mt-1 ai-user-name>{{ dynamicInfo?.name }}</span>
        </li>
        <li ml-5 class="w-[60%]">
          <span ai-text-desc>{{ dynamicInfo?.dynamicDesc }}</span>
          <p flex flex-wrap>
            <span mr-2 mt-4 px-3 ai-tag-btn>
              #{{
                winPublishImageListData[dynamicInfo?.dynamicTitleType]
                  .name
              }}
            </span>
          </p>
        </li>
      </ul>

      <van-divider content-position="left">Comments</van-divider>

      <div class="article-comment-card_box">
        <empty v-if="commentList.length === 0" />
        <div class="comment-scroll-container">
          <div
            v-for="(item, index) in commentList"
            :key="index"
            class="comment-item"
          >
            <div class="comment-content">
              <ul flex items-center justify-between>
                <li flex items-center>
                  <van-image
                    round
                    ai-avatar
                    :src="item?.avator || Head"
                    fit="cover"
                  />
                  <span ml-3 ai-user-name>{{ item?.name || '' }}</span>
                </li>
                
              </ul>
              <span mt-2 ai-text-desc>{{ item?.content || '' }}</span>
              <div 
                v-if="userInfo.userId !== item.userId" 
                class="report-icon"
                @click="handleReport(item.userId)"
              >
                <van-image 
                  :src="reportIcon"
                  :style="{
                    width: '22px',
                    height: '22px'
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <report-box v-model:show="isReport" />

      <input-box @send="onSend" />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .article-detail_box {
    background: var(--ai-article-detail-bg-color);
    min-height: 100vh;
  }

  .my-swipe {
    .van-swipe-item {
      height: 379px;
    }
  }

  .article-comment-card_box {
    padding-bottom: calc(80px + var(--ai-view-padding-bottom));
  }

  .comment-scroll-container {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 12px;
    padding-bottom: 10px;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  }

  .comment-item {
    flex-shrink: 0;
    width: 180px;
    padding-bottom: 12px;
  }

  .comment-content {
    padding: 16px;
    background:  #282329d1;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .report-icon {
    position: absolute;
    bottom: 12px;
    right: 12px;
    cursor: pointer;
  } 
</style>
