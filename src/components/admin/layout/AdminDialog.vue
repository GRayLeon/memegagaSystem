<script setup>
  import { useLoadStore } from '@/stores/load'
  import { useDialogStore } from '@/stores/dialog'
	import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'
  import { computed } from 'vue'

  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { dialogIsOpen, dialogStatus, dialogTitle, dialogInfo, dialogTarget } = storeToRefs(dialogStore)

  const router = useRouter()

  const resetDialog = () => {
    dialogIsOpen.value = false
    dialogTitle.value = null
    dialogStatus.value = null
    dialogInfo.value = null
    dialogTarget.value = null
  }

  const redirectTo = route => {
    if (dialogTarget.value == 'reload') {
      window.location.reload()
    } else if (dialogTarget.value == 'noRedirect') {
      isAdminLoading.value = false
    } else {
      router.push({ name: route })
    }
    resetDialog()
  }

</script>

<template>
  <div class="adminDialog" v-if="dialogIsOpen">
    <div class="adminDialog__box">
      <div class="adminDialog__icon" :class="dialogStatus">
        {{ dialogStatus == 'success' ? '✔' : '✘' }}
      </div>
      <div class="adminDialog__title">{{ dialogTitle }}</div>
      <div class="adminDialog__info">{{ dialogInfo }}</div>
      <button @click="redirectTo(dialogTarget)">確定</button>
    </div>
  </div>
</template>

<style scoped>
</style>
