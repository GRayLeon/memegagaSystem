import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadStore = defineStore('load', () => {

  const isAdminLoading = ref(false)

  return { isAdminLoading }
})
