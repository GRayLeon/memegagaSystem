<script setup>
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'

  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  onMounted( () => {
    isAdminLoading.value = false
  })
</script>

<template>
  <div class="homeContent">
    <h2>功能介紹：</h2>
    <ul>
      <li><b>產品管理：</b>調整產品銷售狀態，管理產品上架或下架。</li>
      <li><b>商品規格管理：</b>編輯商品規格，管理啟用或停用狀態。</li>
      <li><b>商品分類管理：</b>編輯商品分類，管理啟用或停用狀態。</li>
      <li><b>帳號管理：</b>設置與管理後台帳號及其使用權限。</li>
    </ul>
    <hr>
    <h2>開發環境：</h2>
    <ul>
      <li><b>前端：</b>Vue 3 + Vite</li>
      <li><b>後端：</b>Express</li>
      <li><b>資料庫：</b>MongoDB Atlas</li>
      <li><b>媒體存儲：</b>Cloudinary</li>
      <li><b>部署平台：</b>Render</li>
    </ul>
  </div>
</template>

<style scoped>
</style>
