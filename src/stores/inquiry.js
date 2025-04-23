import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useInquiryStore = defineStore('inquiry', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const inquirys = ref([])

  const getInquiryDatas = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/inquiry`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        inquirys.value = [...response.data]
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })


  return { inquirys, getInquiryDatas }
})
