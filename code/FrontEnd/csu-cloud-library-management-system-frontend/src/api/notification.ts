import request from '@/utils/request';
import type { PageResponse } from '@/types/common';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'DUE_REMINDER' | 'OVERDUE_NOTICE' | 'COMMON';
  status: 'UNREAD' | 'READ';
  gmtCreate: string;
}

export interface NotificationQuery {
  currentPage?: number;
  pageSize?: number;
}

export interface NotificationPushDTO {
  title: string;
  content: string;
  type: 'COMMON' | 'DUE_REMINDER' | 'OVERDUE_NOTICE';
  status: 'UNREAD' | 'READ';
}

export const getNotifications = (params: NotificationQuery): Promise<PageResponse<Notification>> => {
  return request({
    url: '/notification/me',
    method: 'get',
    params,
  });
};

export const getUnreadCount = (): Promise<number> => {
  return request({
    url: '/notification/unread-count',
    method: 'get',
  }).then((data) => {
    const raw = (data as any)?.count ?? data;
    return Number(raw) || 0;
  });
};

export const readNotifications = (readBooks: { notificationIdList: string[] }): Promise<void> => {
  return request({
    url: '/notification/read',
    method: 'put',
    data: readBooks,
  });
};

export const pushNotification2All = (data: NotificationPushDTO): Promise<void> => {
  return request({
    url: '/admin/notification/push-all',
    method: 'post',
    data,
  });
};

export const pushNotification2User = (userName: string, data: NotificationPushDTO): Promise<void> => {
  return request({
    url: `/admin/notification/push/${userName}`,
    method: 'post',
    data,
  });
};
