<script setup>
  import { useProductStore } from '@/stores/product'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted } from 'vue'

  const productStore = useProductStore()
  const { page, pageSize, category, status, sort, order, getProducts } = storeToRefs(productStore)

  onMounted( () => {
    page.value = 1
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getProducts.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
