<script setup>
  import { useSpecStore } from '@/stores/spec'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { onMounted, onUpdated } from 'vue'

  const specStore = useSpecStore()
	const { specDatas } = storeToRefs(specStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  // origin

  const addAppearance = () => {
    specDatas.value.appearance.list.push({
      en: '',
      zh: ''
    })
  }

  const removeAppearance = idx => {
    specDatas.value.appearance.list.splice(idx, 1)
  }

  onMounted(() => {
    isLoading.value = true
  })

  onUpdated( () => {
    isLoading.value = false
  })
</script>

<template>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="name">名稱(英文)</th>
        <th class="name">名稱(中文)</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr
        v-for="(appearance, idx) in specDatas.appearance.list">
        <td class="name">
          <input
            type="text"
            placeholder="請輸入外觀英文"
            v-model="appearance.en" />
        </td>
        <td class="name">
            <input
            type="text"
            placeholder="請輸入外觀中文"
            v-model="appearance.zh" />
        </td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="removeAppearance(idx)">刪除外觀</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="bottomButtonArea">
    <button @click="addAppearance()">新增外觀</button>
  </div>
</template>

<style scoped>
</style>
