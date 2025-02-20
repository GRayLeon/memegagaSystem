<script setup>
  import { useProductStore } from '@/stores/product'
  import { useCategoryStore } from '@/stores/category'
  import { useSizeStore } from '@/stores/size.js'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted, onUpdated } from 'vue';

  const productStore = useProductStore()
	const { statusList, products, editProduct, deleteProduct } = storeToRefs(productStore)

  const categoryStore = useCategoryStore()
	const { categorys, getCategorys } = storeToRefs(categoryStore)

  const sizeStore = useSizeStore()
	const { sizeDatas, getSizeDatas } = storeToRefs(sizeStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const productInfo = ref({
    name: {
      en: '',
      zh: ''
    },
    description: {
      en: '',
      zh: ''
    },
    shapes: [
      {
        title: '',
        scale: '',
        imageURL: '',
        imagePublicId: ''
      }
    ],
    tags: [],
    status: 'draft',
    parentCategory: '',
    imageURL: '',
    basePrice: 0
  })

  const basePrice = ref(0)
  
  const selectedSizes = ref([])

  const hasId = id => {
    let isHas = false
    selectedSizes.value.forEach( size => {
      if (size.sizeId == id) { isHas = true }
    })
    return isHas
  }

  const setCount = id => {
    if (selectedSizes.value.find( size => size.sizeId == id)) {
      return selectedSizes.value.find( size => size.sizeId == id).count
    }
  }

  const selectId = id => {
    if (hasId(id)) {
      selectedSizes.value = selectedSizes.value.filter( size => size.sizeId !== id)
    } else {
      selectedSizes.value.push({ sizeId: id, count: 0 })
    }
  }

  const editCount = (inputCount, id) => {
    selectedSizes.value.forEach( item => {
      if (item.sizeId == id) {
        item.count = inputCount
      }
    })
  }

  const initProductInfo = () => {
    if (isEdit.value) {
      products.value.data.forEach(product => {
        if (product._id == route.params.id) {
          productInfo.value = { ...product }
          selectedSizes.value = [...productInfo.value.sizes]
          basePrice.value = product.basePrice
        }
      })
    }
    checkShape()
  }

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isDraft = ref(false)
  const isArchived = ref(false)

  const typeWording = computed( () => {
    return isEdit.value? '編輯' : '新增'
  })

  const selectFile = ref(null)
  const previewUrl = ref(null)
  const previewName = ref('請選擇圖片檔案')

  const isChanging = ref(false)
  const changeImage = () => {
    isChanging.value = true
  }

  const onFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      selectFile.value = file
      previewUrl.value = URL.createObjectURL(file)
      previewName.value = file.name
    } else {
      previewUrl.value = null
      previewName.value = '請選擇圖片檔案'
    }
  }

  const sumPrice = computed( () => {
    let prices = {}
    selectedSizes.value.forEach( selectSize => {
      let scale = sizeDatas.value.find(size => size._id == selectSize.sizeId).scale
      let count = selectSize.count
      prices[selectSize.sizeId] = productInfo.value.basePrice * scale - count
    })
    return prices
  })

  // shapes
  const selectShapeFiles = ref([])
  const previewShapeUrl = ref([])
  const previewShapeName = ref(['請選擇圖片檔案'])
  const updateShapeFile = ref([])

  const isShapeChanging = ref([false])
  const changeShapeImage = idx => {
    isShapeChanging.value[idx] = true
  }

  const onShapeFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_${file.name}`, { type: file.type })
      selectShapeFiles.value[idx] = newFile
      previewShapeUrl.value[idx] = URL.createObjectURL(file)
      previewShapeName.value[idx] = file.name
      updateShapeFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewShapeUrl.value[idx] = null
      previewShapeName.value[idx] = '請選擇圖片檔案'
      updateShapeFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateShapeFile.value.splice(findx, 1)
        }
      })
    }
  }

  const backcardList = () => {
    router.push({ name: 'productList'})
  }

  const checkButton = (method, idx, length) => {
    let show = false
    if (method == 'add' && idx == length - 1) { show = true }
    if (method == 'remove' && length !== 0 && idx < length - 1 ) { show = true }
    return show
  }

  const addShape = () => {
    productInfo.value.shapes.push({
        title: '',
        scale: '',
        imageURL: '',
        imagePublicId: ''
      })
  }

  const removeShape = idx => {
    productInfo.value.shapes.splice(idx, 1)
  }

  const checkShape = () => {
    if (productInfo.value.shapes.length == 0) {
      addShape()
    }
  }

  const tempTag = ref(null)

  const addTag = () => {
    productInfo.value.tags.push(tempTag.value)
    tempTag.value = null
  }
  
  const removeTag = idx => {
    productInfo.value.tags.splice(idx, 1)
  }

  onMounted( async () => {
    isLoading.value = true
    await getCategorys.value()
    await getSizeDatas.value()
    initProductInfo()
    if (!isEdit.value) {
      isChanging.value = true
    }
    if (productInfo.value.status == 'draft') {
      isDraft.value = true
    } else if (productInfo.value.status == 'archived') {
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
      <h1>{{ typeWording }}產品</h1>
    </div>
  </div>
  <div class="editArea">
    <img
      :src="productInfo.imageURL"
      v-if="productInfo.imageURL && !isChanging">
    <img
      :src="previewUrl"
      v-else-if="previewUrl && isChanging">
    <div class="noImage" v-else><span>沒有圖片</span></div>
    <button
      v-if="!isChanging && !isArchived"
      @click="changeImage">
      更改圖片
    </button>
    <div v-else-if="!isArchived" class="imageSelect">
      <input type="file" accept=".jpg, .png" name="selectImage" id="selectImage" @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div>
    <div class="inputItem" v-if="isEdit">
      <div class="head">商品狀態</div>
      <select
        v-if="!isDraft"
        v-model="productInfo.status"
        :disabled="isArchived">
        <option value="" disabled>請選擇商品狀態</option>
        <option value="active">上架</option>
        <option value="inactive">下架</option>
      </select>
      <select v-else disabled>
        <option>草稿</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">分類</div>
      <select
        v-model="productInfo.parentCategory"
        :disabled="isArchived">
        <option value="" disabled>請選擇分類</option>
        <option
          :value="category._id"
          :disabled="!category.active"
          v-for="category in categorys">
          {{ category.name['zh'] }}&emsp;/&emsp;{{ category.name['en'] }}
        </option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">名稱(英)</div>
      <input
        v-model="productInfo.name.en"
        :disabled="isArchived"
        placeholder="請如入英文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">名稱(中)</div>
      <input
        v-model="productInfo.name.zh"
        :disabled="isArchived"
        placeholder="請輸入中文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <input
        v-model="productInfo.description.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <input
        v-model="productInfo.description.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">基本價格</div>
      <input
        v-model="productInfo.basePrice"
        :disabled="isArchived"
        placeholder="請輸入基本價格"
        type="number"/>
    </div>
    <div class="inputItem">
      <div class="head">尺寸</div>
      <div class="sizeList">
        <div
          class="sizeinputItem"
          v-for="size in sizeDatas.filter(sizeData => sizeData.active)">
          <input
            type="checkbox"
            :value="size._id"
            :id="size._id"
            :checked="hasId(size._id)"
            :disabled="isArchived"
            @change="selectId(size._id)">
          <label :for="size._id">
            {{ size.size }}
          </label>
          <div class="countArea" v-if="hasId(size._id)">
            <div class="subHead">折價</div>
            <input
              @change="editCount($event.target.value, size._id)"
              :value="setCount(size._id)"
              :disabled="isArchived"
              placeholder="請輸入折價"
              min="0"
              type="number" />
            <div class="subHead">單價</div>
            <div class="sumPrice">
              {{ sumPrice[size._id] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="inputItem">
      <div class="head">面狀</div>
      <div class="shapeList">
        <div
          class="shapeInputArea"
          v-for="(shape, idx) in productInfo.shapes">
          <div class="shapeInputItem">
            <div class="imgArea">
              <img
                :src="shape.imageURL"
                v-if="shape.imageURL && !isShapeChanging[idx]">
              <img
                :src="previewShapeUrl[idx]"
                v-else-if="previewShapeUrl[idx] && isShapeChanging[idx]">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="!isShapeChanging[idx] && !isArchived"
                @click="changeShapeImage(idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input type="file" accept=".jpg, .png" name="selectImage" :id="`selectImage-${idx}`" @change="onShapeFileChange($event, idx)">
                <span>{{ previewShapeName[idx] }}</span>
                <label :for="`selectImage-${idx}`">選擇檔案</label>
              </div>
            </div>
          </div>
          <div class="shapeInputItem">
            <div class="subHead">規格</div>
            <input
              type="text"
              v-model="shape.title"
              placeholder="請輸入面狀規格" />
          </div>
          <div class="shapeInputItem">
            <div class="subHead">倍率</div>
            <input
              type="number"
              v-model="shape.scale"
              placeholder="請輸入面狀倍率" />
          </div>
          <div class="shapeInputOption">
            <div
              class="shapeButton"
              v-if="productInfo.shapes.length > 1"
              @click="removeShape(idx)">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="addButtonArea">
          <button
            class="smallButton"
            @click="addShape()">
            新增
          </button>
        </div>
      </div>
    </div>
    <div class="inputItem">
      <div class="head">標籤</div>
      <div class="tagListArea">
        <div class="tagList" v-if="productInfo.tags.length > 0">
          <div class="tagItem" v-for="(tag, idx) in productInfo.tags">
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
              type="text"
              placeholder="請輸入標籤內容"
              v-model="tempTag">
            <button
              class="smallButton"
              @click="addTag()">
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="buttonArea" v-if="isEdit && !isArchived && !isDraft">
      <button @click="editProduct(productInfo, selectedSizes, 'edit', selectFile, selectShapeFiles, updateShapeFile)">儲存編輯</button>
      <button v-if="!isDraft" @click="editProduct(productInfo, selectedSizes, 'archive', selectFile, selectShapeFiles, updateShapeFile)">封存商品</button>
    </div>
    <div class="buttonArea" v-else-if="(!isEdit || isDraft) && !isArchived">
      <button v-if="!isEdit" @click="editProduct(productInfo, selectedSizes, 'create', selectFile, selectShapeFiles, updateShapeFile)">創建草稿</button>
      <button v-else @click="editProduct(productInfo, selectedSizes, 'save', selectFile, selectShapeFiles, updateShapeFile)">儲存草稿</button>
      <button @click="editProduct(productInfo, selectedSizes, 'add', selectFile, selectShapeFiles, updateShapeFile)">上架商品</button>
    </div>
  </div>
</template>

<style scoped>
</style>
