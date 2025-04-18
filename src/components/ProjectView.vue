<script setup>
  import { useProjectStore } from '@/stores/project'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const projectStore = useProjectStore()
  const { page, pageSize, category, status, sort, order, getProjects } = storeToRefs(projectStore)

  onMounted( () => {
    page.value = 1
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getProjects.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  onUpdated( () => {
    getProjects.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
