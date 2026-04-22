<script setup lang="ts">
  import {
    closeToast,
    showFailToast,
    showLoadingToast,
    showSuccessToast
  } from 'vant'
  import defaultHead from '@/assets/public/default-head.png'
  import upImg from '@/assets/public/up-img.png'
  import { useFile } from '@/hooks/useFile'

  defineOptions({
    name: 'UserRegister'
  })

  const { imgUrl, clickElement } = useFile()

  const form = reactive({
    name: '',
    birthday: '2003-01-01',
    location: '',
    gender: 'male' as 'male' | 'female'
  })

  const showBirthday = ref(false)
  const showLocation = ref(false)

  const minCalendarDate = new Date(1950, 0, 1)
  const maxCalendarDate = new Date()
  const defaultCalendarDate = computed(() => {
    const [y, m, d] = form.birthday.split('-').map(Number)
    if (!y || !m || !d)
      return new Date(2003, 0, 1)
    return new Date(y, m - 1, d)
  })

  const locationOptions = [
    'Los Angeles',
    'New York',
    'London',
    'Tokyo',
    'Shanghai',
    'Singapore',
    'Sydney'
  ]

  const locationActions = locationOptions.map(name => ({ name }))

  const formatYmd = (d: Date) => {
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${mo}-${day}`
  }

  const onBirthdayConfirm = (value: Date | Date[]) => {
    const d = Array.isArray(value) ? value[0] : value
    form.birthday = formatYmd(d)
    showBirthday.value = false
  }

  const onLocationSelect = (item: { name: string }) => {
    form.location = item.name
    showLocation.value = false
  }

  /** 无参：原生走 readDraft；有参：原生走提交 finalize */
  const callNativeNewUserData = async (
    payload?: NewUserBridgeData
  ): Promise<unknown> => {
    const bridge = window.flutter_inappwebview
    if (!bridge?.callHandler)
      return null
    if (payload)
      return bridge.callHandler('newUserData', payload)
    return bridge.callHandler('newUserData')
  }

  const isSubmitIgnored = (v: unknown): v is NewUserDataSubmitResult =>
    typeof v === 'object' && v !== null && 'ok' in v && (v as { ok: unknown }).ok === false

  const isDraftShape = (v: unknown): v is NewUserBridgeData => {
    if (typeof v !== 'object' || v === null)
      return false
    const o = v as Record<string, unknown>
    if (o.ok !== undefined)
      return false
    return typeof o.name === 'string' || typeof o.avator === 'string'
  }

  /** 进入页面时拉取原生草稿（与 Flutter 空参分支一致） */
  const syncDraftFromNative = async () => {
    try {
      const raw = await callNativeNewUserData()
      if (raw == null || isSubmitIgnored(raw))
        return
      if (isDraftShape(raw)) {
        const d = raw as NewUserBridgeData
        if (d.name)
          form.name = d.name
        if (d.avator)
          imgUrl.value = d.avator
      }
    }
    catch (e) {
      console.warn('newUserData read draft failed', e)
    }
  }

  const onNext = async () => {
    if (!form.name.trim()) {
      showFailToast('Please enter nickname')
      return
    }

    showLoadingToast({
      message: 'Submitting...',
      forbidClick: true,
      duration: 0
    })

    try {
      const payload: NewUserBridgeData = {
        name: form.name.trim(),
        avator: imgUrl.value?.trim() || ''
      }
      const raw = await callNativeNewUserData(payload)
      closeToast()

      if (raw == null) {
        showSuccessToast('OK')
        return
      }

      if (isSubmitIgnored(raw)) {
        showFailToast('Submit unavailable')
        return
      }

      const ok = (raw as { ok?: boolean }).ok === true
      if (ok)
        showSuccessToast('Saved')
      else
        showFailToast('Submit failed')
    }
    catch (e) {
      closeToast()
      console.warn('newUserData submit failed', e)
      showFailToast('Submit failed')
    }
  }

  onMounted(() => {
    syncDraftFromNative()
  })
</script>

<template>
  <div safe-area-inset-top class="user-register_box">
    <div class="register-inner" p-layout-padding>
      <div class="avatar-wrap">
        <div class="avatar-inner">
          <van-image
            round
            h-23
            w-23
            :src="imgUrl || defaultHead"
            fit="cover"
            @click="clickElement"
          />
          <van-image
            round
            h-7
            w-7
            class="camera-badge"
            :src="upImg"
            fit="cover"
            @click="clickElement"
          />
        </div>
      </div>

      <div class="field-block">
        <div ai-input-title class="field-label">
          Nickname:
        </div>
        <van-field
          v-model="form.name"
          placeholder="Please enter"
          class="public-input"
        />
      </div>

      <div class="field-block">
        <div ai-input-title class="field-label">
          Birthday:
        </div>
        <div class="picker-row public-input" @click="showBirthday = true">
          <span class="picker-text">{{ form.birthday }}</span>
          <span class="picker-arrow" />
        </div>
      </div>

      <div class="field-block">
        <div ai-input-title class="field-label">
          Location:
        </div>
        <div class="picker-row public-input" @click="showLocation = true">
          <span class="picker-text">{{
            form.location || 'Please select'
          }}</span>
          <span class="picker-arrow" />
        </div>
      </div>

      <div class="field-block">
        <div ai-input-title class="field-label">
          Gender:
        </div>
        <div class="gender-row">
          <button
            type="button"
            class="gender-pill male"
            :class="{ active: form.gender === 'male' }"
            @click="form.gender = 'male'"
          >
            ♂
          </button>
          <button
            type="button"
            class="gender-pill female"
            :class="{ active: form.gender === 'female' }"
            @click="form.gender = 'female'"
          >
            ♀
          </button>
        </div>
      </div>

      <div mt-10 flex justify-center>
        <p ai-gradient-btn class="next-btn" @click="onNext">
          Next
        </p>
      </div>
    </div>

    <van-calendar
      v-model:show="showBirthday"
      type="single"
      :min-date="minCalendarDate"
      :max-date="maxCalendarDate"
      :default-date="defaultCalendarDate"
      color="#1c7bff"
      @confirm="onBirthdayConfirm"
    />

    <van-action-sheet
      v-model:show="showLocation"
      :actions="locationActions"
      cancel-text="Cancel"
      close-on-click-action
      @select="onLocationSelect"
    />
  </div>
</template>

<style lang="less" scoped>
  .user-register_box {
    padding-top: calc(
      var(--van-nav-bar-height) + var(--ai-view-padding-top)
    );
    min-height: 100vh;
    background: #0b0a0a;
  }

  .register-inner {
    padding-bottom: 32px;
  }

  .avatar-wrap {
    display: flex;
    justify-content: center;
    // margin-top: 0px;
    margin-bottom: 28px;
  }

  .avatar-inner {
    position: relative;
    display: inline-block;
  }

  .camera-badge {
    position: absolute;
    right: 0;
    bottom: 0;
    border: 2px solid #0b0a0a;
  }

  .field-block + .field-block {
    margin-top: 18px;
  }

  .field-label {
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 18px;
  }

  .public-input {
    background: #011733 !important;
    border-radius: 16px;
    overflow: hidden;
    height: 52px;
    line-height: 30px;
  }

  :deep(.van-field__control) {
    color: #fff;
  }

  :deep(.van-field__placeholder) {
    color: rgba(255, 255, 255, 0.45);
  }

  .picker-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 52px;
    padding: 10px 16px;
    box-sizing: border-box;
  }

  .picker-text {
    color: #fff;
    font-size: 15px;
  }

  .picker-arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #1c7bff;
  }

  .gender-row {
    display: flex;
    gap: 14px;
  }

  .gender-pill {
    flex: 1;
    // height: 52px;
    border: none;
    border-radius: 26px;
    font-size: 22px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    padding: 10px 0;
  }

  .gender-pill.male {
    background: rgba(28, 123, 255, 0.2);
    color: rgba(255, 255, 255, 0.5);
  }

  .gender-pill.male.active {
    background: #1c7bff;
    color: #fff;
  }

  .gender-pill.female {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.5);
  }

  .gender-pill.female.active {
    background: #fff;
    color: #111;
  }

  .next-btn {
    min-width: 220px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    border: 1px solid #fff;
    border-radius: 34px;
    margin-bottom: 34px;
  }
</style>
