<template>
  <div class="admin-return-container">
    <el-card class="common-card">
      <div class="toolbar">
        <el-input v-model="searchKeyword" placeholder="输入书名关键词..." style="width: 300px;">
          <template #append>
             <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
      </div>
      
      <el-table :data="returnRequests" v-loading="loading" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="bookTitle" label="图书" />
        <el-table-column prop="borrowDate" label="借阅日期" />
        <el-table-column prop="dueDate" label="应还日期" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'OVERDUE' ? 'danger' : 'warning'">
              {{ row.status === 'RETURNED' ? '已归还' : row.status === 'OVERDUE' ? '已逾期' : '待归还确认' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleConfirm(row)">确认归还</el-button>
          </template>
        </el-table-column> -->
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
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getAllBorrowRecords, getAllRecordsCount, returnBook } from '@/api/borrow';
import type { BorrowRecord } from '@/types/borrow';

const searchKeyword = ref('');
const returnRequests = ref<BorrowRecord[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getAllBorrowRecords(
      currentPage.value,
      pageSize.value,
      searchKeyword.value || undefined
    );
    returnRequests.value = res.records;
    total.value = await getAllRecordsCount();
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
    await returnBook({ borrowRecordId: row.id });
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
}
</style>
