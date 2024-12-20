<script setup>
  import { RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
	import { storeToRefs } from 'pinia'
  import { watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const authStore = useAuthStore()
	const { logout } = storeToRefs(authStore)
  
  const { locale } = useI18n()


  const changeLanguage = newLang => {
    locale.value = newLang
  }

  onMounted( () => {
    if (locale.value == 'en-US') { locale.value = 'en' }
  })

  watch(locale, nVal => {
    changeLanguage(nVal)
  })
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">{{ $t('link.home') }}</RouterLink>
    </nav>
    <select class="lanSelect" v-model="locale">
      <option value="en">En</option>
      <option value="zh">中文</option>
    </select>
  </header>
</template>

<style scoped>
  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
</style>