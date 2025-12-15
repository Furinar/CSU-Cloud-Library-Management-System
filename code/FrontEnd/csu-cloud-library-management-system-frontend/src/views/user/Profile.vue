<template>
  <div class="profile-container">
    <el-card class="common-card profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息管理</span>
        </div>
      </template>

      <el-form :model="form" label-width="100px">
        <el-form-item label="头像" required>
          <div class="avatar-wrapper">
            <el-avatar :size="80" :src="form.avatar" />
          </div>
        </el-form-item>

        <el-form-item label="账号" required>
          <el-input v-model="form.username" disabled />
        </el-form-item>

        <el-form-item label="邮箱" required>
          <el-input v-model="form.email" disabled />
        </el-form-item>

        <el-form-item label="角色" required>
          <el-tag>{{ form.role === 'ADMIN' ? '管理员' : '普通用户' }}</el-tag>
        </el-form-item>

        <!-- <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="" />
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="3"
            placeholder=""
          />
        </el-form-item> -->

        <!-- <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
        </el-form-item> -->
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const form = reactive({
  username: '',
  role: '',
  email: '',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  nickname: '',
  phone: '',
  bio: ''
});

onMounted(() => {
  if (authStore.user) {
    form.username = authStore.user.username;
    form.role = authStore.user.role;
    form.email = authStore.user.email;
  }
});
</script>

<style scoped lang="scss">
.profile-container {
  max-width: 800px;
  margin: 0 auto;

  .profile-card {
    .card-header {
      font-weight: 600;
    }
  }

  .avatar-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;

    .el-avatar {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
