import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/user';
import { login as apiLogin, logout as apiLogout, getUserInfo } from '@/api/auth';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const router = useRouter();

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  if (token.value && !user.value) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    } else {
      getUserInfo().then(u => {
        user.value = u;
        localStorage.setItem('user', JSON.stringify(u));
      }).catch(() => {
        logout();
      });
    }
  }

  async function login(username: string, password: string) {
    try {
      const res = await apiLogin({ username, password });
      token.value = res.token;
      user.value = {
        id: res.userInfo.id,
        username: res.userInfo.username,
        email: res.userInfo.email,
        role: res.userInfo.role
      };
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(user.value));
      return true;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await apiLogout();
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };
});
