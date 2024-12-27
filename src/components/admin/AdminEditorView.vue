<script setup>
  import { useEditorStore } from '@/stores/editor'
	import { storeToRefs } from 'pinia'

  import TinycmeEditor from '@/components/admin/editor/tinymce.vue'

  const editorStore = useEditorStore()
	const { editorContent } = storeToRefs(editorStore)

</script>

<template>
  <tinycme-editor v-model="editorContent"></tinycme-editor>
</template>

<style scoped>
</style>
