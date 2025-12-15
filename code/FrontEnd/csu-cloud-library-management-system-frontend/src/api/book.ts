import request from '@/utils/request';
import type { PageResponse } from '@/types/common';
import type { Book, BookQuery, BookCreateDTO, BookUpdateDTO, TopBook } from '@/types/book';

export const getBooks = (params: BookQuery): Promise<PageResponse<Book>> => {
  return request({
    url: '/book',
    method: 'get',
    params,
  });
};

export const getBookById = (bookId: string): Promise<Book> => {
  return request({
    url: `/book/${bookId}`,
    method: 'get',
  });
};

// 后端返回结构：{ top10Books: TopBook[] }
export const getTop10Books = (): Promise<{ top10Books: TopBook[] }> => {
  return request({
    url: '/book/get/top10',
    method: 'get',
  });
};

export const createBook = (data: BookCreateDTO): Promise<Book> => {
  return request({
    url: '/book',
    method: 'post',
    data,
  });
};

export const updateBook = (bookId: string, data: BookUpdateDTO): Promise<Book> => {
  return request({
    url: `/book/${bookId}`,
    method: 'put',
    data,
  });
};

export const deleteBook = (bookId: string): Promise<void> => {
  return request({
    url: `/book/${bookId}`,
    method: 'delete',
  });
};

export const getRecommendBooks = (count: number = 3): Promise<Book[]> => {
  return request({
    url: '/book/recommend',
    method: 'get',
    params: { count }
  });
};

/**
 * 获取所有书籍总数（需要管理员权限）
 * 返回的数据结构为 { booksCount: string | number }
 */
export const getAllBooksCount = (): Promise<number> => {
  return request({
    url: '/admin/book/count',
    method: 'get',
  }).then((response) => {
    // 处理多种可能的响应结构
    const data = response?.data ?? response;
    const raw = data?.booksCount ?? data?.count ?? data?.totalCount ?? data;
    const count = Number(raw);
    return Number.isFinite(count) && count >= 0 ? count : 0;
  }).catch(() => {
    // 请求失败时返回 0
    return 0;
  });
};

/**
 * 解析书籍列表响应中的总数，支持搜索过滤和后备逻辑
 * @param query 查询参数（用于判断是否有搜索条件）
 * @param pageResponse 分页响应数据
 * @returns 总书数
 */
export const resolveBooksTotal = async (
  query?: Partial<BookQuery>,
  pageResponse?: PageResponse<Book>
): Promise<number> => {
  // 检查是否有搜索条件（过滤条件）
  const hasFilters = Boolean(query?.title || query?.author || query?.isbn);
  
  // 如果有搜索条件，使用分页响应中的 totalCount（这是搜索结果的总数）
  if (hasFilters && pageResponse?.totalCount !== undefined && Number.isFinite(pageResponse.totalCount)) {
    return pageResponse.totalCount;
  }

  // 如果没有搜索条件，总是调用全局统计接口获取所有书籍的总数
  if (!hasFilters) {
    try {
      return await getAllBooksCount();
    } catch {
      // 如果全局统计失败，退而求其次使用分页响应中的 totalCount
      if (pageResponse?.totalCount && Number.isFinite(pageResponse.totalCount)) {
        return pageResponse.totalCount;
      }
    }
  }

  // 最后的后备方案：返回当前页面的记录数
  return pageResponse?.records?.length ?? 0;
};




/**
 * 获取图书分类统计
 * 通过分页获取所有书籍，按大类进行聚合统计
 * @returns 分类统计数据，格式为 { name: string, value: number }[]
 */
export const getBooksStatisticsByCategory = async (): Promise<Array<{ name: string; value: number }>> => {
  // 别名映射：用于将不同的一级分类合并为同一个统计大类
  const aliasMap: Record<string, string> = {
    '经管': '经济管理',
    '经济': '经济管理',
    '管理': '经济管理',
    '美学': '哲学文化',
    '政治': '政治军事',
    '人文': '人文社科',
    '建筑': '建筑工程',
    '农业': '农林',
  };

  try {
    // 先获取第一页以获取总数
    const firstPage = await getBooks({ currentPage: 1, pageSize: 100 });
    const totalCount = firstPage?.totalCount || 0;

    if (totalCount <= 0) {
      return [];
    }

    // 计算需要获取的页数
    const pageSize = 100;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 获取所有书籍
    const allBooks: Book[] = [];
    for (let page = 1; page <= totalPages; page++) {
      try {
        const res = await getBooks({ currentPage: page, pageSize });
        if (res.records && res.records.length > 0) {
          allBooks.push(...res.records);
        }
      } catch (error) {
        console.warn(`获取第 ${page} 页书籍失败:`, error);
      }
    }

    // 按大类聚合统计
    const categoryMap = new Map<string, number>();
    allBooks.forEach((book) => {
      const originalCategory = book.category || '其他';
      
      // 1. 获取一级分类（取 / 之前的部分）
      let mainCategory = originalCategory.split('/')[0];
      
      // 2. 应用别名映射
      if (aliasMap[mainCategory]) {
        mainCategory = aliasMap[mainCategory];
      }
      
      // 3. 兜底处理：如果分类名为空，归为其他
      if (!mainCategory) {
        mainCategory = '其他';
      }

      categoryMap.set(mainCategory, (categoryMap.get(mainCategory) || 0) + 1);
    });

    // 转换为图表数据格式，按数量降序排序
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('获取分类统计失败:', error);
    return [];
  }
};
