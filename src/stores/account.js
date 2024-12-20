import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useAccountStore = defineStore('account', () => {
  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const accounts = ref([])

  const isGetAccounts = ref(false)

  const getAccounts = ref( async () => {
    isAdminLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/auth`
    const token = getToken.value()
    try {
      let response = await axios.get(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        accounts.value = [...response.data]
        isGetAccounts.value = true
        isAdminLoading.value = false
      }
    } catch(e) {
      console.log(e)
    }
  })

  const addAccount = ref( async account => {
    isAdminLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/auth/register`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, account, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        console.log('done')
        getAccounts.value()
      }
    } catch(e) {
      console.log(e)
    }
  })


  const deleteAccount = ref( async account_id => {
    isAdminLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/auth/${account_id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        console.log('done')
        getAccounts.value()
      }
    } catch(e) {
      console.log(e)
    }
  })

  const goToAddAccount = ref( () => {
    router.push({ name: 'adminAccountAdd'})
  })

  return { accounts, isGetAccounts, getAccounts, deleteAccount, addAccount, goToAddAccount }
})
