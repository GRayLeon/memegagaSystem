<script setup>
  import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mainNav">
    <nav>
      <RouterLink to="/admin">
        <span class="material-icons">home</span>
        <span>系統首頁</span>
      </RouterLink>
      <!-- <RouterLink to="/admin/editor">頁面文案</RouterLink> -->
      <RouterLink to="/admin/product">
        <span class="material-icons">list_alt</span>
        <span>產品管理</span>
      </RouterLink>
      <RouterLink to="/admin/category">
        <span class="material-icons">category</span>
        <span>分類管理</span>
      </RouterLink>
      <RouterLink to="/admin/size">
        <span class="material-icons">crop_free</span>
        <span>規格管理</span>
      </RouterLink>
      <RouterLink to="/admin/account">
        <span class="material-icons">group</span>
        <span>帳號管理</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
</style>