<script setup>
  import { useBrandStore } from '@/stores/brand'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const brandStore = useBrandStore()
  const { page, pageSize, category, status, sort, order, getBrands } = storeToRefs(brandStore)

  onMounted( () => {
    page.value = 1
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getBrands.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  onUpdated( () => {
    getBrands.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
