<template>
  <div class="notification-admin-container">
    <el-card class="common-card">
      <template #header>
        <div class="card-header">
          <span>发送通知</span>
        </div>
      </template>

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

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">发送通知</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="history-section" style="margin-top: 20px;">
      <el-alert
        title="提示：通知发送后将立即推送给对应用户，请谨慎操作。"
        type="info"
        show-icon
        :closable="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { pushNotification2All, pushNotification2User } from '@/api/notification';

const formRef = ref<FormInstance>();
const loading = ref(false);

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

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      try {
        // Convert comma separated IDs to array if needed, or backend handles specific user logic
        // Here we assume the API expects userId as string (maybe single or comma separated)
        // or null for all.
        
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
        resetForm();
      } catch (error) {
        console.error(error);
        // Since we don't have a real backend for this, catch the 404 or similar
        // and maybe show a success message for demo purposes if it's just a simulation request
        // But typically we show the error. 
        // If the user hasn't implemented this API yet, it will fail.
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    form.target = 'all'; // Reset manually as it might not be a prop of form-item directly
    form.username = '';
  }
};
</script>

<style scoped lang="scss">
.notification-admin-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>

