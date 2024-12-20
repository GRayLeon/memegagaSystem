import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import { useAuthStore } from '@/stores/auth'
import { useLoadStore } from '@/stores/load'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name:  'admin',
      component: AdminView,
      children: [
        {
          path: '',
          name: 'adminHome',
          component: () => import('../components/admin/AdminHomeView.vue'),
        },
        {
          path: 'editor',
          name: 'adminEditor',
          component: () => import('../components/admin/AdminEditorView.vue'),
        },
        {
          path: 'product',
          name: 'adminProduct',
          component: () => import('../components/admin/AdminProductView.vue'),
          children: [
            {
              path: '',
              name: 'adminProductList',
              component: () => import('../components/admin/product/ProductList.vue')
            },
            {
              path: 'add',
              name: 'adminProductAdd',
              component: () => import('../components/admin/product/ProductEdit.vue')
            },
            {
              path: ':id',
              name: 'adminProductEdit',
              component: () => import('../components/admin/product/ProductEdit.vue')
            }
          ]
        },
        {
          path: 'size',
          name: 'adminSize',
          component: () => import('../components/admin/AdminSizeView.vue'),
          children: [
            {
              path: '',
              name: 'adminSizeList',
              component: () => import('../components/admin/size/SizeList.vue')
            },
            {
              path: 'add',
              name: 'adminSizeAdd',
              component: () => import('../components/admin/size/SizeEdit.vue')
            },
            {
              path: ':id',
              name: 'adminSizeEdit',
              component: () => import('../components/admin/size/SizeEdit.vue')
            }
          ]
        },
        {
          path: 'category',
          name: 'adminCategory',
          component: () => import('../components/admin/AdminCategoryView.vue'),
          children: [
            {
              path: '',
              name: 'adminCategoryList',
              component: () => import('../components/admin/category/CategoryList.vue')
            },
            {
              path: 'add',
              name: 'adminCategoryAdd',
              component: () => import('../components/admin/category/CategoryEdit.vue')
            },
            {
              path: ':id',
              name: 'adminCategoryEdit',
              component: () => import('../components/admin/category/CategoryEdit.vue')
            }
          ]
        },
        {
          path: 'account',
          name: 'adminAccount',
          component: () => import('../components/admin/AdminAccountView.vue'),
          children: [
            {
              path: '',
              name: 'adminAccountList',
              component: () => import('../components/admin/account/AccountList.vue')
            },
            {
              path: 'add',
              name: 'adminAccountAdd',
              component: () => import('../components/admin/account/AccountAdd.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/admin/login',
      name:  'adminLogin',
      component: () => import('../components/admin/AdminLoginView.vue')
    }
  ]
})

router.beforeEach( async (to, from, next) => {
  const authStore = useAuthStore()
	const { isLogin, checkLogin, getProfile } = storeToRefs(authStore)

  const loadStore = useLoadStore()
	const { isAdminLoading } = storeToRefs(loadStore)

  checkLogin.value()
  if (to.name && to.name.startsWith('admin')) {
    isAdminLoading.value = true
    if (isLogin.value) {
      await getProfile.value()
      next()
    } else {
      if (to.name === 'adminLogin') {
        next()
      } else {
        next('/admin/login')
      }
    }
  } else {
    next()
  }
})

export default router
