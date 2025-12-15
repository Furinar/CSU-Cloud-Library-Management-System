<template>
  <div class="user-list-container">
    <el-card class="common-card">
      <div class="toolbar">
        <el-input v-model="searchKeyword" placeholder="搜索账号/邮箱..." style="width: 300px;" clearable @clear="handleSearch">
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
      </div>
      
      <el-table :data="users" v-loading="loading" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'info'">{{ row.role === 'ADMIN' ? '管理员' : '普通用户' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="users.length" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import type { User } from '@/types/user';

const loading = ref(false);
const users = ref<User[]>([]);
const searchKeyword = ref('');

const handleSearch = () => {
  loading.value = true;
  // TODO: 调用后端列表接口
  users.value = users.value.filter(
    u => u.username.includes(searchKeyword.value) || u.email.includes(searchKeyword.value)
  );
  loading.value = false;
};

onMounted(() => {
  handleSearch();
});
</script>

<style scoped lang="scss">
.user-list-container {
  .toolbar {
    display: flex;
    justify-content: space-between;
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
