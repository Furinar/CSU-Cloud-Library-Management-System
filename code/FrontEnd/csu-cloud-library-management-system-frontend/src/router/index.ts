import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/Login.vue'),
          meta: { guest: true }
        },
        {
          path: 'forgot',
          name: 'Forgot',
          component: () => import('@/views/auth/Forgot.vue'),
          meta: { guest: true, title: '找回密码' }
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/auth/Register.vue'),
          meta: { guest: true }
        }
      ]
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页概览' }
        },
        {
          path: 'books/search',
          name: 'BookSearch',
          component: () => import('@/views/books/BookList.vue'),
          meta: { title: '图书查询' }
        },
        {
          path: 'books/recommend',
          name: 'BookRecommend',
          component: () => import('@/views/books/Recommend.vue'),
          meta: { title: '新书推荐' }
        },
        {
          path: 'books/detail/:id',
          name: 'BookDetail',
          component: () => import('@/views/books/BookDetail.vue'),
          meta: { title: '图书详情' }
        },
        {
          path: 'borrowing/current',
          name: 'BorrowCurrent',
          component: () => import('@/views/borrowing/MyBorrow.vue'),
          meta: { title: '我的借阅' }
        },
        {
          path: 'borrowing/history',
          name: 'BorrowHistory',
          component: () => import('@/views/borrowing/MyBorrow.vue'),
          meta: { title: '借阅历史' }
        },
        {
          path: 'user/profile',
          name: 'UserProfile',
          component: () => import('@/views/user/Profile.vue'),
          meta: { title: '个人信息' }
        },
        {
          path: 'user/messages',
          name: 'UserMessages',
          component: () => import('@/views/user/messages/index.vue'),
          meta: { title: '消息通知' }
        },
        // // Admin Routes
        // {
        //   path: 'system/users',
        //   name: 'SystemUsers',
        //   component: () => import('@/views/system/UserList.vue'),
        //   meta: { roles: ['admin'], title: '用户管理' }
        // },
        {
          path: 'system/notification',
          name: 'SystemNotification',
          component: () => import('@/views/system/Notification.vue'),
          meta: { roles: ['admin'], title: '消息推送' }
        },
        {
          path: 'system/logs',
          name: 'SystemLogs',
          component: () => import('@/views/system/logs/index.vue'),
          meta: { roles: ['admin'], title: '操作日志' }
        },
        {
          path: 'statistics',
          name: 'Statistics',
          component: () => import('@/views/statistics/index.vue'),
          meta: { roles: ['admin'], title: '数据统计' }
        },
        {
          path: 'admin/books/add',
          name: 'AddBook',
          component: () => import('@/views/books/BookForm.vue'),
          meta: { roles: ['admin'], title: '新增图书' }
        },
        {
          path: 'admin/books/list',
          name: 'AdminBookList',
          component: () => import('@/views/books/BookList.vue'), 
          meta: { roles: ['admin'], title: '图书编目' }
        },
        {
          path: 'admin/books/delete',
          name: 'AdminBookDelete',
          component: () => import('@/views/books/BookDelete.vue'),
          meta: { roles: ['admin'], title: '删除图书' }
        },
        {
          path: 'admin/borrowing/return',
          name: 'AdminReturn',
          component: () => import('@/views/borrowing/AdminReturn.vue'),
          meta: { roles: ['admin'], title: '归还确认' }
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  
  const token = authStore.token || localStorage.getItem('token')
  const isAuthenticated = !!token
  const userRole = authStore.user?.role

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth/login')
  } else if (to.meta.guest && isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.roles && Array.isArray(to.meta.roles) && userRole) {
    const currentRole = userRole.toLowerCase();
    if (!to.meta.roles.includes(currentRole)) {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    next()
  }
})

export default router
