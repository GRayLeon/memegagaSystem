<script setup>
  import { useProductStore } from '@/stores/product'
  import { useSpecStore } from '@/stores/spec'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue';

  const productStore = useProductStore()
	const { 
    products, selectSizes, selectFile,
    selectSubImageFiles, updateSubImageFile,
    selectShapeImageFiles, updateShapeImageFile,
    selectColorImageFiles, updateColorImageFile,
    editProduct
  } = storeToRefs(productStore)

  const specStore = useSpecStore()
	const { getSpecDatas, specDatas, isGetSpecs } = storeToRefs(specStore)

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
    subImages: [],
    shapes: [],
    colors: [],
    tags: [],
    origin: {},
    appearance: {},
    functionality: {},
    support: {},
    brand: {},
    status: 'draft',
    imageURL: '',
    basePrice: 0
  })

  const basePrice = ref(0)

  const sumPrice = computed( () => {
    let prices = {}
    selectSizes.value.forEach( selectSize => {
      let scale = sizeDatas.value.find(size => size._id == selectSize.sizeId).scale
      let count = selectSize.count
      prices[selectSize.sizeId] = productInfo.value.basePrice * scale - count
    })
    return prices
  })

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isDraft = ref(false)
  const isArchived = ref(false)

  const typeWording = computed( () => {
    return isEdit.value? '編輯' : '新增'
  })

  const isReady = computed( () => {
    let ready = true
    if( !productInfo.value.name.en ) { ready = false}
    if( !productInfo.value.name.zh ) { ready = false}
    if( !productInfo.value.description.en ) { ready = false}
    if( !productInfo.value.description.zh ) { ready = false}
    if( !productInfo.value.subImages ) { ready = false}
    if( !productInfo.value.shapes ) { ready = false}
    if( !productInfo.value.colors ) { ready = false}
    if( !productInfo.value.tags ) { ready = false}
    if( !productInfo.value.origin ) { ready = false}
    if( !productInfo.value.appearance ) { ready = false}
    if( !productInfo.value.functionality ) { ready = false}
    if( !productInfo.value.support ) { ready = false}
    if( !productInfo.value.brand ) { ready = false}
    if( !productInfo.value.status ) { ready = false}
    if( !productInfo.value.imageURL ) { ready = false}
    
    if( productInfo.value.name.en == '' ) { ready = false}
    if( productInfo.value.name.zh == '' ) { ready = false}
    if( productInfo.value.description.en == '' ) { ready = false}
    if( productInfo.value.description.zh == '' ) { ready = false}
    if( productInfo.value.subImages == [] ) { ready = false}
    if( productInfo.value.shapes == [] ) { ready = false}
    if( productInfo.value.colors == [] ) { ready = false}
    if( productInfo.value.tags == [] ) { ready = false}
    if( productInfo.value.origin == {} ) { ready = false}
    if( productInfo.value.appearance == {} ) { ready = false}
    if( productInfo.value.functionality == {} ) { ready = false}
    if( productInfo.value.support == {} ) { ready = false}
    if( productInfo.value.brand == {} ) { ready = false}
    if( productInfo.value.status == '' ) { ready = false}
    if( productInfo.value.imageURL == '' ) { ready = false}
    return ready
  })

  // mainImages
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

  // sizes

  const hasId = id => {
    let isHas = false
    selectSizes.value.forEach( size => {
      if (size.sizeId == id) { isHas = true }
    })
    return isHas
  }

  const setCount = id => {
    if (selectSizes.value.find( size => size.sizeId == id)) {
      return selectSizes.value.find( size => size.sizeId == id).count
    }
  }

  const selectId = id => {
    if (hasId(id)) {
      selectSizes.value = selectSizes.value.filter( size => size.sizeId !== id)
    } else {
      selectSizes.value.push({ sizeId: id, count: 0 })
    }
  }

  const editCount = (inputCount, id) => {
    selectSizes.value.forEach( item => {
      if (item.sizeId == id) {
        item.count = inputCount
      }
    })
  }

  // subImages
  const previewSubImageUrl = ref([])
  const previewSubImageName = ref(['請選擇圖片檔案'])

  const isSubImageChanging = ref([])
  const changeSubImage = idx => {
    isSubImageChanging.value[idx] = true
  }

  const onSubImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_${file.name}`, { type: file.type })
      selectSubImageFiles.value[idx] = newFile
      previewSubImageUrl.value[idx] = URL.createObjectURL(file)
      previewSubImageName.value[idx] = file.name
      updateSubImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewSubImageUrl.value[idx] = null
      previewSubImageName.value[idx] = '請選擇圖片檔案'
      updateSubImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateSubImageFile.value.splice(findx, 1)
        }
      })
    }
  }
  
  const addSubImage = () => {
    productInfo.value.subImages.push({
      imageURL: '',
      imagePublicId: ''
    })
    isSubImageChanging.value.push(true)
  }

  const removeSubImage = idx => {
    productInfo.value.subImages.splice(idx, 1)
    selectSubImageFiles.value.splice(idx, 1)
    previewSubImageUrl.value.splice(idx, 1)
    previewSubImageName.value.splice(idx, 1)
    isSubImageChanging.value.splice(idx, 1)
  }

  // shapes
  const previewShapeImageUrl = ref([])
  const previewShapeImageName = ref(['請選擇圖片檔案'])

  const isShapeImageChanging = ref([])
  const changeShapeImage = idx => {
    isShapeImageChanging.value[idx] = true
  }

  const onShapeImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_${file.name}`, { type: file.type })
      selectShapeImageFiles.value[idx] = newFile
      previewShapeImageUrl.value[idx] = URL.createObjectURL(file)
      previewShapeImageName.value[idx] = file.name
      updateShapeImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewShapeImageUrl.value[idx] = null
      previewShapeImageName.value[idx] = '請選擇圖片檔案'
      updateShapeImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateShapeImageFile.value.splice(findx, 1)
        }
      })
    }
  }

  const addShape = () => {
    productInfo.value.shapes.push({
      title: '',
      scale: '',
      imageURL: '',
      imagePublicId: ''
    })
    isShapeImageChanging.value.push(true)
  }

  const removeShape = idx => {
    productInfo.value.shapes.splice(idx, 1)
    selectShapeImageFiles.value.splice(idx, 1)
    previewShapeImageUrl.value.splice(idx, 1)
    previewShapeImageName.value.splice(idx, 1)
    isShapeImageChanging.value.splice(idx, 1)
  }

  // colors
  const previewColorImageUrl = ref([])
  const previewColorImageName = ref(['請選擇圖片檔案'])

  const isColorImageChanging = ref([])
  const changeColorImage = idx => {
    isColorImageChanging.value[idx] = true
  }

  const onColorImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_${file.name}`, { type: file.type })
      selectColorImageFiles.value[idx] = newFile
      previewColorImageUrl.value[idx] = URL.createObjectURL(file)
      previewColorImageName.value[idx] = file.name
      updateColorImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewColorImageUrl.value[idx] = null
      previewColorImageName.value[idx] = '請選擇圖片檔案'
      updateColorImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateColorImageFile.value.splice(findx, 1)
        }
      })
    }
  }
  
  const addColor = () => {
    productInfo.value.colors.push({
      title: '',
      imageURL: '',
      imagePublicId: ''
    })
    isColorImageChanging.value.push(true)
  }

  const removeColor = idx => {
    productInfo.value.colors.splice(idx, 1)
    selectColorImageFiles.value.splice(idx, 1)
    previewColorImageUrl.value.splice(idx, 1)
    previewColorImageName.value.splice(idx, 1)
    isColorImageChanging.value.splice(idx, 1)
  }

  // tags
  const tempTag = ref(null)

  const addTag = () => {
    productInfo.value.tags.push(tempTag.value)
    tempTag.value = null
  }
  
  const removeTag = idx => {
    productInfo.value.tags.splice(idx, 1)
  }

  const backcardList = () => {
    router.push({ name: 'productList'})
  }

  const initProductInfo = () => {
    if (isEdit.value) {
      products.value.data.forEach(product => {
        if (product._id == route.params.id) {
          productInfo.value = { ...product }
          selectSizes.value = [...productInfo.value.sizes]
          basePrice.value = product.basePrice
        }
      })
      productInfo.value.subImages.forEach( subImage => {
        isSubImageChanging.value.push(false)
      })
      productInfo.value.shapes.forEach( shape => {
        isShapeImageChanging.value.push(false)
      })
      productInfo.value.colors.forEach( color => {
        isColorImageChanging.value.push(false)
      })
    }
  }

  onMounted( async () => {
    isLoading.value = true
    await getSpecDatas.value()
    initProductInfo()
    if (!isEdit.value) {
      isChanging.value = true
    }
    if (productInfo.value.status == 'draft') {
      isDraft.value = true
    } else if (productInfo.value.status == 'archived') {
      isArchived.value = true
    }
    updateSubImageFile.value = []
    updateShapeImageFile.value = []
    updateColorImageFile.value = []
    selectSubImageFiles.value = []
    selectShapeImageFiles.value = []
    selectColorImageFiles.value = []
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
      <input
        type="file"
        accept=".jpg, .png"
        name="selectImage"
        id="selectImage"
        @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div>
    <div class="inputItem inputItem--column">
      <ul class="subImages">
        <li v-for="(subImage, idx) in productInfo.subImages">
          <img
            :src="subImage.imageURL"
            v-if="subImage.imageURL && !isSubImageChanging[idx]">
          <img
            :src="previewSubImageUrl[idx]"
            v-else-if="previewSubImageUrl[idx] && isSubImageChanging[idx]">
          <div class="noImage" v-else><span>沒有圖片</span></div>
          <button
            v-if="!isSubImageChanging[idx] && !isArchived"
            @click="changeSubImage(idx)">
            更改圖片
          </button>
          <div v-else-if="!isArchived" class="imageSelect">
            <input
              type="file"
              accept=".jpg, .png"
              name="selectImage"
              :id="`selectSubImage-${idx}`"
              @change="onSubImageFileChange($event, idx)">
            <span>{{ previewSubImageName[idx] }}</span>
            <label :for="`selectSubImage-${idx}`">選擇檔案</label>
          </div>
          <div class="deleteImage" @click="removeSubImage(idx)"><span class="material-icons">close</span></div>
        </li>
      </ul>
      <button @click="addSubImage()">新增圖片</button>
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
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">產地</div>
      <select
        v-model="productInfo.origin"
        :disabled="isArchived">
        <option value="" disabled>請選擇產地</option>
        <option
          :value="origin"
          v-for="origin in specDatas.origin.list">
          {{ origin['zh'] }}&emsp;/&emsp;{{ origin['en'] }}
        </option>
      </select>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">外觀</div>
      <select
        v-model="productInfo.appearance"
        :disabled="isArchived">
        <option value="" disabled>請選擇外觀</option>
        <option
          :value="appearance"
          v-for="appearance in specDatas.appearance.list">
          {{ appearance['zh'] }}&emsp;/&emsp;{{ appearance['en'] }}
        </option>
      </select>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">功能</div>
      <select
        v-model="productInfo.functionality"
        :disabled="isArchived">
        <option value="" disabled>請選擇功能</option>
        <option
          :value="functionality"
          v-for="functionality in specDatas.functionality.list">
          {{ functionality['zh'] }}&emsp;/&emsp;{{ functionality['en'] }}
        </option>
      </select>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">配套</div>
      <select
        v-model="productInfo.support"
        :disabled="isArchived">
        <option value="" disabled>請選擇配套</option>
        <option
          :value="support"
          v-for="support in specDatas.support.list">
          {{ support['zh'] }}&emsp;/&emsp;{{ support['en'] }}
        </option>
      </select>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">品牌</div>
      <select
        v-model="productInfo.brand"
        :disabled="isArchived">
        <option value="" disabled>請選擇品牌</option>
        <option
          :value="brand.name"
          v-for="brand in specDatas.brands.list">
          {{ brand.name }}
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
      <div class="head">型號</div>
      <input
        v-model="productInfo.model"
        :disabled="isArchived"
        placeholder="請如入型號"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">尺寸</div>
      <input
        v-model="productInfo.dimension"
        :disabled="isArchived"
        placeholder="請輸入尺寸"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">防滑度</div>
      <input
        v-model="productInfo.slipResistance"
        :disabled="isArchived"
        placeholder="請輸入防滑度"
        type="number"/>
    </div>
    <div class="inputItem">
      <div class="head">應用</div>
      <select
        v-model="productInfo.application"
        :disabled="isArchived">
        <option value="" disabled selected>請選擇應用場所</option>
        <option value="exterior">室外</option>
        <option value="interior">室內</option>
      </select>
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
    <!-- <div class="inputItem">
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
    </div> -->
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
                v-if="shape.imageURL && !isShapeImageChanging[idx]">
              <img
                :src="previewShapeImageUrl[idx]"
                v-else-if="previewShapeImageUrl[idx] && isShapeImageChanging[idx]">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="!isShapeImageChanging[idx] && !isArchived"
                @click="changeShapeImage(idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input
                  type="file"
                  accept=".jpg, .png" name="selectImage" :id="`selectShapeImage-${idx}`"
                  :disabled="isArchived"
                  @change="onShapeImageFileChange($event, idx)">
                <span>{{ previewShapeImageName[idx] }}</span>
                <label :for="`selectShapeImage-${idx}`">選擇檔案</label>
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
            :disabled="isArchived"
            @click="addShape()">
            新增
          </button>
        </div>
      </div>
    </div>
    <div class="inputItem">
      <div class="head">顏色</div>
      <div class="shapeList">
        <div
          class="shapeInputArea"
          v-for="(color, idx) in productInfo.colors">
          <div class="shapeInputItem">
            <div class="imgArea">
              <img
                :src="color.imageURL"
                v-if="color.imageURL && !isColorImageChanging[idx]">
              <img
                :src="previewColorImageUrl[idx]"
                v-else-if="previewColorImageUrl[idx] && isColorImageChanging[idx]">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="!isColorImageChanging[idx] && !isArchived"
                @click="changeColorImage(idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input
                  type="file"
                  accept=".jpg, .png" name="selectImage" :id="`selectColorImage-${idx}`"
                  :disabled="isArchived"
                  @change="onColorImageFileChange($event, idx)">
                <span>{{ previewColorImageName[idx] }}</span>
                <label :for="`selectColorImage-${idx}`">選擇檔案</label>
              </div>
            </div>
          </div>
          <div class="shapeInputItem">
            <div class="subHead">編號</div>
            <input
              type="text"
              v-model="color.title"
              placeholder="請輸入顏色編號" />
          </div>
          <div class="shapeInputOption">
            <div
              class="shapeButton"
              v-if="productInfo.colors.length > 1"
              @click="removeColor(idx)">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="addButtonArea">
          <button
            class="smallButton"
            :disabled="isArchived"
            @click="addColor()">
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
      <button 
        :disabled="!isReady"
        @click="editProduct(productInfo, 'edit', selecteFile)">儲存編輯</button>
      <button 
        :disabled="!isReady"
        v-if="!isDraft"
        @click="editProduct(productInfo, 'archive', selecteFile)">封存商品</button>
    </div>
    <div class="buttonArea" v-else-if="(!isEdit || isDraft) && !isArchived">
      <button 
        :disabled="!isReady"
        v-if="!isEdit"
        @click="editProduct(productInfo, 'create', selecteFile)">創建草稿</button>
      <button 
        :disabled="!isReady"
        v-else
        @click="editProduct(productInfo, 'save', selecteFile)">儲存草稿</button>
      <button 
        :disabled="!isReady"
        @click="editProduct(productInfo, 'add', selecteFile)">上架商品</button>
    </div>
  </div>
</template>

<style scoped>
</style>
