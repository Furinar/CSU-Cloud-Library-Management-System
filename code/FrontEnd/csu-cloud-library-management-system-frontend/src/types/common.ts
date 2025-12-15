export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPage?: number;
  totalCount?: number;
  total?: number;  // 后端可能返回 total 字段
  recordsCount?: number;  // 后端可能返回 recordsCount
  records: T[];
}

