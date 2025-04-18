<script setup>
  import { useProjectStore } from '@/stores/project'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue';

  const projectStore = useProjectStore()
	const { 
    projects,
    selectImageFiles, updateImageFile,
    editProject
  } = storeToRefs(projectStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const projectInfo = ref({
    title: '',
    category: '',
    artist: '',
    description: {
      en: '',
      zh: ''
    },
    detail: {
      en: '',
      zh: ''
    },
    imageList: [{
      class: 'single',
      images: [{
        imageURL: '',
        imagePublicId: ''
      }]
    }],
    status: 'draft',
    tags: []
  })

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isDraft = ref(false)
  const isArchived = ref(false)

  const typeWording = computed( () => {
    return isEdit.value? '編輯' : '新增'
  })

  // projectImages
  const previewImageUrl = ref([{
    index: [0, 0],
    url: null
  }])
  const previewImageName = ref([{
    index: [0, 0],
    name: '請選擇圖片檔案'
  }])

  const isImageChanging = ref([{
    index: [0, 0],
    isChange: false
  }])

  const changeImage = (listIdx, idx) => {
    const target = isImageChanging.value.find( item =>
      item.index[0] === listIdx && item.index[1] === idx
    )
    if (target) {
      target.isChange = true
    }
  }

  const findTarget = (data, listIdx, idx) => {
    return data.find( item =>
      item.index[0] === listIdx && item.index[1] === idx
    ) || data[0]
  }
  const onImageFileChange = (event, listIdx, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + listIdx + idx}_${file.name}`, { type: file.type })

      const fileTarget = findTarget(selectImageFiles.value, listIdx, idx)
      if (fileTarget) {
        fileTarget.file = newFile
      }

      const urlTarget = findTarget(previewImageUrl.value, listIdx, idx)
      if (urlTarget) {
        urlTarget.url = URL.createObjectURL(file)
      }

      const nameTarget = findTarget(previewImageName.value, listIdx, idx)
      if (nameTarget) {
        nameTarget.name = file.name
      }

      updateImageFile.push({
        index: [listIdx, idx],
        name:  newFile.name.split(".")[0]
      })
    } else {
      const urlTarget = findTarget(previewImageUrl.value, listIdx, idx)
      if (urlTarget) {
        urlTarget.url = null
      }

      const nameTarget = findTarget(previewImageName.value, listIdx, idx)
      if (nameTarget) {
        nameTarget.name = '請選擇圖片檔案'
      }

      const updateTarget = findTarget(updateImageFile.value, listIdx, idx)
      if (updateTarget) {
        updateImageFile.value.splice(updateImageFile.value.indexOf(updateTarget), 1)
      }
    }
  }
  
  const addImage = () => {
    projectInfo.value.imageList.push({
      class: '',
      images: [{
        imageURL: '',
        imagePublicId: ''
      }]
    })
    isImageChanging.value.push({
      index: [projectInfo.value.imageList.length, 0],
      isChange: true
    })
  }

  const addSecondImage = listIdx => {
    console.log(listIdx)
    projectInfo.value.imageList[listIdx].images.push({
      imageURL: '',
      imagePublicId: ''
    })
    isImageChanging.value.push({
      index: [listIdx, 1],
      isChange: true
    })
  }
  const removeParent = (data, idx) => {
    data.forEach( (file, fidx) => {
      if (file.index[0] === idx) {
        data.splice(fidx, 1)
      }
    })
  }
  const removeImage = idx => {
    projectInfo.value.imageList.splice(idx, 1)
    removeParent(selectImageFiles.value, idx)
    removeParent(previewImageUrl.value, idx)
    removeParent(previewImageName.value, idx)
    removeParent(isImageChanging.value, idx)
  }

  const removeChild = (data, listIdx, idx) => {
    data.forEach( (file, fidx) => {
      if (file.index[0] === listIdx && file.index[1] === idx) {
        data.splice(fidx, 1)
      }
    })
  }
  const removeSecondImage = (listIdx, idx) => {
    projectInfo.value.imageList.splice(idx, 1)
    removeChild(selectImageFiles.value, listIdx, idx)
    removeChild(previewImageUrl.value, listIdx, idx)
    removeChild(previewImageName.value, listIdx, idx)
    removeChild(isImageChanging.value, listIdx, idx)
  }

  // tags
  const tempTag = ref(null)

  const addTag = () => {
    projectInfo.value.tags.push(tempTag.value)
    tempTag.value = null
  }
  
  const removeTag = idx => {
    projectInfo.value.tags.splice(idx, 1)
  }

  const backcardList = () => {
    router.push({ name: 'projectList'})
  }

  const initProjectInfo = () => {
    if (isEdit.value) {
      projects.value.data.forEach( project => {
        if (project._id == route.params.id) {
          projectInfo.value = { ...project }
        }
      })
      projectInfo.value.imageList.forEach( (list, listIdx) => {
        list.images.forEach( (image, idx) => {
          isImageChanging.value.push({
            index: [listIdx, idx],
            isChange: false
          })
        })
      })
    }
  }

  onMounted( () => {
    isLoading.value = true
    initProjectInfo()
    if (projectInfo.value.status == 'draft') {
      isDraft.value = true
    } else if (projectInfo.value.status == 'archived') {
      isArchived.value = true
    }
  })

</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backcardList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ typeWording }}專案</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="inputItem inputItem--column">
      <ul class="subImages">
        <li v-for="(imageList, listIdx) in projectInfo.imageList">
          <div class="imageList">
            <div class="imagesList__image" v-for="(image, idx) in imageList.images">
              <img
                :src="image.imageURL"
                v-if="image.imageURL && !findTarget(isImageChanging, listIdx, idx).isChange">
              <img
                :src="findTarget(previewImageUrl, listIdx, idx).url"
                v-else-if="findTarget(previewImageUrl, listIdx, idx).url && findTarget(isImageChanging, listIdx, idx).isChange">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="!findTarget(isImageChanging, listIdx, idx).isChange && !isArchived"
                @click="changeImage(listIdx, idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input
                  type="file"
                  accept=".jpg, .png"
                  name="selectImage"
                  :id="`selectImage-${listIdx + idx}`"
                  @change="onImageFileChange($event, listIdx, idx)">
                <span>{{ findTarget(previewImageName, listIdx, idx).name }}</span>
                <label :for="`selectImage-${listIdx + idx}`">選擇檔案</label>
              </div>
              <div class="deleteImage" @click="removeImage(listIdx, idx)"><span class="material-icons">close</span></div>
            </div>
          </div>
          <button v-if="imageList.images.length < 2" @click="addSecondImage(listIdx)">新增圖片</button>
        </li>
      </ul>
    </div>
    <div class="inputItem" v-if="isEdit">
      <div class="head">商品狀態</div>
      <select
        v-if="!isDraft"
        v-model="projectInfo.status"
        :disabled="isArchived">
        <option value="" disabled>請選擇專案狀態</option>
        <option value="active">上架</option>
        <option value="inactive">下架</option>
      </select>
      <select v-else disabled>
        <option>草稿</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">名稱</div>
      <input
        v-model="projectInfo.title"
        :disabled="isArchived"
        placeholder="請如入專案名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">分類</div>
      <select
        v-model="projectInfo.category"
        :disabled="isArchived">
        <option disabled selected>請選擇專案分類</option>
        <option value="Commercial Space">Commercial Space</option>
        <option value="Residence">Residence</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">作者</div>
      <input
        v-model="projectInfo.artist"
        :disabled="isArchived"
        placeholder="請輸入作者"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <textarea
        v-model="projectInfo.description.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <textarea
        v-model="projectInfo.description.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">詳細內容(英)</div>
      <textarea
        v-model="projectInfo.detail.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">詳細內容(中)</div>
      <textarea
        v-model="projectInfo.detail.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">標籤</div>
      <div class="tagListArea">
        <div class="tagList" v-if="projectInfo.tags.length > 0">
          <div class="tagItem" v-for="(tag, idx) in projectInfo.tags">
            <span>{{ tag }}</span>
            <div
              class="tagButton"
              @click="removeTag(idx)">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="addButtonArea">
          <div class="addInput">
            <input
              v-if="!isArchived"
              type="text"
              placeholder="請輸入標籤內容"
              v-model="tempTag">
            <button
              class="smallButton"
              :disabled="isArchived"
              @click="addTag()">
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="buttonArea" v-if="isEdit && !isArchived && !isDraft">
      <button @click="editProject(projectInfo, 'edit')">儲存編輯</button>
      <button v-if="!isDraft" @click="editProject(projectInfo, 'archive')">封存商品</button>
    </div>
    <div class="buttonArea" v-else-if="(!isEdit || isDraft) && !isArchived">
      <button v-if="!isEdit" @click="editProject(projectInfo, 'create')">創建草稿</button>
      <button v-else @click="editProject(projectInfo, 'save')">儲存草稿</button>
      <button @click="editProject(projectInfo, 'add')">上架商品</button>
    </div>
  </div>
</template>

<style scoped>
</style>
