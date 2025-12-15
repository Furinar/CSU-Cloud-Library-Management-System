<template>
  <div class="forgot-wrapper">
    <div class="forgot-header">
      <h2 class="title">找回密码</h2>
      <p class="subtitle">输入账号或邮箱，设置新密码</p>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="forgot-form"
      size="large"
      @submit.prevent
    >
      <el-form-item prop="account">
        <el-input
          v-model="form.account"
          placeholder="账号"
          :prefix-icon="User"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          placeholder="邮箱"
          :prefix-icon="Message"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="新密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="确认新密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
          @keyup.enter="handleSubmit"
        />
      </el-form-item>

      <el-button
        type="primary"
        class="submit-btn"
        :loading="loading"
        @click="handleSubmit"
        round
      >
        {{ loading ? '提交中...' : '重置密码' }}
      </el-button>
    </el-form>

    <div class="form-footer-wrapper">
      <div class="form-footer">
        <el-link type="primary" :underline="false" @click="$router.push('/auth/login')">返回登录</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { User, Lock, Message } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance } from 'element-plus';

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  account: '',
  email: '',
  newPassword: '',
  confirmPassword: ''
});

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_: any, value: string, callback: (err?: Error) => void) => {
        if (value !== form.newPassword) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      // TODO: 调用后端找回密码接口（目前无接口，前端仅提示）
      await new Promise(resolve => setTimeout(resolve, 500));
      ElMessage.success('已提交重置请求，如为演示环境请直接使用测试账号登录');
    } catch (error) {
      ElMessage.error('提交失败');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped lang="scss">
.forgot-wrapper {
  width: 100%;
  max-width: 360px;
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.forgot-header {
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

.forgot-form {
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

