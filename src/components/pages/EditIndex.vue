<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, onUpdated } from 'vue';

  const pagesStore = usePagesStore()
	const { 
    pages, selectIndexFile
  } = storeToRefs(pagesStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  // indexImages
  const previewUrl = ref(null)
  const previewName = ref('請選擇圖片檔案')

  const isChanging = ref(false)
  const changeImage = () => {
    isChanging.value = true
  }

  const onFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      selectIndexFile.value = file
      previewUrl.value = URL.createObjectURL(file)
      previewName.value = file.name
    } else {
      previewUrl.value = null
      previewName.value = '請選擇圖片檔案'
    }
  }

  onMounted( async () => {
    isLoading.value = true
  })

  onUpdated( () => {
    isLoading.value = false
  })

</script>

<template>
  <div class="editArea">
    <img
      :src="pages.index.imageURL"
      v-if="pages.index.imageURL && !isChanging">
    <img
      :src="previewUrl"
      v-else-if="previewUrl && isChanging">
    <div class="noImage" v-else><span>沒有圖片</span></div>
    <button
      v-if="!isChanging"
      @click="changeImage">
      更改圖片
    </button>
    <div v-else class="imageSelect">
      <input
        type="file"
        accept=".jpg, .png"
        name="selectImage"
        id="selectImage"
        @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <textarea
        v-model="pages.index.description.en"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <textarea
        v-model="pages.index.description.zh"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
  </div>
</template>

<style scoped>
</style>
