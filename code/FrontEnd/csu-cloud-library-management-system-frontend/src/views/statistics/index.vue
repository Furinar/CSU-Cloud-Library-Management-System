<template>
  <div class="statistics-container">
    <h2 class="page-title">数据统计与报表</h2>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="common-card">
          <template #header>
            <div class="card-header">借阅量趋势 (2023)</div>
          </template>
          <div ref="borrowTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="common-card">
          <template #header>
            <div class="card-header">图书分类占比</div>
          </template>
          <div ref="categoryChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="common-card hot-table">
          <template #header>
            <div class="card-header">热门图书 TOP 10</div>
          </template>
          <el-table :data="topBooks" style="width: 100%" @row-click="handleTopBookClick">
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="title" label="书名" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="averageRating" label="评分" width="120" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import { getTop10Books, getBooksStatisticsByCategory } from '@/api/book';
import type { TopBook } from '@/types/book';

const router = useRouter();
const borrowTrendChart = ref<HTMLElement>();
const categoryChart = ref<HTMLElement>();
let myBorrowChart: echarts.ECharts | null = null;
let myCategoryChart: echarts.ECharts | null = null;

const topBooks = ref<TopBook[]>([]);
const categoryStatistics = ref<Array<{ name: string; value: number }>>([]);

// 颜色数组，用于给不同分类着色
const chartColors = [
  '#165C91', '#409EFF', '#67C23A', '#E6A23C', '#F56C6C',
  '#9A60B4', '#FF7875', '#FFA940', '#13C2C2', '#EB2F96'
];

const initCharts = () => {
  if (borrowTrendChart.value) {
    myBorrowChart = echarts.init(borrowTrendChart.value);
    myBorrowChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 132, 101, 134, 90, 230, 150, 180, 150, 200, 160, 190],
          type: 'line',
          smooth: false,
          color: '#165C91',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(22, 92, 145, 0.5)' },
              { offset: 1, color: 'rgba(22, 92, 145, 0.05)' }
            ])
          }
        }
      ]
    });
  }

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
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '图书分类',
          type: 'pie',
          radius: '70%',
          data: chartData.length > 0 ? chartData : [
            { value: 1048, name: '计算机/编程' },
            { value: 735, name: '文学/小说' },
            { value: 580, name: '历史/传记' },
            { value: 484, name: '经济/管理' },
            { value: 300, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  }
};

const resizeCharts = () => {
  myBorrowChart?.resize();
  myCategoryChart?.resize();
};

const fetchCategoryStatistics = async () => {
  try {
    categoryStatistics.value = await getBooksStatisticsByCategory();
  } catch (error) {
    console.error('获取分类统计失败', error);
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

    // console.log('Top 10 Books:', list);
    topBooks.value = list.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: String(idx + 1), title: item, author: '-', borrowCount: 0 };
      }
      return {
        id: item.id || String(idx + 1),
        title: item.title,
        author: item.author || '-',
        coverUrl: item.coverUrl,
        averageRating: item.averageRating ?? 0,
      };
    });
  } catch (error) {
    console.error('获取热门图书失败', error);
  }
};

const handleTopBookClick = (row: TopBook) => {
  if (row?.id) {
    router.push(`/books/detail/${row.id}`);
  }
};

onMounted(async () => {
  await Promise.all([fetchCategoryStatistics(), fetchTopBooks()]);
  initCharts();
  window.addEventListener('resize', resizeCharts);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts);
  myBorrowChart?.dispose();
  myCategoryChart?.dispose();
});
</script>

<style scoped lang="scss">
.statistics-container {
  .page-title {
    margin-bottom: 20px;
    color: #333;
    font-weight: 600;
  }

  .chart-row {
    margin-bottom: 20px;
  }

  .chart-container {
    height: 350px;
  }
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
</style>
