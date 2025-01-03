<script setup>
  import { useLoadStore } from '@/stores/load'
  import { useAuthStore } from '@/stores/auth'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted } from 'vue'

  import AdminDialog from '@/components/admin/layout/AdminDialog.vue'
  import AdminLoading from '@/components/admin/layout/AdminLoading.vue'

  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { isLogin, login } = storeToRefs(authStore)

  const loginAccount = ref({
    account: null,
    password: null
  })

  onMounted( () => {
    isAdminLoading.value = false
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
  <AdminLoading></AdminLoading>
  <AdminDialog></AdminDialog>
</template>

<style scoped>
</style>
