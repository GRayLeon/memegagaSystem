<script setup>
  import { useEditorStore } from '@/stores/editor'
	import { storeToRefs } from 'pinia'
  import { ref } from 'vue'

  const editorStore = useEditorStore()
	const { editorContent } = storeToRefs(editorStore)

</script>

<template>
</template>

<style scoped>
</style>
