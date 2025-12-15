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
        <el-table-column prop="isDeleted" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.isDeleted === 1 ? 'danger' : 'success'">{{ row.isDeleted === 1 ? '封禁' : '正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="row.role !== 'ADMIN'"
              :type="row.isDeleted === 1 ? 'success' : 'danger'" 
              size="small" 
              @click="handleStatusChange(row)"
            >
              {{ row.isDeleted === 1 ? '解封' : '封禁' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination 
          layout="total, prev, pager, next" 
          :total="total" 
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          @current-change="fetchUsers"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { User } from '@/types/user';
import { getUserList, updateUserStatus } from '@/api/user';

const loading = ref(false);
const users = ref<User[]>([]);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getUserList({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    });
    users.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers();
};

const handleStatusChange = (row: User) => {
  const action = row.isDeleted === 1 ? '解封' : '封禁';
  ElMessageBox.confirm(`确定要${action}用户 ${row.username} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await updateUserStatus(row.id, row.isDeleted === 1 ? 0 : 1);
      ElMessage.success(`${action}成功`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  });
};

onMounted(() => {
  fetchUsers();
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
