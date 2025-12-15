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
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="角色" required>
          <el-tag>{{ form.role === 'ADMIN' ? '管理员' : '普通用户' }}</el-tag>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存修改</el-button>
          <el-button type="warning" @click="showPasswordDialog = true">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="100px" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" :loading="passwordSaving" @click="handlePasswordSave">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { updateProfile, updatePassword } from '@/api/user';

const authStore = useAuthStore();
const saving = ref(false);
const showPasswordDialog = ref(false);
const passwordSaving = ref(false);
const passwordFormRef = ref();

const form = reactive({
  username: '',
  role: '',
  email: '',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

const handleSave = async () => {
  saving.value = true;
  try {
    await updateProfile({ email: form.email });
    ElMessage.success('保存成功');
    // Update store if needed
    if (authStore.user) {
      authStore.user.email = form.email;
    }
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};

const handlePasswordSave = async () => {
  if (!passwordFormRef.value) return;
  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      passwordSaving.value = true;
      try {
        await updatePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        });
        ElMessage.success('密码修改成功，请重新登录');
        showPasswordDialog.value = false;
        authStore.logout();
      } catch (error) {
        console.error(error);
      } finally {
        passwordSaving.value = false;
      }
    }
  });
};

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
