<template>
  <div class="register-wrapper">
    <div class="register-header">
      <h2 class="title">注册账号</h2>
      <p class="subtitle">创建您的中南云图书管理账号</p>
    </div>

    <el-form
      ref="formRef"
      :model="registerForm"
      :rules="rules"
      class="register-form"
      size="large"
      @submit.prevent
    >
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          :prefix-icon="User"
          class="custom-input"
        />
      </el-form-item>
      
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          :prefix-icon="Message"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="设置密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </el-form-item>
      
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="确认密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </el-form-item>

      <el-button
        type="primary"
        class="submit-btn"
        :loading="loading"
        @click="handleRegister"
        round
      >
        {{ loading ? '注册中...' : '立即注册' }}
      </el-button>
    </el-form>

    <div class="form-footer-wrapper">
      <div class="form-footer">
        <span>已有账号？</span>
        <el-link type="primary" :underline="false" @click="goToLogin">去登录</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { User, Lock, Message } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = computed(() => ({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
}));

const handleRegister = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await register({
          username: registerForm.username,
          password: registerForm.password,
          email: registerForm.email
        });
        
        ElMessage.success('注册成功，请登录');
        router.push('/auth/login');
      } catch (error: any) {
        // Error is handled by interceptor generally, but safe to keep
      } finally {
        loading.value = false;
      }
    }
  });
};

const goToLogin = () => {
  router.push('/auth/login');
};
</script>

<style scoped lang="scss">
.register-wrapper {
  width: 100%;
  max-width: 360px;
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
  
  .title {
    font-size: 26px;
    font-weight: 600;
    color: #165C91;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 14px;
    color: #909399;
  }
}

.register-form {
  .custom-input {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      border-radius: 8px;
      padding: 10px 15px;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset;
      }
      
      &.is-focus {
        box-shadow: 0 0 0 1px #165C91 inset !important;
      }
    }
    :deep(.el-input__inner) {
      height: 24px;
    }
  }
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #165C91 0%, #1e7ebf 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(22, 92, 145, 0.3);
  transition: all 0.3s;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(22, 92, 145, 0.4);
    background: linear-gradient(90deg, #124E7C 0%, #165C91 100%);
  }
  
  &:active {
    transform: translateY(1px);
  }
}

.form-footer-wrapper {
  margin-top: 20px;
  height: 24px;
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #909399;
}
</style>

