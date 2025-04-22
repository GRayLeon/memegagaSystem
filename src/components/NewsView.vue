<script setup>
  import { useNewsStore } from '@/stores/news'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const newsStore = useNewsStore()
  const { page, pageSize, category, status, sort, order, getNews } = storeToRefs(newsStore)

  onMounted( () => {
    page.value = 1
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getNews.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  onUpdated( () => {
    getNews.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
