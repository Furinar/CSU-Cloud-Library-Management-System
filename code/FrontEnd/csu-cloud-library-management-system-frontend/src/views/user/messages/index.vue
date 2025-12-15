<template>
  <div class="messages-container">
    <el-card class="common-card">
      <template #header>
        <div class="card-header">
          <span>消息通知</span>
          <div class="actions">
            <el-button text type="primary" :disabled="unreadCount === 0" @click="markAllRead">全部已读</el-button>
            <el-tag size="small" type="info">未读：{{ unreadCount }}</el-tag>
          </div>
        </div>
      </template>

      <el-empty v-if="!loading && notifications.length === 0" description="暂无通知" />

      <div v-else class="message-list" v-loading="loading">
        <div v-for="msg in notifications" :key="msg.id" class="message-item"
          :class="{ unread: msg.status === 'UNREAD' }">
          <div class="icon-box" :class="typeClass(msg.type)">
            <el-icon>
              <Bell />
            </el-icon>
          </div>
          <div class="content">
            <div class="title">
              <el-tag size="small" type="warning" v-if="msg.type === 'OVERDUE_NOTICE'">逾期</el-tag>
              <el-tag size="small" type="success" v-else-if="msg.type === 'DUE_REMINDER'">到期提醒</el-tag>
              <el-tag size="small" type="info" v-else>通知</el-tag>
              {{ msg.title }}
            </div>
            <div class="time">{{ msg.gmtCreate.replace('T', ' ') }}</div>
            <div class="desc">{{ msg.content }}</div>
          </div>
          <el-button v-if="msg.status === 'UNREAD'" size="small" circle icon="Check" @click="markRead(msg.id)" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Bell } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getNotifications, readNotifications, type Notification } from '@/api/notification';

const EMIT_REFRESH_UNREAD = 'refresh-unread';

const notifications = ref<Notification[]>([]);
const loading = ref(false);
const unreadCount = ref(0);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getNotifications({ currentPage: 1, pageSize: 50 });
    notifications.value = res.records || [];
    unreadCount.value = notifications.value.filter(n => n.status === 'UNREAD').length;
  } catch (error) {
    ElMessage.error('通知模块：获取失败，服务未就绪或网络异常');
  } finally {
    loading.value = false;
  }
};

const markRead = async (id: string) => {
  try {
    const readBooks = {
      notificationIdList: [id]
    }
    await readNotifications(readBooks);
    const target = notifications.value.find(n => n.id === id);
    if (target) target.status = 'READ';
    unreadCount.value = notifications.value.filter(n => n.status === 'UNREAD').length;
    window.dispatchEvent(new Event(EMIT_REFRESH_UNREAD));
  } catch (error) {
    ElMessage.error('通知模块：标记失败，服务未就绪或网络异常');
  }
};


const markAllRead = async () => {
  const ids = notifications.value.filter(n => n.status === 'UNREAD').map(n => n.id);
  if (ids.length === 0) return;
  try {
    const readBooks = {
      notificationIdList: ids
    }
    console.log(readBooks);
    await readNotifications(readBooks);
    notifications.value.forEach(n => (n.status = 'READ'));
    unreadCount.value = 0;
    window.dispatchEvent(new Event(EMIT_REFRESH_UNREAD));
  } catch (error) {
    ElMessage.error('通知模块：全部已读失败，服务未就绪或网络异常');
  }
};

const typeClass = (type: Notification['type']) => {
  if (type === 'OVERDUE_NOTICE') return 'borrow';
  if (type === 'DUE_REMINDER') return 'borrow';
  return 'system';
};

onMounted(() => {
  fetchData();
});


</script>

<style scoped lang="scss">
.messages-container {
  max-width: 800px;
  margin: 0 auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .message-item {
    display: flex;
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
    margin-bottom: 10px;
    transition: all 0.3s;
    align-items: flex-start;

    &.unread {
      background: #fff;
      border: 1px solid #e6f0f8;
      box-shadow: 0 2px 8px rgba(22, 92, 145, 0.1);

      .title {
        font-weight: 600;
        color: #165C91;
      }
    }

    .icon-box {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
      flex-shrink: 0;

      &.system {
        background: #e1f3d8;
        color: #67C23A;
      }

      &.borrow {
        background: #fdf6ec;
        color: #E6A23C;
      }
    }

    .content {
      flex: 1;

      .title {
        font-size: 16px;
        margin-bottom: 5px;
        color: #333;
      }

      .time {
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
      }

      .desc {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}
</style>
