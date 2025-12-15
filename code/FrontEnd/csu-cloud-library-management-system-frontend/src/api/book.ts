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
    url: '/admin/book',
    method: 'post',
    data,
  });
};

export const updateBook = (bookId: string, data: BookUpdateDTO): Promise<Book> => {
  return request({
    url: `/admin/book/${bookId}`,
    method: 'put',
    data,
  });
};

export const deleteBooks = (bookIdList: string[]): Promise<void> => {
  return request({
    url: '/admin/book',
    method: 'delete',
    data: { bookIdList },
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


export const getRecommendBooks = async (): Promise<Book[]> => {
  const res = await getBooks({ currentPage: 1, pageSize: 5 });
  return res.records ? res.records.slice(0, 5) : [];
};

/**
 * 获取图书分类统计
 * 通过分页获取所有书籍，按大类进行聚合统计
 * @returns 分类统计数据，格式为 { name: string, value: number }[]
 */
export const getBooksStatisticsByCategory = async (): Promise<Array<{ name: string; value: number }>> => {
  // 分类映射：将细分类别映射为大类
  // 分类原则：一级大类聚合，将所有二级细分类别合并为对应的一级大类
  const categoryMapping: Record<string, string> = {
    // 计算机相关 (编程、框架、工具、中间件、AI、大数据、安全等)
    '计算机/编程': '计算机',
    '计算机/软件工程': '计算机',
    '计算机/网络': '计算机',
    '计算机/AI': '计算机',
    '计算机/算法': '计算机',
    '计算机/随笔': '计算机',
    '计算机/数据库': '计算机',
    '计算机/面试': '计算机',
    '计算机/系统': '计算机',
    '计算机/框架': '计算机',
    '计算机/容器': '计算机',
    '计算机/工具': '计算机',
    '计算机/脚本': '计算机',
    '计算机/服务器': '计算机',
    '计算机/搜索引擎': '计算机',
    '计算机/移动开发': '计算机',
    '计算机/架构': '计算机',
    '计算机/中间件': '计算机',
    '计算机/大数据': '计算机',
    '计算机/安全': '计算机',
    '计算机': '计算机',
    
    // 文学相关 (小说、科幻、经典、悬疑等)
    '文学/科幻': '文学',
    '文学/小说': '文学',
    '文学/经典': '文学',
    '文学/童话': '文学',
    '文学/悬疑': '文学',
    '文学/散文': '文学',
    '文学/戏剧': '文学',
    '文学': '文学',
    
    // 历史相关 (通史、通俗、传记、明清、三国、宗教等)
    '历史/科普': '历史',
    '历史/通俗': '历史',
    '历史/通史': '历史',
    '历史/经典': '历史',
    '历史/明清': '历史',
    '历史/小说': '历史',
    '历史/三国': '历史',
    '历史/宗教': '历史',
    '历史/人物': '历史',
    '历史': '历史',
    
    // 心理学相关 (成长、情感、社会、经济、营销等)
    '心理学/经济': '心理学',
    '心理学/营销': '心理学',
    '心理学/成长': '心理学',
    '心理学/情感': '心理学',
    '心理学/社会': '心理学',
    '心理学/通俗': '心理学',
    '心理学/幸福': '心理学',
    '心理学': '心理学',
    
    // 经济管理相关 (理财、创业、管理、投资、营销等)
    '经管/个人成长': '经济管理',
    '经管/智慧': '经济管理',
    '经管/理财': '经济管理',
    '经管/营销': '经济管理',
    '经管/创业': '经济管理',
    '经管/管理': '经济管理',
    '经管/投资': '经济管理',
    '经管': '经济管理',
    '经济/管理': '经济管理',
    '经济/理财': '经济管理',
    '经济': '经济管理',
    '管理': '经济管理',
    
    // 科普相关 (物理、生物、数学、综合)
    '科普/物理': '科普',
    '科普/生物': '科普',
    '科普/数学': '科普',
    '科普/综合': '科普',
    '科普': '科普',
    
    // 哲学相关 (经典、通俗)
    '哲学/经典': '哲学',
    '哲学/通俗': '哲学',
    '哲学': '哲学',
    
    // 美学相关
    '美学/经典': '哲学文化',
    '美学': '哲学文化',
    
    // 社会学相关
    '社会学/经典': '社会学',
    '社会学': '社会学',
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
      // 使用映射表将细分类别转换为大类
      const originalCategory = book.category || '其他';
      const mainCategory = categoryMapping[originalCategory] || '文学';
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
