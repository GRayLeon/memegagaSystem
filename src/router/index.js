import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import { useAuthStore } from '@/stores/auth'
import { useLoadStore } from '@/stores/load'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name:  '',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../components/HomeView.vue'),
        },
        {
          path: 'editor',
          name: 'editor',
          component: () => import('../components/EditorView.vue'),
        },
        {
          path: 'product',
          name: 'product',
          component: () => import('../components/ProductView.vue'),
          children: [
            {
              path: '',
              name: 'productList',
              component: () => import('../components/product/ProductList.vue')
            },
            {
              path: 'add',
              name: 'productAdd',
              component: () => import('../components/product/ProductEdit.vue')
            },
            {
              path: ':id',
              name: 'productEdit',
              component: () => import('../components/product/ProductEdit.vue')
            }
          ]
        },
        {
          path: 'size',
          name: 'size',
          component: () => import('../components/SizeView.vue'),
          children: [
            {
              path: '',
              name: 'sizeList',
              component: () => import('../components/size/SizeList.vue')
            },
            {
              path: 'add',
              name: 'sizeAdd',
              component: () => import('../components/size/SizeEdit.vue')
            },
            {
              path: ':id',
              name: 'sizeEdit',
              component: () => import('../components/size/SizeEdit.vue')
            }
          ]
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('../components/CategoryView.vue'),
          children: [
            {
              path: '',
              name: 'categoryList',
              component: () => import('../components/category/CategoryList.vue')
            },
            {
              path: 'add',
              name: 'categoryAdd',
              component: () => import('../components/category/CategoryEdit.vue')
            },
            {
              path: ':id',
              name: 'categoryEdit',
              component: () => import('../components/category/CategoryEdit.vue')
            }
          ]
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('../components/AccountView.vue'),
          children: [
            {
              path: '',
              name: 'accountList',
              component: () => import('../components/account/AccountList.vue')
            },
            {
              path: 'add',
              name: 'accountAdd',
              component: () => import('../components/account/AccountAdd.vue')
            },
            {
              path: ':type/:id',
              name: 'accountEdit',
              component: () => import('../components/account/AccountEdit.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name:  'login',
      component: () => import('../components/LoginView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound
    }
  ]
})

router.beforeEach( async (to, from, next) => {
  const authStore = useAuthStore()
	const { isLogin, checkLogin, getProfile } = storeToRefs(authStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

    isLoading.value = true
    await checkLogin.value()
    if (isLogin.value) {
      await getProfile.value()
      next()
    } else {
      if (to.name === 'login') {
        next()
      } else {
        next('/login')
      }
    }
})

export default router
