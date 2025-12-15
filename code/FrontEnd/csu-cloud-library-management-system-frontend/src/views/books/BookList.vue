<template>
  <div class="book-list-container">
    <div class="filter-card common-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
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
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list-content" v-loading="loading">
      <el-empty v-if="books.length === 0 && !loading" description="暂无相关图书" />

      <div v-else class="book-grid">
        <div class="book-item" v-for="book in books" :key="book.id" @click="goToDetail(book.id)">
          <div class="book-img">
            <img :src="book.coverUrl" :alt="book.title" />
          </div>
          <div class="book-details">
            <h3 class="title">{{ book.title }}</h3>
            <div class="author">作者：{{ book.author }}</div>
            <div class="publisher">出版社：{{ book.publisher }}</div>
            <div class="stock">
              <el-tag :type="book.availableStock > 0 ? 'success' : 'danger'" size="small">
                {{ book.availableStock > 0 ? '可借阅' : '暂无库存' }}
              </el-tag>
              <span class="count">库存: {{ book.availableStock }}/{{ book.totalStock }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination-container">
        <el-pagination v-model:current-page="queryParams.currentPage" v-model:page-size="queryParams.pageSize"
          :total="total" layout="total, prev, pager, next" @current-change="fetchBooks" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getBooks, resolveBooksTotal } from '@/api/book';
import type { Book, BookQuery } from '@/types/book';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const books = ref<Book[]>([]);
const total = ref(0);

const queryParams = reactive<BookQuery>({
  title: '',
  author: '',
  isbn: '',
  currentPage: 1,
  pageSize: 10
});

const fetchBooks = async () => {
  loading.value = true;
  try {
    const res = await getBooks(queryParams);
    books.value = res.records || [];
    total.value = await resolveBooksTotal(queryParams, res);
  } catch (error) {
    books.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  queryParams.currentPage = 1;
  fetchBooks();
};

const resetQuery = () => {
  queryParams.title = '';
  queryParams.author = '';
  queryParams.isbn = '';
  queryParams.currentPage = 1;
  fetchBooks();
};

const goToDetail = (id: string) => {
  router.push(`/books/detail/${id}`);
};

onMounted(() => {
  if (route.query.title) {
    queryParams.title = route.query.title as string;
  }
  if (route.query.author) {
    queryParams.author = route.query.author as string;
  }
  if (route.query.isbn) {
    queryParams.isbn = route.query.isbn as string;
  }
  if (route.query.keyword) {
    queryParams.title = route.query.keyword as string;
  }
  fetchBooks();
});
</script>

<style scoped lang="scss">
.book-list-container {
  .filter-card {
    margin-bottom: 20px;
  }

  .book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .book-item {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      border-color: #165C91;
    }

    .book-img {
      width: 100px;
      height: 140px;
      flex-shrink: 0;
      margin-right: 15px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .book-details {
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 10px;
        line-height: 1.4;
      }

      .author,
      .publisher {
        font-size: 13px;
        color: #666;
        margin-bottom: 6px;
      }

      .stock {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .count {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>
