<template>
  <div class="book-detail-container" v-loading="loading">
    <div v-if="book" class="detail-card common-card">
      <div class="book-header">
        <div class="cover-wrapper">
          <img :src="book.coverUrl" :alt="book.title" />
        </div>
        <div class="info-wrapper">
          <h1 class="book-title">{{ book.title }}</h1>
          <div class="book-meta-grid">
            <div class="meta-item"><span class="label">作者：</span>{{ book.author }}</div>
            <div class="meta-item"><span class="label">ISBN：</span>{{ book.isbn }}</div>
            <div class="meta-item"><span class="label">出版社：</span>{{ book.publisher }}</div>
            <div class="meta-item"><span class="label">出版日期：</span>{{ book.publishDate }}</div>
            <div class="meta-item"><span class="label">分类：</span>{{ book.category }}</div>
          </div>

          <div class="stock-info">
            <div class="stock-item">
              <div class="num">{{ book.availableStock }}</div>
              <div class="txt">可借数量</div>
            </div>
            <div class="stock-divider"></div>
            <div class="stock-item">
              <div class="num">{{ book.totalStock }}</div>
              <div class="txt">馆藏总量</div>
            </div>
          </div>

          <div class="action-area">
            <el-select v-model="borrowTime" style="width: 160px" size="large" placeholder="选择借阅时长">
              <el-option v-for="time in borrowTimeOptions" :key="time" :label="`${time} 天`" :value="time" />
            </el-select>
            <el-button type="primary" size="large" :disabled="book.availableStock <= 0" @click="handleBorrow">
              {{ book.availableStock > 0 ? '立即借阅' : '暂时缺货' }}
            </el-button>
            <!-- <el-button size="large" @click="handleFavorite">收藏</el-button> -->
          </div>
        </div>
      </div>

      <el-divider />

      <div class="book-intro">
        <h3>内容简介</h3>
        <p>{{ book.description }}</p>
      </div>

      <el-divider />

      <div class="review-section">
        <div class="review-header">
          <div class="title-wrap">
            <h3>读者评价</h3>
            <el-tag size="small" effect="plain">{{ reviewPagination.total }} 条反馈</el-tag>
          </div>
          <div v-if="book" class="rating-summary">
            <el-rate :model-value="book.averageRating || 0" disabled allow-half />
            <div class="score">
              <span class="number">{{ Number(book.averageRating ?? 0).toFixed(1) }}</span>
              <span class="suffix">/ 5</span>
            </div>
            <div class="hint">基于历史评分实时更新</div>
          </div>
        </div>

        <div class="review-body">
          <div class="review-form common-card glass-card">
            <div class="form-title">分享你的阅读体验</div>
            <el-rate v-model="newReview.rating" allow-half show-text />
            <el-input v-model="newReview.comment" type="textarea" :rows="4" maxlength="500" show-word-limit
              placeholder="聊聊这本书带给你的思考、情绪或推荐理由..." />
            <el-button class="submit-btn" type="primary" :loading="reviewSubmitting" @click="submitReview">
              发布评价
            </el-button>
          </div>

          <div class="review-list common-card" v-loading="reviewLoading">
            <el-empty v-if="reviews.length === 0" description="还没有评价，快来抢首评吧" />

            <div v-else class="review-items">
              <div class="review-item" v-for="item in reviews" :key="item.id">
                <div class="review-meta">
                  <div class="avatar">{{ (item.username || 'U').charAt(0).toUpperCase() }}</div>
                  <div class="info">
                    <div class="name">{{ item.username }}</div>
                    <div class="rate-time">
                      <el-rate :model-value="item.rating" disabled allow-half />
                      <span class="time">{{ formatDateTime(item.gmtCreate) }}</span>
                    </div>
                  </div>
                  <el-button v-if="canDeleteReview(item)" type="danger" link size="small"
                    @click.stop="handleDeleteReview(item.id)">
                    删除
                  </el-button>
                </div>
                <p class="comment">{{ item.comment }}</p>
              </div>
            </div>

            <div class="review-pagination" v-if="reviewPagination.total > reviewPagination.pageSize">
              <el-pagination background layout="prev, pager, next" :current-page="reviewPagination.currentPage"
                :page-size="reviewPagination.pageSize" :total="reviewPagination.total"
                @current-change="handleReviewPageChange" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getBookById } from '@/api/book';
import { borrowBook } from '@/api/borrow';
import { createReview, getReviewsByBookId, deleteReview, deleteAppointedReview } from '@/api/review';
import { useAuthStore } from '@/stores/auth';
import type { Book } from '@/types/book';
import type { Review } from '@/types/review';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const book = ref<Book | undefined>(undefined);
const borrowTime = ref<number>(30);
const borrowTimeOptions = [1, 3, 7, 14, 30, 60, 90];
const reviews = ref<Review[]>([]);
const reviewLoading = ref(false);
const reviewSubmitting = ref(false);
const reviewPagination = ref({
  currentPage: 1,
  pageSize: 3,  // 每页显示 3 条评价
  total: 0,
});
const newReview = ref({
  rating: 0,
  comment: '',
});

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    loading.value = true;
    try {
      book.value = await getBookById(id);
      await fetchReviews(id);
    } finally {
      loading.value = false;
    }
  }
});

const fetchReviews = async (bookId?: string) => {
  const targetId = bookId || book.value?.id;
  if (!targetId) return;
  reviewLoading.value = true;
  try {
    const res = await getReviewsByBookId(
      targetId,
      reviewPagination.value.currentPage,
      reviewPagination.value.pageSize
    );
    reviews.value = res.records || [];

    // 后端可能返回 totalCount 或 total 字段
    const total = res.totalCount ?? res.total ?? 0;
    reviewPagination.value.total = total;

    console.log('[Review] 获取评价列表:', {
      currentPage: reviewPagination.value.currentPage,
      pageSize: reviewPagination.value.pageSize,
      total: reviewPagination.value.total,
      recordsCount: reviews.value.length,
      responseTotalCount: res.totalCount,
      responseTotal: res.total
    });
  } finally {
    reviewLoading.value = false;
  }
};

const handleBorrow = () => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录');
    router.push('/auth/login');
    return;
  }

  ElMessageBox.confirm(
    `确认借阅这本书吗？借阅期限为 ${borrowTime.value} 天。`,
    '借阅确认',
    {
      confirmButtonText: '确认借阅',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(async () => {
    try {
      if (book.value) {
        await borrowBook({ bookId: book.value.id, borrowTime: borrowTime.value });
        ElMessage.success('借阅成功！请前往个人中心查看。');
        // Refresh book info to update stock (mock)
        if (book.value.availableStock > 0) book.value.availableStock--;
      }
    } catch (error: any) {
      const message =
        error?.friendlyMessage ||
        '借阅模块：服务异常或库存不足';
      ElMessage.error(message);
    }
  });
};

const handleReviewPageChange = (page: number) => {
  reviewPagination.value.currentPage = page;
  fetchReviews();
};

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录后再评价');
    router.push('/auth/login');
    return;
  }

  if (!book.value) return;

  const comment = newReview.value.comment.trim();
  const rating = newReview.value.rating;

  // 验证评分有效性：必须在 0.5 到 5 之间
  if (rating < 0.5 || rating > 5) {
    ElMessage.warning('请选择 0.5 到 5 之间的评分');
    return;
  }
  if (!comment) {
    ElMessage.warning('请填写评价内容');
    return;
  }

  reviewSubmitting.value = true;
  try {
    const reviewData = {
      bookId: book.value.id,  // 尝试发送原始的 bookId
      rating: rating,
      comment,
    };
    console.log('发送评价请求:', reviewData);
    console.log('bookId 类型:', typeof reviewData.bookId);
    await createReview(reviewData);
    ElMessage.success('感谢你的评价！');
    newReview.value.comment = '';
    newReview.value.rating = 0;
    reviewPagination.value.currentPage = 1;
    await fetchReviews(book.value.id);
  } catch (error: any) {
    console.error('评价提交失败:', error);
    // 优先显示后端返回的具体错误信息
    const message = error?.response?.data?.message
      || error?.response?.data?.msg
      || error?.friendlyMessage
      || '提交评价失败，请稍后重试';
    ElMessage.error(message);
  } finally {
    reviewSubmitting.value = false;
  }
};

const canDeleteReview = (review: Review) => {
  const currentUser = authStore.user;
  return authStore.isAdmin || (!!currentUser && review.userId === currentUser.id);
};

const handleDeleteReview = (reviewId: string) => {
  ElMessageBox.confirm('确定删除这条评价吗？', '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      if (authStore.isAdmin)
        await deleteAppointedReview(reviewId);
      else await deleteReview(reviewId);
      ElMessage.success('已删除评价');
      await fetchReviews();
    } catch (error: any) {
      ElMessage.error(error?.friendlyMessage || '删除失败，请稍后再试');
    }
  });
};
const user = localStorage.getItem('user');
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString();
};

const handleFavorite = () => {
  ElMessage.success('已加入收藏');
};
</script>

<style scoped lang="scss">
.book-detail-container {
  max-width: 1000px;
  margin: 0 auto;

  .detail-card {
    min-height: 500px;
  }

  .book-header {
    display: flex;
    gap: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .cover-wrapper {
      width: 260px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      img {
        width: 100%;
        display: block;
      }
    }

    .info-wrapper {
      flex: 1;

      .book-title {
        font-size: 28px;
        color: #333;
        margin: 0 0 20px;
      }

      .book-meta-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 30px;

        .meta-item {
          color: #333;
          font-size: 14px;

          .label {
            color: #999;
            display: inline-block;
            width: 70px;
          }
        }
      }

      .stock-info {
        display: flex;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
        width: fit-content;

        .stock-item {
          text-align: center;
          padding: 0 20px;

          .num {
            font-size: 24px;
            font-weight: bold;
            color: #165C91;
          }

          .txt {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
        }

        .stock-divider {
          width: 1px;
          background: #e0e0e0;
        }
      }

      .action-area {
        display: flex;
        gap: 15px;
      }
    }
  }

  .book-intro {
    padding-top: 10px;

    h3 {
      font-size: 18px;
      color: #333;
      margin-bottom: 15px;
      border-left: 4px solid #165C91;
      padding-left: 10px;
    }

    p {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      text-align: justify;
    }
  }

  .review-section {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .review-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      .title-wrap {
        display: flex;
        align-items: center;
        gap: 10px;

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }
      }

      .rating-summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: linear-gradient(135deg, #f5f9ff, #eef3ff);
        border-radius: 12px;
        border: 1px solid #e4e9f3;

        .score {
          display: flex;
          align-items: baseline;
          gap: 4px;

          .number {
            font-size: 20px;
            font-weight: 700;
            color: #165C91;
          }

          .suffix {
            color: #999;
            font-size: 12px;
          }
        }

        .hint {
          color: #999;
          font-size: 12px;
        }
      }
    }

    .review-body {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }

      .review-form {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .form-title {
          font-weight: 700;
          font-size: 16px;
          color: #165C91;
        }

        .submit-btn {
          align-self: flex-end;
        }
      }

      .glass-card {
        background: linear-gradient(135deg, rgba(22, 92, 145, 0.06), rgba(22, 92, 145, 0.02));
        border: 1px solid rgba(22, 92, 145, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      }

      .review-list {
        min-height: 320px;

        .review-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .review-item {
          border: 1px solid #eef1f6;
          border-radius: 10px;
          padding: 14px 16px;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s, box-shadow 0.2s;
          border-left: 4px solid #165C91;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          }

          .review-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;

            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 12px;
              background: #165C91;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
            }

            .info {
              flex: 1;

              .name {
                font-weight: 700;
                color: #333;
                margin-bottom: 4px;
              }

              .rate-time {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #999;

                .time {
                  font-size: 12px;
                }
              }
            }
          }

          .comment {
            margin: 0;
            color: #555;
            line-height: 1.6;
          }
        }

        .review-pagination {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
