<script setup>
  import { useInquiryStore } from '@/stores/inquiry'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const inquiryStore = useInquiryStore()
  const { page, pageSize, category, status, sort, order, getInquiryDatas } = storeToRefs(inquiryStore)

  onMounted( () => {
    page.value = 1
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getInquiryDatas.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  onUpdated( () => {
    getInquiryDatas.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
