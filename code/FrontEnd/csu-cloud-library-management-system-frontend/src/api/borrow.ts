import request from '@/utils/request';
import type { PageResponse } from '@/types/common';
import type { BorrowRecord, BorrowRequestDTO, ReturnRequestDTO } from '@/types/borrow';

export const borrowBook = (data: BorrowRequestDTO): Promise<BorrowRecord> => {
  return request({
    url: '/borrow',
    method: 'post',
    data,
  });
};

export const returnBook = (data: ReturnRequestDTO): Promise<BorrowRecord> => {
  return request({
    url: '/borrow/return',
    method: 'post',
    data,
  });
};

export const getCurrentBorrows = (currentPage: number, pageSize: number): Promise<PageResponse<BorrowRecord>> => {
  return request({
    url: '/borrow/me',
    method: 'get',
    params: { currentPage, pageSize }
  });
};

export const getHistoryBorrows = (currentPage: number, pageSize: number): Promise<PageResponse<BorrowRecord>> => {
  return request({
    url: '/borrow/history',
    method: 'get',
    params: { currentPage, pageSize }
  });
};

export const deleteHistoryRecords = (borrowRecordIdList: string[]): Promise<void> => {
  return request({
    url: '/borrow/history',
    method: 'delete',
    data: { borrowRecordIdList }
  });
};

export const getAllBorrowRecords = (
  currentPage: number,
  pageSize: number,
  bookTitle?: string
): Promise<PageResponse<BorrowRecord>> => {
  return request({
    url: '/admin/borrow',
    method: 'get',
    params: { currentPage, pageSize, bookTitle }
  });
};

export const getAllRecordsCount = (): Promise<number> => {
  return request({
    url: '/admin/borrow/count',
    method: 'get',
  }).then((data) => {
    const raw = (data as any)?.recordsCount ?? (data as any)?.borrowCount ?? (data as any)?.totalCount ?? data;
    return Number(raw) || 0;
  });
};

export const getOverdueRate = (): Promise<number> => {
  return request({
    url: '/admin/borrow/overdue-rate',
    method: 'get',
  }).then((data) => {
    const raw = (data as any)?.overdueRate ?? data;
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  });
};

export const getReturnedRate = (): Promise<number> => {
  return request({
    url: '/admin/borrow/returned-rate',
    method: 'get',
  }).then((data) => {
    const raw = (data as any)?.returnedRate ?? data;
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  });
};