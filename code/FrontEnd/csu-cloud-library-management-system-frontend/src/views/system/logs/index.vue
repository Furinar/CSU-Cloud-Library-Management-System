<template>
  <div class="logs-container">
    <el-card class="common-card">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <div class="actions">
             <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              style="margin-right: 10px; width: 240px;"
            />
            <el-button type="primary" size="small">查询</el-button>
            <el-button size="small">导出</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="logs" stripe style="width: 100%">
        <el-table-column prop="time" label="操作时间" width="180" />
        <el-table-column prop="user" label="操作人" width="120" />
        <el-table-column prop="module" label="模块" width="120">
           <template #default="{ row }">
            <el-tag size="small">{{ row.module }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
           <template #default="{ row }">
            <el-tag size="small" :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" />
        <el-table-column prop="ip" label="IP地址" width="140" />
      </el-table>
      
      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="100" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dateRange = ref('');

const logs = ref([
  { time: '2023-12-01 12:30:45', user: 'admin', module: '图书管理', type: '新增', content: '新增图书《Vue.js设计与实现》', ip: '192.168.1.10' },
  { time: '2023-12-01 11:20:12', user: 'user01', module: '借阅管理', type: '借阅', content: '借阅图书《JavaScript高级程序设计》', ip: '192.168.1.105' },
  { time: '2023-12-01 10:15:30', user: 'admin', module: '用户管理', type: '修改', content: '修改用户 user02 的状态为禁用', ip: '192.168.1.10' },
  { time: '2023-11-30 16:45:22', user: 'user03', module: '系统', type: '登录', content: '用户登录系统', ip: '192.168.1.112' },
]);

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    '新增': 'success',
    '修改': 'warning',
    '删除': 'danger',
    '借阅': 'primary',
    '登录': 'info'
  };
  return map[type] || 'info';
};
</script>

<style scoped lang="scss">
.logs-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

