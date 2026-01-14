<script setup lang="ts">
  import axios from 'axios'
  import CryptoJS from 'crypto-js'
  import RightImage from '@/assets/public/ai_bavator.png'
  import ChatIcon from '@/assets/public/ai_chat_icon.png'
  import { useUserStore } from '@/stores'

  defineOptions({
    name: 'ChatDetails'
  })

  const { userInfo } = useUserStore()

  // ai 回复下标
  const aiIndex = ref(0)
  const listData = ref<MessageInfo[]>([])

  // 密钥（前后端必须一致，实际项目中不要硬编码！）
  const SECRET_KEY = CryptoJS.enc.Utf8.parse('518486he8pzgbjsk')
  // 可选：IV（初始化向量），CBC 模式需要
  const IV = CryptoJS.enc.Utf8.parse('614436p28qzhkjsl')

  const aesHexDecrypt = (encryptedHex: string) => {
    if (!encryptedHex) return encryptedHex
    try {
      // 创建CipherParams对象
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(encryptedHex)
      })

      // 执行解密
      const decrypted = CryptoJS.AES.decrypt(cipherParams, SECRET_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

      // 返回解密后的原始数据
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    } catch (err) {
      throw new Error('解密失败，请检查加密参数:', err)
    }
  }

  const isAllLoaded = computed(() =>
    listData.value.every(v => !v.loading)
  )

  const onSend = async (v: string) => {
    if (!isAllLoaded.value) {
      console.log('[调试] 仍有消息在加载中，取消发送')
      return
    }
    console.log('[调试] 开始发送消息:', v)

    // 要发送的原始数据
    const originalData = {
      system: '1',
      dashScopeMessageDTOList: [{ role: 'user', content: v }]
    }

    const item: MessageInfo = {
      loading: false,
      position: 'right',
      msgId: `${Date.now()}_m2`,
      chatId: `${Date.now()}_c_c1`,
      name: userInfo.name,
      avator: userInfo.avator,
      userId: userInfo.userId,
      sendPicUrl: '',
      sendContent: v
    }
    listData.value.push(item)
    console.log('[调试] 用户消息已添加到列表')

    const dataStr = CryptoJS.enc.Utf8.parse(JSON.stringify(originalData))

    // AES 加密（CBC 模式，PKCS7 填充）
    const encrypted = CryptoJS.AES.encrypt(dataStr, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // 将密文转为十六进制（Hex）字符串
    const hexCiphertext = encrypted.ciphertext.toString(CryptoJS.enc.Hex)

    const url = 'https://opi.3o2g4cpj.link/opi/v1/aaasss'

    const data = hexCiphertext

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      appVersion: '1.0.0',
      deviceNo: 'qLHAFA35vphwki4J7yaIhoyFoR944332211',
      appId: '44332211'
    }

    aiIndex.value += 1
    const currentAiIndex = aiIndex.value
    const aiItem: MessageInfo = {
      loading: true,
      position: 'left',
      msgId: `ai_${currentAiIndex}`,
      chatId: `${Date.now()}_c_c1_ai`,
      name: '',
      avator: '',
      userId: `${Date.now()}_c_c1_ai_c`,
      sendPicUrl: '',
      sendContent: ''
    }

    listData.value.push(aiItem)
    console.log('[调试] AI消息项已添加，msgId:', `ai_${currentAiIndex}`, 'loading:', true)

    try {
      console.log('[调试] 开始发送请求到:', url)
      const response = await axios.post(url, data, {
        headers,
        transformRequest: [data => data]
      })
      console.log('[调试] 请求成功，响应数据:', response.data)
      console.log('[调试] 响应result字段:', response.data?.result)

      const list = aesHexDecrypt(response.data.result)
      console.log('[调试] 解密后的数据:', list)
      console.log('[调试] 解密数据路径 list.output.choices[0].message.content:', list?.output?.choices?.[0]?.message?.content)

      const targetItem = listData.value.find(v => v.msgId === `ai_${currentAiIndex}`)
      if (targetItem) {
        console.log('[调试] 找到目标消息项，准备更新')
        targetItem.loading = false
        targetItem.sendContent = list?.output?.choices?.[0]?.message?.content || ''
        console.log('[调试] 消息项已更新，loading:', targetItem.loading, 'content:', targetItem.sendContent)
      } else {
        console.error('[调试] 未找到目标消息项，msgId:', `ai_${currentAiIndex}`)
        console.log('[调试] 当前列表中的所有msgId:', listData.value.map(v => v.msgId))
      }
    } catch (error: any) {
      console.error('[调试] 请求失败 - 错误对象:', error)
      console.error('[调试] 错误类型:', error?.constructor?.name)
      console.error('[调试] 错误消息:', error?.message)
      console.error('[调试] 错误代码:', error?.code)
      console.error('[调试] 请求URL:', url)
      console.error('[调试] 请求数据长度:', data?.length)

      if (error.response) {
        console.error('[调试] 响应状态码:', error.response.status)
        console.error('[调试] 响应状态文本:', error.response.statusText)
        console.error('[调试] 响应数据:', error.response.data)
        console.error('[调试] 响应头:', error.response.headers)
      } else if (error.request) {
        console.error('[调试] 请求已发出但无响应:', error.request)
        console.error('[调试] 请求配置:', JSON.stringify({
          url,
          method: 'POST',
          headers
        }, null, 2))
      }

      console.error('[调试] 完整错误信息:', JSON.stringify({
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
        response: error?.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data
            }
          : undefined,
        request: error?.request
          ? 'Request object exists'
          : undefined
      }, null, 2))

      // 错误时也要将loading设置为false
      const targetItem = listData.value.find(v => v.msgId === `ai_${currentAiIndex}`)
      if (targetItem) {
        console.log('[调试] 错误处理：将loading设置为false')
        targetItem.loading = false
        // 根据错误类型显示不同的错误信息
        let errorMessage = 'Sorry, the request failed, please try again later'
        if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
          errorMessage = 'Network connection failed, please check network settings'
        } else if (error?.response) {
          errorMessage = `Request failed (${error.response.status}): ${error.response.statusText || 'Server error'}`
        }
        targetItem.sendContent = errorMessage
        console.log('[调试] 错误消息已设置:', errorMessage)
      } else {
        console.error('[调试] 错误处理：未找到目标消息项')
      }
    }
  }
</script>

<template>
  <div text-red class="chat-details_box">
    <div class="top-box">
      <ul p-layout-padding style="margin-right: 130px;">
        <li @click="onSend('I\'m feeling great today.')">
          <span>I'm feeling great today.</span>
          <van-image
            :src="ChatIcon"
            :style="{ width: '14px', height: '14px' }"
          />
        </li>
        <li @click="onSend('Do you like reading?')">
          <span>Do you like reading?</span>
          <van-image
            :src="ChatIcon"
            :style="{ width: '14px', height: '14px' }"
          />
        </li>
        <li @click="onSend('Can you comfort me?')">
          <span>Can you comfort me?</span>
          <van-image
            :src="ChatIcon"
            :style="{ width: '14px', height: '14px' }"
          />
        </li>
      </ul>
      <van-image
        :src="RightImage"
        class="right-image"
      />
    </div>

    <chat-list
      v-model:list="listData"
      class="bottom-list_box"
      @send="onSend"
    />
  </div>
</template>

<style lang="less" scoped>
  .bottom-list_box {
    padding-bottom: calc(80px + var(--ai-view-padding-bottom));
  }
  .chat-details_box {
    min-height: 100vh;
    background: #0e080f;
    background-image: url('@/assets/public/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .top-box {
    height: 282px;
    background: linear-gradient(90deg, rgba(167, 48, 255, 1) 0%, rgba(167, 48, 255, 1) 100%);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    .right-image {
      position: absolute;
      right: 20px;
      bottom: 40px;
      width: 120px;
      height: 130;
    }

    ul {
      flex: 1;
      li + li {
        margin-top: 16px;
      }

      li {
        border-radius: var(--ai-chat-details-top-border-radius);
        padding: 0 12px;
        width: 100%;
        height: var(--ai-chat-details-top-height);
        line-height: var(--ai-chat-details-top-height);
        font-size: var(--ai-chat-details-top-text-font-size);
        font-weight: var(--ai-chat-details-top-text-font-weight);
        background: rgba(28, 123, 255, 0.2);
        letter-spacing: 0;
        color: var(--ai-chat-details-top-text-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: opacity 0.2s;

        span {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 8px;
        }

        &:active {
          opacity: 0.7;
        }
      }
    }
  }
</style>
