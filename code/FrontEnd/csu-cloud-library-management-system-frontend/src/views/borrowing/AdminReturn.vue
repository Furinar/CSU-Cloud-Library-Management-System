<template>
  <div class="admin-return-container">
    <el-card class="common-card">
      <div class="toolbar">
        <el-select v-model="filterStatus" placeholder="状态筛选" style="width: 120px;" @change="handleSearch">
            <el-option label="全部" value="" />
            <el-option label="待确认" value="RETURN_PENDING" />
            <el-option label="借阅中" value="BORROWED" />
            <el-option label="已逾期" value="OVERDUE" />
            <el-option label="已归还" value="RETURNED" />
        </el-select>
      </div>
      
      <el-table :data="returnRequests" v-loading="loading" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="bookTitle" label="图书" />
        <el-table-column prop="userName" label="归还用户" />
        <el-table-column label="借阅日期">
          <template #default="{ row }">
            {{ formatDateTime(row.borrowDate) }}
          </template>
        </el-table-column>
        <el-table-column label="应还日期">
          <template #default="{ row }">
            {{ formatDateTime(row.dueDate) }}
          </template>
        </el-table-column>
        <el-table-column label="归还时间">
          <template #default="{ row }">
            {{ formatDateTime(row.returnDate) }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button 
              type="success" 
              size="small" 
              class="action-btn"
              @click="handleConfirm(row)"
              :disabled="row.status === 'RETURNED'"
            >
              {{ row.status === 'RETURNED' ? '已归还' : '确认归还' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAllBorrowRecords, confirmReturn } from '@/api/borrow';
import type { BorrowRecord } from '@/types/borrow';

const filterStatus = ref('');
const returnRequests = ref<BorrowRecord[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};

const getStatusType = (status: string) => {
    switch (status) {
        case 'OVERDUE': return 'danger';
        case 'RETURNED': return 'success';
        case 'RETURN_PENDING': return 'warning';
        default: return 'primary';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'OVERDUE': return '已逾期';
        case 'RETURNED': return '已归还';
        case 'RETURN_PENDING': return '待确认';
        case 'BORROWED': return '借阅中';
        default: return status;
    }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getAllBorrowRecords(
      currentPage.value,
      pageSize.value,
      undefined,
      filterStatus.value || undefined
    );
    returnRequests.value = res.records;
    total.value = res.totalCount || 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const handleConfirm = async (row: BorrowRecord) => {
  try {
    await confirmReturn({ borrowRecordId: row.id });
    ElMessage.success('归还确认成功');
    fetchData();
  } catch (error) {
    ElMessage.error('归还模块：操作失败，服务未就绪或网络异常');
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

onMounted(fetchData);
</script>

<style scoped lang="scss">
.admin-return-container {
  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .action-btn {
    min-width: 80px;
  }
}
</style>
