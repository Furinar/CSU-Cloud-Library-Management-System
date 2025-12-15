import request from '@/utils/request';

export const getUserList = (params: any) => {
  return request({
    url: '/user/list',
    method: 'get',
    params
  });
};

export const updateUserStatus = (id: string, status: number) => {
  return request({
    url: `/admin/user/${id}/status`,
    method: 'put',
    data: { status }
  });
};

export const updatePassword = (data: any) => {
  return request({
    url: '/user/password',
    method: 'put',
    data
  });
};

export const updateProfile = (data: any) => {
  return request({
    url: '/user/profile',
    method: 'put',
    data
  });
};

export const resetPassword = (data: any) => {
  return request({
    url: '/user/reset-password',
    method: 'post',
    data
  });
};
