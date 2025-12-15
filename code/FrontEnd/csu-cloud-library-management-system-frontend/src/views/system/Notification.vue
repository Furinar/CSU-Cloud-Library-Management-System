<template>
  <div class="notification-admin-container">
    <el-card class="common-card">
      <template #header>
        <div class="card-header">
          <span>消息管理</span>
          <el-button type="primary" @click="showDialog = true">发送通知</el-button>
        </div>
      </template>

      <div class="filter-container">
        <el-input
          v-model="queryParams.keyword"
          placeholder="搜索标题或内容"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter="handleQuery"
        />
        <el-button type="primary" class="filter-item" @click="handleQuery">搜索</el-button>
        <el-button class="filter-item" @click="resetQuery">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="notificationList" border style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userName" label="接收用户" width="120">
          <template #default="scope">
            {{ scope.row.userName || '全体用户' }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'READ' ? 'success' : 'info'">
              {{ scope.row.status === 'READ' ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gmtCreate" label="发送时间" width="180" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.currentPage"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 发送通知对话框 -->
    <el-dialog
      v-model="showDialog"
      title="发送通知"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
        <el-form-item label="接收对象" prop="target">
          <el-radio-group v-model="form.target">
            <el-radio label="all">全体学生</el-radio>
            <el-radio label="specific">指定学生</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item 
          label="用户名" 
          prop="username" 
          v-if="form.target === 'specific'"
          :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
        >
          <el-input v-model="form.username" placeholder="请输入用户名（精确匹配）" />
        </el-form-item>

        <el-form-item label="通知标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入通知标题" />
        </el-form-item>

        <el-form-item label="通知内容" prop="content">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="6" 
            placeholder="请输入通知内容..." 
          />
        </el-form-item>

        <el-form-item label="通知类型" prop="type">
          <el-tag>系统通知</el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" :loading="sending" @click="handleSubmit">发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { pushNotification2All, pushNotification2User, getAllNotificationsAdmin } from '@/api/notification';
import type { NotificationVO } from '@/api/notification';

const loading = ref(false);
const sending = ref(false);
const showDialog = ref(false);
const notificationList = ref<NotificationVO[]>([]);
const total = ref(0);

const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: ''
});

const formRef = ref<FormInstance>();
const form = reactive({
  target: 'all',
  username: '',
  title: '',
  content: '',
  type: 'COMMON' as const
});

const rules = {
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入通知内容', trigger: 'blur' }
  ]
};

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    'COMMON': '',
    'DUE_REMINDER': 'warning',
    'OVERDUE_NOTICE': 'danger'
  };
  return map[type] || 'info';
};

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    'COMMON': '常规通知',
    'DUE_REMINDER': '到期提醒',
    'OVERDUE_NOTICE': '逾期通知'
  };
  return map[type] || type;
};

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await getAllNotificationsAdmin(queryParams);
    notificationList.value = res.records;
    total.value = res.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  queryParams.currentPage = 1;
  fetchList();
};

const resetQuery = () => {
  queryParams.keyword = '';
  handleQuery();
};

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  fetchList();
};

const handleCurrentChange = (val: number) => {
  queryParams.currentPage = val;
  fetchList();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      sending.value = true;
      try {
        const sendData = {
          title: form.title,
          content: form.content,
          type: form.type,
          status: 'UNREAD' as const
        };

        if (form.target === 'specific') {
          await pushNotification2User(form.username, sendData);
        } else {
          await pushNotification2All(sendData);
        }
        ElMessage.success('通知发送成功');
        showDialog.value = false;
        fetchList(); // Refresh list
      } catch (error) {
        console.error(error);
      } finally {
        sending.value = false;
      }
    }
  });
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    form.target = 'all';
    form.username = '';
  }
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped lang="scss">
.notification-admin-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
