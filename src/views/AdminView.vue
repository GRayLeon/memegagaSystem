<script setup>
  import { RouterView, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { watch, onMounted } from 'vue'

  import AdminNav from '../components/admin/layout/AdminNav.vue'
  import AdminAccountBox from '../components/admin/layout/AdminAccountBox.vue'
  import AdminDialog from '../components/admin/layout/AdminDialog.vue'

  const authStore = useAuthStore()
	const { isLogin } = storeToRefs(authStore)

  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  const router = useRouter()

  watch( isLogin, nVal => {
    if (!nVal) {
      router.push({ name: 'adminLogin'})
    }
  })

  onMounted( () => {
    isAdminLoading.value = false
  })
</script>

<template>
  <div class="adminView">
    <AdminAccountBox></AdminAccountBox>
    <AdminNav></AdminNav>
    <div class="adminContent">
      <RouterView></RouterView>
    </div>
  </div>
  <div class="adminLoading" v-if="isAdminLoading">
    <span>LOADING</span>
  </div>
  <AdminDialog></AdminDialog>
</template>

<style scoped>
</style>
