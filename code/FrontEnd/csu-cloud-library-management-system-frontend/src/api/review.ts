import request from '@/utils/request';
import type { PageResponse } from '@/types/common';
import type { CreateReviewDTO, Review } from '@/types/review';


export const createReview = (data: CreateReviewDTO): Promise<Review> => {
  console.log('[Review API] 原始数据:', data);
  
  // 根据 API 文档，bookId 应该是 string 类型
  const payload = {
    bookId: String(data.bookId),  // 确保是字符串
    rating: data.rating,
    comment: data.comment,
  };
  
  console.log('[Review API] 发送数据:', payload);
  console.log('[Review API] 数据类型检查:', {
    bookId: typeof payload.bookId,
    rating: typeof payload.rating,
    comment: typeof payload.comment,
  });
  
  return request({
    url: '/review',
    method: 'post',
    data: payload,
  });
};

export const getReviewsByBookId = (
  bookId: string,
  currentPage: number = 1,
  pageSize: number = 10
): Promise<PageResponse<Review>> => {
  return request({
    url: `/review/${bookId}`,
    method: 'get',
    params: { currentPage, pageSize },
  }).then((res) => {
    console.log('[Review API] getReviewsByBookId 完整响应:', res);
    return res;
  });
};

export const deleteReview = (reviewId: string): Promise<void> => {
  return request({
    url: `/review/${reviewId}`,
    method: 'delete',
  });
};


export const deleteAppointedReview = (reviewId: string): Promise<void> => {
  return request({
    url: `/admin/review/${reviewId}`,
    method: 'delete',
  });
}