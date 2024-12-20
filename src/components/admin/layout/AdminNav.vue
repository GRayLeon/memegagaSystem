<script setup>
  import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mainNav">
    <nav>
      <RouterLink to="/admin">系統首頁</RouterLink>
      <RouterLink to="/admin/product">產品管理</RouterLink>
      <RouterLink to="/admin/category">產品分類管理</RouterLink>
      <RouterLink to="/admin/size">產品規格管理</RouterLink>
      <RouterLink to="/admin/account">帳號管理</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
</style>