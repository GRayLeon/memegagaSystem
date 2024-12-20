<script setup>
  import { RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
	import { storeToRefs } from 'pinia'
  import { ref } from 'vue'

  const authStore = useAuthStore()
	const { isLogin, login } = storeToRefs(authStore)

  const loginAccount = ref({
    account: null,
    password: null
  })
</script>

<template>
  <div class="adminView">
    <div class="loginArea">
      <div class="loginBox" v-if="!isLogin">
        <h1>登入產品管理系統</h1>
        <input
          type="text"
          v-model="loginAccount.account"
          placeholder="請輸入帳號">
        <input
          type="password"
          v-model="loginAccount.password"
          placeholder="請輸入密碼">
        <button @click="login(loginAccount)">登入</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
