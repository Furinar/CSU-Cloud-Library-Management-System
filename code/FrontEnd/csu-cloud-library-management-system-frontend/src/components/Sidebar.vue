<template>
  <el-aside width="240px" class="sidebar" :class="{ 'is-admin': isAdmin }">
    <div class="logo-container">
      <img src="@/assets/csu.png" alt="Logo" class="logo" />
      <div class="title-wrapper">
        <span class="title">{{ isAdmin ? '后台管理' : '中南云图书' }}</span>
        <span class="subtitle">Cloud Library</span>
      </div>
    </div>

    <el-menu :default-active="activeMenu" class="el-menu-vertical" router :collapse="isCollapse"
      background-color="#ffffff" text-color="#606266" active-text-color="#165C91">
      <el-menu-item index="/dashboard">
        <el-icon>
          <Odometer />
        </el-icon>
        <span>首页概览</span>
      </el-menu-item>

      <template v-if="!isAdmin">
        <div class="menu-group-title">资源服务</div>

        <el-sub-menu index="/books">
          <template #title>
            <el-icon>
              <Reading />
            </el-icon>
            <span>图书资源</span>
          </template>
          <el-menu-item index="/books/search">图书查询</el-menu-item>
          <el-menu-item index="/books/recommend">新书推荐</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/borrowing">
          <template #title>
            <el-icon>
              <Notebook />
            </el-icon>
            <span>我的借阅</span>
          </template>
          <el-menu-item index="/borrowing/current">当前借阅</el-menu-item>
          <el-menu-item index="/borrowing/history">借阅历史</el-menu-item>
        </el-sub-menu>
      </template>

      <div class="menu-group-title">个人中心</div>

      <el-sub-menu index="/user">
        <template #title>
          <el-icon>
            <User />
          </el-icon>
          <span>账户管理</span>
        </template>
        <el-menu-item index="/user/profile">个人信息</el-menu-item>
        <el-menu-item index="/user/messages">消息通知</el-menu-item>
      </el-sub-menu>

      <!-- Admin Only -->
      <template v-if="isAdmin">
        <div class="menu-group-title">系统管理</div>

        <el-sub-menu index="/admin-books">
          <template #title>
            <el-icon>
              <Collection />
            </el-icon>
            <span>图书管理</span>
          </template>
          <el-menu-item index="/admin/books/add">新增图书</el-menu-item>
          <el-menu-item index="/admin/books/list">图书编目</el-menu-item>
          <el-menu-item index="/admin/books/delete">删除图书</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/admin-borrowing">
          <template #title>
            <el-icon>
              <List />
            </el-icon>
            <span>借阅管理</span>
          </template>
          <el-menu-item index="/admin/borrowing/return">归还确认</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon>
              <Setting />
            </el-icon>
            <span>系统设置</span>
          </template>
          <!-- <el-menu-item index="/system/users">用户管理</el-menu-item> -->
          <el-menu-item index="/system/notification">消息推送</el-menu-item>
          <el-menu-item index="/system/logs">操作日志</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/statistics">
          <el-icon>
            <TrendCharts />
          </el-icon>
          <span>数据统计</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const isAdmin = computed(() => authStore.isAdmin)
</script>

<style scoped lang="scss">
.sidebar {
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
  border-right: 1px solid #f0f0f0;

  &.is-admin {
    .logo-container .title {
      color: #333;
    }
  }

  .logo-container {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;

    .logo {
      width: 36px;
      height: 36px;
      margin-right: 12px;
      object-fit: contain;
    }

    .title-wrapper {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 18px;
        font-weight: 700;
        color: #165C91;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 12px;
        color: #909399;
        margin-top: 2px;
      }
    }
  }

  .el-menu-vertical {
    border-right: none;
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;

    .menu-group-title {
      padding: 15px 20px 10px;
      font-size: 12px;
      color: #909399;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    :deep(.el-menu-item) {
      margin: 4px 10px;
      border-radius: 6px;
      height: 44px;
      line-height: 44px;
      color: #606266;

      &:hover {
        background-color: #f5f7fa;
        color: #165C91;
      }

      &.is-active {
        background-color: #e6f0f8;
        color: #165C91;
        font-weight: 600;

        .el-icon {
          color: #165C91;
        }
      }

      .el-icon {
        color: #909399;
        transition: color 0.3s;
      }
    }

    :deep(.el-sub-menu__title) {
      margin: 0 10px;
      border-radius: 6px;
      height: 44px;
      line-height: 44px;
      color: #606266;

      &:hover {
        background-color: #f5f7fa;
        color: #165C91;
      }

      .el-icon {
        color: #909399;
      }
    }
  }
}
</style>
