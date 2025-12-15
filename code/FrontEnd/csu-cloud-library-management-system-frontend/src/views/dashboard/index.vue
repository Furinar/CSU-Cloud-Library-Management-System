<template>
  <div class="dashboard-container">
    <!-- Admin Stats -->
    <el-row :gutter="20" v-if="isAdmin" class="stats-row">
      <el-col :span="6" v-for="(item, index) in statsCards" :key="index">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" :style="{ backgroundColor: item.color }">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ item.value }}</div>
              <div class="stats-label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Search Section -->
    <div class="search-section">
      <h2 class="section-title">图书检索</h2>
      <div class="search-box">
        <el-input v-model="searchKeyword" :placeholder="searchPlaceholder" class="main-search-input" size="large"
          @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
          <template #append>
            <el-dropdown split-button type="primary" trigger="click" @click="handleSearch" @command="handleFieldChange">
              搜索
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="option in searchFieldOptions" :key="option.value" :command="option.value"
                    :disabled="option.value === searchField">
                    {{ option.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-input>
      </div>
    </div>

    <!-- Main Content Grid -->
    <el-row :gutter="20" class="main-content-row">
      <!-- Left Column: New Books & Top 10 -->
      <el-col :span="16">
        <!-- New Books -->
        <div class="section-block">
          <div class="section-header">
            <h2 class="section-title">新书推荐</h2>
            <el-link type="primary" @click="$router.push('/books/recommend')">更多 <el-icon>
                <ArrowRight />
              </el-icon></el-link>
          </div>

          <el-row :gutter="15" v-loading="loading">
            <el-col :span="8" v-for="book in recommendBooks" :key="book.id">
              <div class="book-card small" @click="goToDetail(book.id)">
                <div class="book-cover">
                  <img :src="book.coverUrl" :alt="book.title" />
                </div>
                <div class="book-info">
                  <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
                  <p class="book-author">{{ book.author }}</p>
                  <el-tag size="small" class="book-tag">{{ book.category }}</el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- Top 10 Popular -->
        <div class="section-block" style="margin-top: 30px;">
          <div class="section-header">
            <h2 class="section-title">热门图书 TOP 10</h2>
          </div>
          <el-card shadow="never" class="common-card hot-table">
            <el-table :data="topBooks" stripe style="width: 100%" size="small" @row-click="handleTopBookClick">
              <el-table-column type="index" label="排名" width="60">
                <template #default="{ $index }">
                  <span class="rank-num" :class="'rank-' + ($index + 1)">{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="书名" show-overflow-tooltip />
              <el-table-column prop="author" label="作者" show-overflow-tooltip />
              <el-table-column prop="borrowCount" label="热度" width="100" align="right">
                <template #default="{ row, $index }">
                  <span class="hot-score">
                    <span
                      :style="$index < 3 ? { color: '#FF6B6B', fontSize: '16px' } : { color: '#CCCCCC', fontSize: '16px' }">
                      🔥
                    </span> {{ row.borrowCount.toFixed(1) }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-col>

      <!-- Right Column: Charts -->
      <el-col :span="8">
        <!-- Category Chart -->
        <el-card class="common-card chart-card">
          <template #header>
            <div class="card-header">图书分类占比</div>
          </template>
          <div ref="categoryChart" class="chart-container"></div>
        </el-card>

        <!-- System Notice (Optional, using space) -->
        <el-card class="common-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">系统公告</div>
          </template>
          <ul class="notice-list">
            <li><span class="dot"></span>欢迎使用中南云图书管理系统</li>
            <li><span class="dot"></span>图书馆即将进行年度盘点</li>
            <li><span class="dot"></span>请各位读者按时归还图书</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Search, User, Collection, Notebook, Odometer, ArrowRight, Star } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { getRecommendBooks, getTop10Books, getAllBooksCount, getBookById, getBooksStatisticsByCategory } from '@/api/book';
import { getUsersCount } from '@/api/auth';
import { getAllRecordsCount, getOverdueRate } from '@/api/borrow';
import type { Book, TopBook } from '@/types/book';
import * as echarts from 'echarts';

const router = useRouter();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);

type SearchField = 'title' | 'author' | 'isbn';

const searchKeyword = ref('');
const searchField = ref<SearchField>('title');
const searchFieldOptions: Array<{ label: string; value: SearchField }> = [
  { label: '按书名', value: 'title' },
  { label: '按作者', value: 'author' },
  { label: '按ISBN', value: 'isbn' },
];
const searchPlaceholder = computed(() => {
  const current = searchFieldOptions.find(item => item.value === searchField.value);
  return `请输入${current?.label.replace('按', '')}进行搜索...`;
});
const recommendBooks = ref<Book[]>([]);
const loading = ref(false);
const categoryChart = ref<HTMLElement>();
const categoryStatistics = ref<Array<{ name: string; value: number }>>([]);
let myCategoryChart: echarts.ECharts | null = null;

const statsCards = ref([
  { label: '总藏书量', value: '—', icon: 'Collection', color: '#409EFF' },
  { label: '注册用户', value: '—', icon: 'User', color: '#67C23A' },
  { label: '总借阅量', value: '—', icon: 'Notebook', color: '#E6A23C' },
  { label: '逾期率', value: '—', icon: 'Odometer', color: '#F56C6C' },
]);

const topBooks = ref<TopBook[]>([]);

// 颜色数组，用于给不同分类着色
const chartColors = [
  '#165C91', '#409EFF', '#67C23A', '#E6A23C', '#F56C6C',
  '#9A60B4', '#FF7875', '#FFA940', '#13C2C2', '#EB2F96'
];

const initChart = () => {
  if (categoryChart.value) {
    myCategoryChart = echarts.init(categoryChart.value);

    // 为数据添加颜色
    const chartData = categoryStatistics.value.map((item, index) => ({
      ...item,
      itemStyle: { color: chartColors[index % chartColors.length] }
    }));

    myCategoryChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8
      },
      series: [
        {
          name: '图书分类',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData.length > 0 ? chartData : [
            { value: 1048, name: '计算机', itemStyle: { color: '#165C91' } },
            { value: 735, name: '文学', itemStyle: { color: '#409EFF' } },
            { value: 580, name: '历史', itemStyle: { color: '#67C23A' } },
            { value: 484, name: '经济', itemStyle: { color: '#E6A23C' } },
            { value: 300, name: '其他', itemStyle: { color: '#909399' } }
          ]
        }
      ]
    });
  }
};

const fetchCategoryStatistics = async () => {
  try {
    categoryStatistics.value = await getBooksStatisticsByCategory();
  } catch (error) {
    console.error('获取分类统计失败', error);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    // API call to get recommended books
    const res = await getRecommendBooks();
    recommendBooks.value = res.slice(0, 3);
    const tasks = [fetchTopBooks(), fetchCategoryStatistics()];
    if (isAdmin.value) tasks.unshift(fetchStats());
    await Promise.all(tasks);
    initChart();
    window.addEventListener('resize', () => myCategoryChart?.resize());
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', () => myCategoryChart?.resize());
  myCategoryChart?.dispose();
});

const handleFieldChange = (field: SearchField) => {
  searchField.value = field;
};

const handleSearch = () => {
  const keyword = searchKeyword.value.trim();
  if (keyword) {
    router.push({ path: '/books/search', query: { [searchField.value]: keyword } });
  }
};

const goToDetail = (id: string) => {
  router.push(`/books/detail/${id}`);
};

const formatDate = (dateStr: string) => {
  return dateStr;
};

const formatNumber = (val: number) => {
  if (val >= 10000) {
    return `${(val / 10000).toFixed(1)} 万`;
  }
  return val.toString();
};

const fetchStats = async () => {
  if (!isAdmin.value) return;
  try {
    const [booksCount, usersCount, borrowCount, overdueRate] = await Promise.all([
      getAllBooksCount(),
      getUsersCount(),
      getAllRecordsCount(),
      getOverdueRate()
    ]);

    statsCards.value = [
      { label: '总藏书量', value: formatNumber(booksCount), icon: 'Collection', color: '#409EFF' },
      { label: '注册用户', value: formatNumber(usersCount), icon: 'User', color: '#67C23A' },
      { label: '总借阅量', value: formatNumber(borrowCount), icon: 'Notebook', color: '#E6A23C' },
      { label: '逾期率', value: `${(overdueRate).toFixed(1)}%`, icon: 'Odometer', color: '#F56C6C' },
    ];
  } catch (error) {
    console.error('获取统计数据失败', error);
  }
};

const fetchTopBooks = async () => {
  try {
    const res = await getTop10Books();
    // console.log('Top 10 Books Response:', res);
    const list: TopBook[] = Array.isArray(res)
      ? res
      : res?.top10Books
      ?? (res as any)?.list
      ?? (res as any)?.data?.top10Books
      ?? [];

    topBooks.value = list.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: String(idx + 1), title: item, author: '-', borrowCount: 0 };
      }
      return {
        id: item.id || String(idx + 1),
        title: item.title,
        author: item.author || '-',
        coverUrl: item.coverUrl,
        borrowCount: (item.averageRating ?? 0) * 2 || 0,
      };
    });
  } catch (error) {
    console.error('获取热门图书失败', error);
  }
};

const handleTopBookClick = (row: TopBook) => {
  if (row?.id) {
    goToDetail(row.id);
  }
};
</script>

<style scoped lang="scss">
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-row {
  margin-bottom: 30px;
}

.stats-card {
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .stats-content {
    display: flex;
    align-items: center;

    .stats-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      color: #fff;
      font-size: 24px;
    }

    .stats-info {
      .stats-value {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        line-height: 1.2;
      }

      .stats-label {
        font-size: 14px;
        color: #999;
        margin-top: 5px;
      }
    }
  }
}

.search-section {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .section-title {
    margin-bottom: 20px;
    color: #333;
    font-weight: 600;
  }

  .search-box {
    max-width: 600px;
    margin: 0 auto;
  }
}

.section-block {
  margin-bottom: 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
      border-left: 4px solid #165C91;
      padding-left: 12px;
    }
  }
}

.book-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #165C91;
  }

  &.small {
    display: flex;
    flex-direction: column;

    .book-cover {
      height: 160px;
      width: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .book-info {
      padding: 10px;

      .book-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin: 0 0 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .book-author {
        font-size: 12px;
        color: #666;
        margin: 0 0 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.chart-container {
  height: 300px;
}

.rank-num {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #f0f2f5;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;

  &.rank-1 {
    background: #F56C6C;
    color: #fff;
  }

  &.rank-2 {
    background: #E6A23C;
    color: #fff;
  }

  &.rank-3 {
    background: #409EFF;
    color: #fff;
  }
}

.hot-score {
  color: #F56C6C;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-weight: 500;
}

.hot-table {
  :deep(.el-table__row) {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  :deep(.el-table__row:hover) {
    background-color: #f9fafc;
  }
}

.main-search-input {
  :deep(.el-input-group__append) {
    background-color: #165C91;
    color: #fff;
    border-color: #165C91;

    &:hover {
      background-color: #124E7C;
    }
  }

  /* 确保分裂按钮文字仍为白色 */
  :deep(.el-button--primary) {
    color: #fff;
  }
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    color: #606266;
    font-size: 14px;

    &:last-child {
      border-bottom: none;
    }

    .dot {
      width: 6px;
      height: 6px;
      background: #165C91;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
