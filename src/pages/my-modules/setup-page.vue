<script setup lang="ts">
  import type { AppCommunication } from '@/hooks/useJump'
  import RightIcon from '@/assets/public/right-icon.png'
  import { useJump } from '@/hooks/useJump'

  defineOptions({
    name: 'SetupPage'
  })

  const { appParams, jumpToUserAgreement, jumpToBlackList } = useJump()

  const listData = [
    { label: 'Privacy Agreement', value: '0' },
    { label: 'User Agreement', value: '1' },
    { label: 'Blacklist', value: '2' }
  ]

  const userAndPrivacyAgreement = [
    'We hereby advise you to carefully read and understand this User Agreement (hereinafter referred to as “Agreement”)before registering. In order to clarify rights and obligations of all parties,and protect the legitimate rights and interests of all parties,this Agreement is specially formulated.the contents highlighted in bold underline in this Agreement are specially reminded of your attention.Please ensure that you fully understand this Agreement.You are not authorized to register ,log in or use our services or software(hereinafter referred to as services, software)unless you accept all the Agreement.Your registration,login,usage,etc.will bu deemed as acceptance of this Agreement and you agree to be bound by the Agreement. We reserve the right,at our discretion, to change,modify,add,or remove portions of the Agreement,sup;ementary Agreement,Privacy Policy,regulative provisions or feature terms at any time by posting the amended version on our software or within the services without prior noice.If you do not agree to these terms or any future amended version,then you must not access,use our services.Otherwise,your access,use of our services shall be deemed to agree any future updated version of them.',
    'We hereby advise you to carefully read and understand this User Agreement (hereinafter referred to as “Agreement”)before registering. In order to clarify rights and obligations of all parties,and protect the legitimate rights and interests of all parties,this Agreement is specially formulated.the contents highlighted in bold underline in this Agreement are specially reminded of your attention.Please ensure that you fully understand this Agreement.You are not authorized to register ,log in or use our services or software(hereinafter referred to as services, software)unless you accept all the Agreement.Your registration,login,usage,etc.will bu deemed as acceptance of this Agreement and you agree to be bound by the Agreement. We reserve the right,at our discretion, to change,modify,add,or remove portions of the Agreement,sup;ementary Agreement,Privacy Policy,regulative provisions or feature terms at any time by posting the amended version on our software or within the services without prior noice.If you do not agree to these terms or any future amended version,then you must not access,use our services.Otherwise,your access,use of our services shall be deemed to agree any future updated version of them.',
    'Blacklist'
  ]

  const onState = (key: AppCommunication) => {
    appParams({ key, state: 2 })
  }

  const onSelect = (value: string) => {
    if (value === '2') {
      jumpToBlackList()
    }
    if (value === '0') {
      jumpToUserAgreement('/privacy-agreement')
    }
    if (value === '1') {
      jumpToUserAgreement('/user-agreement')
    }
  }
</script>

<template>
  <div safe-area-inset-top class="setup-page_box">
    <ul p-layout-padding class="list-btn">
      <li
        v-for="item in listData"
        :key="item.value"
        @click="onSelect(item.value)"
      >
        <span>{{ userAndPrivacyAgreement[Number(item.value)] }}</span>
        <van-image h-3 w-4 :src="RightIcon" fit="cover" />
      </li>
    </ul>

    <!-- 按钮 -->
    <ul mt-60>
      <li flex justify-center>
        <p
          ai-gradient-btn
          class="bottom-btn"
          @click="onState('deleteaccount')"
        >
          Delete account
        </p>
      </li>
      <li mt-5 flex justify-center>
        <p ai-gradient-btn class="bottom-btn" @click="onState('logout')">
          Log out
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
  .setup-page_box {
    padding-top: calc(
      var(--van-nav-bar-height) + var(--ai-view-padding-top)
    );
    min-height: 100vh;
    background: var(--ai-setting-bg-color);
  }

  .list-btn {
    li + li {
      margin-top: 16px;
    }

    li {
      width: var(--ai-setting-select-style-width);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      height: var(--ai-setting-select-style-height);
      border-radius: var(--ai-setting-select-style-border-radius);
      background: var(--ai-setting-select-style-bg-color);

      span {
        font-size: var(--ai-setting-select-style-text-size);
        font-weight: var(--ai-setting-select-style-text-weight);
        color: var(--ai-setting-select-style-text-color);
      }
    }
  }

  .bottom-btn {
    // background-image: var(--ai-setting-btn-color) !important;
    background: linear-gradient(201.44deg, rgba(28, 123, 255, 1) 0%, rgba(0, 0, 0, 1) 51.28%, rgba(255, 129, 51, 1) 100%) !important;
    font-size: var(--ai-setting-btn-text-size) !important;
    font-weight: var(--ai-setting-btn-text-weight) !important;
    color: var(--ai-setting-btn-text-color) !important;
  }
</style>
