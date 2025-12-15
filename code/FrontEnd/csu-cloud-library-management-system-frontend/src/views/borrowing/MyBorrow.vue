<template>
  <div class="my-borrow-container">
    <el-card class="common-card">
      <div v-if="viewType === 'current'">
        <div class="card-header">
          <h3>当前借阅</h3>
        </div>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column label="图书信息" :min-width="260">
            <template #default="{ row }">
              <div class="book-info">
                <img :src="row.bookCoverUrl" alt="" class="book-cover" />
                <div class="book-text">
                  <div class="title">{{ row.bookTitle }}</div>
                  <!-- <div class="author">{{ row.author }}</div> -->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="borrowDate" label="借阅日期" width="120">
            <template #default="{ row }">
              {{ formatDateTime(row.borrowDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="dueDate" label="应还日期" width="120">
            <template #default="{ row }">
              <span :class="{ 'overdue': isOverdue(row.dueDate) }">{{ formatDateTime(row.dueDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'OVERDUE' || isOverdue(row.dueDate) ? 'danger' : 'primary'">
                {{ row.status === 'OVERDUE' || isOverdue(row.dueDate) ? '已逾期' : '借阅中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button size="small" type="success" @click="handleReturn(row)">归还申请</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else>
        <div class="card-header">
          <h3>借阅历史</h3>
        </div>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column label="图书信息" :min-width="260">
            <template #default="{ row }">
              <div class="book-info">
                <img :src="row.bookCoverUrl" alt="" class="book-cover" />
                <div class="book-text">
                  <div class="title">{{ row.bookTitle }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="borrowDate" label="借阅日期" width="120">
            <template #default="{ row }">
              {{ formatDateTime(row.borrowDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="returnDate" label="归还日期" width="120">
            <template #default="{ row }">
              {{ formatDateTime(row.returnDate) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag type="info">已归还</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination" v-if="total > 0">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          layout="total, prev, pager, next" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCurrentBorrows, getHistoryBorrows, returnBook } from '@/api/borrow';
import { useAuthStore } from '@/stores/auth';
import type { BorrowRecord } from '@/types/borrow';

const route = useRoute();
const loading = ref(false);
const tableData = ref<BorrowRecord[]>([]);
const authStore = useAuthStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// Determine view type based on route path
const viewType = computed(() => {
  return route.path.includes('history') ? 'history' : 'current';
});

// Format datetime from ISO format to readable format
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '';
  // Remove timezone indicator and replace T with space
  return dateStr.replace('T', ' ').split('+')[0]?.split('Z')[0] || '';
};

const fetchData = async () => {
  loading.value = true;
  try {
    if (viewType.value === 'current') {
      const res = await getCurrentBorrows(currentPage.value, pageSize.value);
      tableData.value = res.records;
      total.value = res.totalCount || 0;
    } else {
      const res = await getHistoryBorrows(currentPage.value, pageSize.value);
      tableData.value = res.records;
      total.value = res.totalCount || 0;
    }
  } catch (error) {
    console.error('Failed to fetch borrow records:', error);
    // Error handled by request interceptor
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

const handleRenew = (row: BorrowRecord) => {
  ElMessageBox.confirm('确定要续借这本书吗？续借期限为15天。', '续借确认').then(() => {
    ElMessage.success('续借成功');
    // Mock update - In real app, call API here
  });
};

const handleReturn = (row: BorrowRecord) => {
  ElMessageBox.confirm('确定要申请归还这本书吗？', '归还确认').then(() => {
    returnBook({ borrowRecordId: row.id })
      .then(() => {
        ElMessage.success('归还申请已提交，请等待管理员确认');
        fetchData();
      })
      .catch(() => {
        ElMessage.error('归还模块：操作失败，服务未就绪或网络异常');
      });
  });
};

onMounted(() => {
  fetchData();
});

// Re-fetch when route changes (e.g. current -> history)
watch(
  () => route.path,
  () => {
    currentPage.value = 1;
    fetchData();
  }
);
</script>

<style scoped lang="scss">
.my-borrow-container {
  .card-header {
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      border-left: 4px solid #165C91;
      padding-left: 12px;
    }
  }

  .book-info {
    display: flex;
    align-items: center;
    width: 100%;

    .book-cover {
      width: 40px;
      height: 56px;
      object-fit: cover;
      margin-right: 10px;
      border-radius: 4px;
    }

    .book-text {
      flex: 1;
      min-width: 0;

      .title {
        font-weight: 500;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .author {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .overdue {
    color: #F56C6C;
    font-weight: bold;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
