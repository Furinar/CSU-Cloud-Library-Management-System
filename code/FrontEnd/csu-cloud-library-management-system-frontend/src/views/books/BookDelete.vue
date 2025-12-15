<template>
  <div class="book-delete-container">
    <el-card class="common-card">
      <div class="card-header">
        <h3>删除图书</h3>
        <div class="header-actions">
          <el-form :inline="true" :model="queryParams" class="filter-form" @submit.prevent>
            <el-form-item label="书名">
              <el-input v-model="queryParams.title" placeholder="请输入书名" clearable />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="queryParams.author" placeholder="请输入作者" clearable />
            </el-form-item>
            <el-form-item label="ISBN">
              <el-input v-model="queryParams.isbn" placeholder="请输入ISBN" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
          <el-button type="danger" :disabled="multipleSelection.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column label="图书信息" :min-width="260">
          <template #default="{ row }">
            <div class="book-info">
              <img :src="row.coverUrl" alt="" class="book-cover" />
              <div class="book-text">
                <div class="title">{{ row.title }}</div>
                <div class="author">{{ row.author }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="isbn" label="ISBN" width="140" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" show-overflow-tooltip />
        <el-table-column label="库存" width="140">
          <template #default="{ row }">
            <el-tag :type="row.availableStock > 0 ? 'success' : 'danger'" size="small">
              {{ row.availableStock > 0 ? '可借阅' : '无库存' }}
            </el-tag>
            <span class="stock-count">{{ row.availableStock }}/{{ row.totalStock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click.stop="handleDeleteOne(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if="total > 0">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          layout="total, prev, pager, next" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getBooks, deleteBooks, resolveBooksTotal } from '@/api/book';
import type { Book, BookQuery } from '@/types/book';

const loading = ref(false);
const tableData = ref<Book[]>([]);
const multipleSelection = ref<Book[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const queryParams = reactive<BookQuery>({
  title: '',
  author: '',
  isbn: '',
  currentPage: 1,
  pageSize: 10
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getBooks(queryParams);
    tableData.value = res.records || [];
    total.value = await resolveBooksTotal(queryParams, res);
  } catch (error) {
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  queryParams.currentPage = page;
  fetchData();
};

const handleSearch = () => {
  currentPage.value = 1;
  queryParams.currentPage = 1;
  fetchData();
};

const handleReset = () => {
  queryParams.title = '';
  queryParams.author = '';
  queryParams.isbn = '';
  handleSearch();
};

const handleSelectionChange = (rows: Book[]) => {
  multipleSelection.value = rows;
};

const confirmDelete = async (ids: string[]) => {
  if (!ids.length) return;
  await ElMessageBox.confirm('确定要删除所选图书吗？删除后将无法恢复。', '删除确认', {
    type: 'warning'
  });
  await deleteBooks(ids);
  ElMessage.success('删除成功');
  fetchData();
};

const handleBatchDelete = () => {
  const ids = multipleSelection.value.map((item) => item.id);
  confirmDelete(ids);
};

const handleDeleteOne = (row: Book) => {
  confirmDelete([row.id]);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.book-delete-container {
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      border-left: 4px solid #165C91;
      padding-left: 12px;
      line-height: 24px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: flex-end;
      width: 100%;

      .filter-form {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 12px;
        align-items: center;
      }
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

  .stock-count {
    margin-left: 8px;
    color: #666;
    font-size: 12px;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
