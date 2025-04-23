<script setup>
  import { useInquiryStore } from '@/stores/inquiry'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const specStore = useSpecStore()
	const { getInquiryDatas } = storeToRefs(specStore)

  onMounted( () => {
    getInquiryDatas.value()
  })

  onUpdated( () => {
    getInquiryDatas.value()
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">edit_note</span>諮詢管理</h1>
  </div>
  <div class="borderBox">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
</style>
