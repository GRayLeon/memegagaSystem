<script setup>
  import { useAccountStore } from '@/stores/account'
  import { useDialogStore } from '@/stores/dialog'
  import { storeToRefs } from 'pinia'

  const accountStore = useAccountStore()
	const { accounts, goToAddAccount } = storeToRefs(accountStore)

  const dialogStore = useDialogStore()
	const { openDialog } = storeToRefs(dialogStore)

  const showDate = inputDate => {
    if (inputDate) {
      const date = new Date(inputDate)
      return date.toLocaleString()
    } else {
      return '尚未登入'
    }
  }
</script>

<template>
  <div class="title">
    <h1>帳號管理</h1>
    <button @click="goToAddAccount()">新增帳號</button>
  </div>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="name">帳號</th>
        <th class="type">權限</th>
        <th class="lastLogin">最後登入時間</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr v-for="account in accounts">
        <td class="name">{{ account.account }}</td>
        <td class="type">{{ account.type }}</td>
        <td class="lastLogin">{{ showDate(account.lastLogin) }}</td>
        <td><button @click="openDialog('delete', '確定刪除', '刪除後將無法復原，是否要將此帳號刪除？', 'adminAccountList', account._id)">刪除帳號</button></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
