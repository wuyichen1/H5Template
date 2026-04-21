<script setup lang="ts">
import loginwarn from '@/assets/public/loginwarn.png'
import toLoginBg from '@/assets/public/toLoginbg.png'
import { useLoginPopup } from '@/hooks/useLoginPopup'

const {
  loginPopupVisible,
  loginPopupMessage,
  closeLoginPopup,
  confirmLoginPopup
} = useLoginPopup()
</script>

<template>
  <van-popup
    v-model:show="loginPopupVisible"
    :close-on-click-overlay="false"
    teleport="body"
    class="login-required-popup"
  >
    <div class="login-required-content">
      <div
        class="login-card"
        :style="{
          backgroundImage: `url(${toLoginBg})`
        }"
      >
        <van-image :src="loginwarn" class="warn-image" />
        <p class="message">
          {{ loginPopupMessage }}
        </p>
      </div>

      <app-gradient-button class="login-btn" label="Log in" @click="confirmLoginPopup" />

      <button class="close-btn" type="button" @click="closeLoginPopup">
        <van-icon name="cross" />
      </button>
    </div>
  </van-popup>
</template>

<style scoped lang="less">
  .login-required-popup {
    background: transparent;
  }

  .login-required-content {
    width: 300px;
    // height: 460px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-card {
    width: 100%;
    height: 280px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 50px;
  }

  .warn-image {
    width: 90px;
    height: 90px;
    margin-bottom: 16px;
  }

  .message {
    margin: 0;
    color: #2f3037;
    font-size: 20px;
    line-height: 1.2;
    text-align: center;
  }

  .login-btn {
    width: 70%;
    margin-top: 30px;
  }

  .close-btn {
    width: 38px;
    height: 38px;
    margin-top: 36px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: transparent;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
  }
</style>
