import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useCategoryStore = defineStore('category', () => {
  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const categorys = ref([])

  const getCategorys = ref( async () => {
    isAdminLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/category`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        categorys.value = [...response.data]
        isAdminLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const editCategory = ref( async (category, type, target) => {
    isAdminLoading.value = true
    
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/category/${type}`
    const token = getToken.value()
    if (typeof category.active == String) { 
      category.active = category.active == 'true'
    }
    let typeWording = type == 'edit' ? '編輯' : '新增'
    try {
      let response = await axios.post(apiURL, category, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) {
        openDialog.value('success', `${typeWording}成功`, `分類已經${typeWording}成功，按確定返回產品分類管理列表。`, target)
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddCategory = ref( () => {
    router.push({ name: 'adminCategoryAdd'})
  })

  return { categorys, getCategorys, editCategory, goToAddCategory }
})
