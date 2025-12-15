<template>
  <el-header class="app-header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentRoute.meta.title">{{ currentRoute.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <div class="action-icons">
        <el-tooltip content="消息通知" placement="bottom">
          <div class="icon-item" @click="goToMessages">
            <el-badge v-if="Number(unreadCount) > 0" :value="unreadCount" class="item" type="danger" :max="99">
              <el-icon>
                <Bell />
              </el-icon>
            </el-badge>
            <template v-else>
              <el-icon>
                <Bell />
              </el-icon>
            </template>
          </div>
        </el-tooltip>
        <el-tooltip content="全屏" placement="bottom">
          <div class="icon-item" @click="toggleFullScreen">
            <el-icon>
              <FullScreen />
            </el-icon>
          </div>
        </el-tooltip>
      </div>

      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar :size="32" :src="userAvatar" class="user-avatar" />
          <span class="username">{{ userName }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <div class="dropdown-header">
              <span class="role-badge">{{ roleName }}</span>
            </div>
            <el-dropdown-item command="profile" :icon="User">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowDown, Bell, FullScreen, User, SwitchButton } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getUnreadCount } from '@/api/notification';

const EMIT_REFRESH_UNREAD = 'refresh-unread';

const authStore = useAuthStore();
const router = useRouter();
const currentRoute = useRoute();

const userName = computed(() => authStore.user?.username || '用户');
const userAvatar = computed(() => 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
const roleName = computed(() => authStore.isAdmin ? '系统管理员' : '普通用户');
const unreadCount = ref<number>(0);

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await authStore.logout();
    ElMessage.success('已退出登录');
    router.push('/auth/login');
  } else if (command === 'profile') {
    router.push('/user/profile');
  }
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

const goToMessages = () => {
  router.push('/user/messages');
};

const fetchUnread = async () => {
  try {
    const res = await getUnreadCount();
    unreadCount.value = res || 0;
  } catch (error) {
    unreadCount.value = 0;
  }
};

onMounted(() => {
  fetchUnread();
  window.addEventListener(EMIT_REFRESH_UNREAD, fetchUnread);
});

onBeforeUnmount(() => {
  window.removeEventListener(EMIT_REFRESH_UNREAD, fetchUnread);
});



</script>

<style scoped lang="scss">
.app-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  z-index: 9;

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .action-icons {
      display: flex;
      align-items: center;
      gap: 15px;

      .icon-item {
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
        color: #606266;

        &:hover {
          background: #f6f6f6;
          color: #165C91;
        }
      }
    }

    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #333;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.3s;

      &:hover {
        background: #f6f6f6;
      }

      .user-avatar {
        border: 1px solid #e6e6e6;
      }

      .username {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

:global(.user-dropdown .dropdown-header) {
  padding: 10px 16px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 5px;
  text-align: center;
}

:global(.user-dropdown .role-badge) {
  background: #ecf5ff;
  color: #165C91;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  border: 1px solid #d9ecff;
}
</style>
