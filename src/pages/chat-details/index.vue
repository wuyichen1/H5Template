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
    if (!isAllLoaded.value) return
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
    try {
      aiIndex.value += 1
      const aiItem: MessageInfo = {
        loading: true,
        position: 'left',
        msgId: `ai_${aiIndex.value}`,
        chatId: `${Date.now()}_c_c1_ai`,
        name: '',
        avator: '',
        userId: `${Date.now()}_c_c1_ai_c`,
        sendPicUrl: '',
        sendContent: ''
      }

      listData.value.push(aiItem)
      const response = await axios.post(url, data, {
        headers,
        transformRequest: [data => data]
      })
      const list = aesHexDecrypt(response.data.result)
      listData.value.forEach(v => {
        if (v.msgId === `ai_${aiIndex.value}`) {
          v.loading = false
          v.sendContent = list.output.choices[0].message.content
        }
      })
    } catch (error) {
      console.error('请求失败:', error.response?.data || error.message)
    }
  }
</script>

<template>
  <div text-red class="chat-details_box">
    <div class="top-box">
      <ul p-layout-padding style="margin-right: 100px;">
        <li @click="onSend('What style do you recommend?')">
          <span>What style do you recommend?</span>
          <van-image
            :src="ChatIcon"
            :style="{ width: '14px', height: '14px' }"
          />
        </li>
        <li @click="onSend('Pearl jewelry matching tips')">
          <span>Pearl jewelry matching tips</span>
          <van-image
            :src="ChatIcon"
            :style="{ width: '14px', height: '14px' }"
          />
        </li>
        <li @click="onSend('Dinner party accessories matching')">
          <span>Dinner party accessories matching</span>
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
    background: transparent;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;

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
