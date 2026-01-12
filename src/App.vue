<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouteCacheStore } from '@/stores'
import { applyDynamicTheme } from './utils/applyDynamicTheme'

const { t } = useI18n()

useHead({
  title: () => t('app.name'),
  meta: [
    {
      name: 'description',
      content: () => t('app.description')
    },
    {
      name: 'theme-color',
      content: () => (isDark.value ? '#0B0A0A' : '#ffffff')
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () =>
        preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'
    }
  ]
})

isDark.value = false

const routeCacheStore = useRouteCacheStore()

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})

const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})

onMounted(() => {
  applyDynamicTheme()
})
</script>

<template>
  <van-config-provider :theme="mode">
    <nav-bar />
    <router-view v-slot="{ Component }">
      <section class="app-wrapper">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" />
        </keep-alive>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  z-index: 2;
}

.app-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(32, 25, 43, 1) 0%, rgba(32, 25, 43, 0) 100%), linear-gradient(90deg, rgba(57, 44, 176, 1) 0%, rgba(110, 12, 149, 1) 100%);
  pointer-events: none;
  z-index: 1;
}
</style>
