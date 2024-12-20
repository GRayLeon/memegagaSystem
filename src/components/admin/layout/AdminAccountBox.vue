<script setup>
  import { useAuthStore } from '@/stores/auth'
	import { storeToRefs } from 'pinia'

  const authStore = useAuthStore()
	const { profile, logout } = storeToRefs(authStore)

</script>

<template>
  <div class="accountBox">
    <div class="webTitle">
      <span>產品管理系統</span>
    </div>
    <nav>
      <p>登入帳號 - {{ profile.account }} / {{ profile.type }}</p>
      <a href="/" target="_blank">網站前台</a>
      <a href="" @click="logout()">登出</a>
    </nav>
  </div>
</template>

<style scoped>
</style>