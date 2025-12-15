<template>
  <div class="login-wrapper">
    <div class="login-header">
      <h2 class="title">欢迎登录</h2>
      <p class="subtitle">请选择您的身份进行登录</p>
    </div>

    <el-tabs v-model="activeRole" class="role-tabs" stretch @tab-change="handleTabChange">
      <el-tab-pane label="读者登录" name="user"></el-tab-pane>
      <el-tab-pane label="管理员登录" name="admin"></el-tab-pane>
    </el-tabs>

    <el-form
      ref="formRef"
      :model="loginForm"
      :rules="rules"
      class="login-form"
      size="large"
      @submit.prevent
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          :placeholder="activeRole === 'admin' ? '管理员账号/邮箱' : '账号/邮箱'"
          :prefix-icon="User"
          class="custom-input"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          :prefix-icon="Lock"
          show-password
          class="custom-input"
          @keyup.enter="handleLogin"
        />
      </el-form-item>

      <div class="form-options">
        <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
        <el-link type="primary" :underline="false" class="forgot-pwd" @click="$router.push('/auth/forgot')">忘记密码？</el-link>
      </div>

      <el-button
        type="primary"
        class="submit-btn"
        :class="{'admin-btn': activeRole === 'admin'}"
        :loading="loading"
        @click="handleLogin"
        round
      >
        {{ loading ? '登录中...' : (activeRole === 'admin' ? '进入管理后台' : '立即登录') }}
      </el-button>
    </el-form>

    <div class="form-footer-wrapper">
      <div class="form-footer" v-if="activeRole === 'user'">
        <span>还没有账号？</span>
        <el-link type="primary" :underline="false" @click="$router.push('/auth/register')">立即注册</el-link>
      </div>
      <div class="form-footer-placeholder" v-else></div>
    </div>
    
    <div class="demo-tip">
      <el-alert
        :title="activeRole === 'admin' ? '测试账号: admin / 123456' : '测试账号: user / 123456'"
        :type="activeRole === 'admin' ? 'warning' : 'info'"
        :closable="false"
        show-icon
      >
        <template #title>
          <div class="demo-title-row">
            <span>{{ activeRole === 'admin' ? '测试账号: admin / 123456' : '测试账号: user / 123456' }}</span>
            <el-button size="small" plain type="primary" @click.stop="fillDemo" class="fill-btn">填充</el-button>
          </div>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const rememberMe = ref(false);
const activeRole = ref('user');

const loginForm = reactive({
  username: '',
  password: ''
});

const rules = computed(() => ({
  username: [{ required: true, message: activeRole.value === 'admin' ? '请输入管理员账号' : '请输入读者账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}));

const handleTabChange = () => {
  formRef.value?.resetFields();
  loginForm.username = '';
  loginForm.password = '';
  rememberMe.value = false;
};

const fillDemo = () => {
  if (activeRole.value === 'admin') {
    loginForm.username = 'admin';
    loginForm.password = '123456';
  } else {
    loginForm.username = 'user';
    loginForm.password = '123456';
  }
};

const handleLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await authStore.login(loginForm.username, loginForm.password);
        
        // Check if role matches the tab
        const currentUser = authStore.user;
        const role = currentUser?.role; // 'ADMIN' or 'USER'

        if (activeRole.value !== 'admin' && role === 'ADMIN') {
          await authStore.logout();
          throw new Error('非管理员账号无法从此入口登录');
        }
        
        if (activeRole.value === 'user' && role === 'ADMIN') {
           // Optional: Allow admin to login as user? Or enforce separation?
           // Enforcing separation as per user request "区分用户端和管理员端的界面和登陆界面"
           await authStore.logout();
           throw new Error('管理员请切换至管理员登录入口');
        }

        const rememberPayload: { username: string; role: string; password?: string } = {
          username: loginForm.username,
          role: activeRole.value
        };
        if (rememberMe.value) {
          rememberPayload.password = loginForm.password;
        }
        localStorage.setItem('login-remember', JSON.stringify(rememberPayload));

        ElMessage.success('登录成功');
      
        await router.replace('/dashboard');
      } catch (error: any) {
        console.error('------------------异常:', error);
        const message =
          error?.friendlyMessage ||
          '登录模块：账号或密码错误或服务异常';
        ElMessage.error(message);
      } finally {
        loading.value = false;
      }
    }
  });
};

const initRemember = () => {
  const saved = localStorage.getItem('login-remember');
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved) as { username?: string; password?: string; role?: string };
    if (parsed.username) loginForm.username = parsed.username;
    if (parsed.role) activeRole.value = parsed.role;
    if (parsed.password) {
      loginForm.password = parsed.password;
      rememberMe.value = true;
    } else {
      loginForm.password = '';
      rememberMe.value = false;
    }
  } catch {
    localStorage.removeItem('login-remember');
  }
};

initRemember();
</script>

<style scoped lang="scss">
.login-wrapper {
  width: 100%;
  max-width: 360px;
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
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

.role-tabs {
  margin-bottom: 24px;
  :deep(.el-tabs__item) {
    font-size: 16px;
    color: #606266;
    &.is-active {
      color: #165C91;
      font-weight: 600;
    }
  }
  :deep(.el-tabs__active-bar) {
    background-color: #165C91;
    height: 3px;
    border-radius: 3px;
  }
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  :deep(.el-checkbox__label) {
    color: #606266;
  }
  
  .forgot-pwd {
    font-size: 14px;
    color: #165C91;
    &:hover {
      color: #0f3a5f;
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

  /* Admin Button Style */
  &.admin-btn {
    background: linear-gradient(90deg, #333333 0%, #555555 100%);
    box-shadow: 0 4px 12px rgba(51, 51, 51, 0.3);
    
    &:hover {
      background: linear-gradient(90deg, #000000 0%, #333333 100%);
      box-shadow: 0 6px 16px rgba(51, 51, 51, 0.4);
    }
  }
}

/* Footer layout stabilization */
.form-footer-wrapper {
  margin-top: 20px;
  height: 24px; /* Fixed height matching font-size + margins */
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #909399;
}

.form-footer-placeholder {
  height: 100%;
  width: 100%;
}

.demo-tip {
  margin-top: 30px;

  :deep(.fill-btn) {
    padding: 0 8px;
    font-size: 12px;
    margin-left: auto !important;
  }

  .demo-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    span {
      flex: 1;
    }
  }
}
</style>
