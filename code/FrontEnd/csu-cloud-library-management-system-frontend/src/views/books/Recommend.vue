<template>
  <div class="recommend-container">
    <el-card class="common-card">
      <template #header>
        <div class="card-header">
          <span>新书上架 TOP 5</span>
          <el-button type="primary" link @click="$router.push('/books/search')">查看更多</el-button>
        </div>
      </template>
      
      <div class="recommend-list" v-loading="loading">
        <div v-for="(book, index) in books" :key="book.id" class="recommend-item" @click="goToDetail(book.id)">
          <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
          <img :src="book.coverUrl" class="book-cover" />
          <div class="book-info">
            <h3 class="title">{{ book.title }}</h3>
            <p class="author">{{ book.author }}</p>
            <!-- <p class="intro">{{ book.description || '暂无简介' }}</p> -->
            <div class="meta">
              <el-tag size="small">{{ book.category }}</el-tag>
              <!-- <span class="date">出版时间: {{ book.publishDate }}</span> -->
            </div>
          </div>
          <el-button type="primary" plain round size="small" class="action-btn">查看详情</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getRecommendBooks } from '@/api/book';
import type { Book } from '@/types/book';

const router = useRouter();
const loading = ref(false);
const books = ref<Book[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    books.value = await getRecommendBooks();
  } finally {
    loading.value = false;
  }
});

const goToDetail = (id: string) => {
  router.push(`/books/detail/${id}`);
};
</script>

<style scoped lang="scss">
.recommend-container {
  max-width: 1000px;
  margin: 0 auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .recommend-item {
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background-color: #f9fafc;
      
      .action-btn {
        opacity: 1;
        transform: translateX(0);
      }
    }

    &:last-child {
      border-bottom: none;
    }

    .rank-badge {
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: #ccc;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      border-bottom-right-radius: 8px;
      
      &.rank-1 { background: #F56C6C; }
      &.rank-2 { background: #E6A23C; }
      &.rank-3 { background: #409EFF; }
    }

    .book-cover {
      width: 100px;
      height: 140px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-right: 20px;
    }

    .book-info {
      flex: 1;
      
      .title {
        font-size: 18px;
        color: #333;
        margin: 0 0 8px;
      }
      
      .author {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
      }
      
      .intro {
        font-size: 13px;
        color: #999;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
      }
      
      .meta {
        display: flex;
        align-items: center;
        gap: 15px;
        
        .date {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .action-btn {
      align-self: center;
      opacity: 0;
      transform: translateX(20px);
      transition: all 0.3s;
    }
  }
}
</style>

