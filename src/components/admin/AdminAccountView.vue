<script setup>
  import { RouterView } from 'vue-router'
  import { useAccountStore } from '@/stores/account'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { onMounted, onUpdated } from 'vue'
  
  const accountStore = useAccountStore()
	const { getAccounts } = storeToRefs(accountStore)

  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  onMounted( () => {
    getAccounts.value()
  })

  onUpdated( () => {
    isAdminLoading.value = false
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
