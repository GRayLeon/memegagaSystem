<script setup>
  import { RouterLink } from 'vue-router'
  import { useProductStore } from '@/stores/product'
  import { useCategoryStore } from '@/stores/category'
	import { storeToRefs } from 'pinia'
  import { watch, onMounted } from 'vue'

  const productStore = useProductStore()
	const { statusList, page, pageSize, category, status, sort, order, products, getProducts, goToAddProduct } = storeToRefs(productStore)

  const categoryStore = useCategoryStore()
	const { categorys, getCategorys } = storeToRefs(categoryStore)

  const categoryWording = categoryId => {
    return categorys.value.find( category => category._id == categoryId ).name['zh']
  }

  const statusWording = statusValue => {
    return statusList.value.find( status => status.value == statusValue ).label
  }

  const changePageTo = idx => {
    page.value = idx
  }

  watch(status, nVal => {
    getProducts.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  watch(category, nVal => {
    getProducts.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  watch(sort, nVal => {
    getProducts.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  watch(page, nVal => {
    getProducts.value(page.value, pageSize.value, status.value, category.value, sort.value, order.value)
  })

  onMounted( async () => {
    await getCategorys.value()
  })
</script>

<template>
  <div class="title">
    <h1>產品管理</h1>
    <button @click="goToAddProduct">新增產品</button>
  </div>
  <div class="filterArea">
    <div class="inputItem">
      <div class="head">分類</div>
      <select v-model="category">
        <option value="">全部分類</option>
        <option
          :value="category._id"
          v-for="category in categorys">
          {{ category.name['zh'] }}&emsp;/&emsp;{{ category.name['en'] }}{{ category.active ? '' : '&emsp;(停用)' }}
        </option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="status">
        <option value="">全部狀態</option>
        <option
          :value="status.value"
          v-for="status in statusList">
          {{ status.label }}
        </option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">排序</div>
      <select v-model="sort">
        <option value="_id">上架時間</option>
        <option value="name">名稱</option>
        <option value="parentCategory">分類</option>
        <option value="basePrice">價錢</option>
      </select>
    </div>
  </div>
  <ul v-if="products.data.length" class="cardList">
    <li>
      <div class="cardList__card cardList__card--head">
        <div class="img">圖片</div>
        <div class="name">名稱</div>
        <div class="status">狀態</div>
        <div class="category">分類</div>
        <div class="description">描述</div>
        <div class="price">價錢</div>
      </div>
    </li>
    <li v-for="product in products.data">
      <RouterLink :to="`product/${product._id}`">
        <div class="cardList__card">
          <img :src="product.imageURL">
          <div class="name">{{ product.name['zh'] }}</div>
          <div class="status">
            <span :class="product.status">{{ statusWording(product.status) }}</span>
          </div>
          <div class="category">
            {{ categoryWording(product.parentCategory) }}
          </div>
          <div class="description">{{  product.description['zh'] }}</div>
          <div class="price">{{  product.basePrice }}<span>NTD</span></div>
        </div>
      </RouterLink>
    </li>
  </ul>
  <div v-else class="empty">
    沒有符合此條件的產品。
  </div>
  <ul v-if="products.pagination.totalPages > 1" class="pageList">
    <li
      v-for="idx in products.pagination.totalPages"
      @click="changePageTo(idx)"
      :class="{ 'active': idx == page}">
      {{ idx }}
    </li>
  </ul>
</template>

<style scoped>
</style>
