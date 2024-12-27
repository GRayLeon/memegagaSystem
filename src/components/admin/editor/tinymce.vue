<script setup>
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import tinymce from 'tinymce/tinymce.js'

// 外觀
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/themes/silver'

// Icon
import 'tinymce/icons/default'

// 用到的外掛
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis.js'
import 'tinymce/plugins/table'
import 'tinymce/plugins/quickbars'

// 語言包
import 'tinymce-i18n/langs5/zh_TW.js'

// TinyMCE-Vue
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  plugins: {
    type: [String, Array],
    default: () => ['quickbars', 'emoticons', 'table']
  },
  toolbar: {
    type: [String, Array],
    default: () =>
      'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | axupimgs | removeformat | table | emoticons'
  }
})

const emit = defineEmits(['update:modelValue'])

const init = reactive({
  language: 'zh_TW',
  height: 500,
  menubar: false,
  content_css: false,
  skin: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  quickbars_insert_toolbar: false,
  branding: false
})

// 用於 TinyMCE 的內容管理
const editorValue = ref(props.modelValue)

// 監聽 `modelValue` 同步到編輯器內容
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorValue.value !== newValue) {
      editorValue.value = newValue
    }
  }
)

// 監聽 `editorValue`，將編輯器內容同步到父層
watch(editorValue, (newValue) => {
  emit('update:modelValue', newValue)
});

// 確保組件銷毀時清理 TinyMCE 實例
let editorInstance = null

onBeforeUnmount(() => {
  console.log(editorInstance)
  if (editorInstance) {
    editorInstance.destroy()
    editorInstance = null
  }
  const tinyMCEContainer = document.querySelector('.tox-tinymce')
  if (tinyMCEContainer) {
    tinyMCEContainer.remove()
  }
})
</script>

<template>
  <editor
    v-model="editorValue"
    :init="init"
    @init="(event) => {
      editorInstance = event.target // 存儲 TinyMCE 實例以便銷毀
    }"
  ></editor>
</template>
