import request from '@/utils/request';
import type { LoginDTO, RegisterDTO, LoginResponse, User } from '@/types/user';

export const login = (data: LoginDTO): Promise<LoginResponse> => {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  });
};

export const register = (data: RegisterDTO): Promise<void> => {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  });
};

export const getUserInfo = (): Promise<User> => {
  return request({
    url: '/user/info',
    method: 'get',
  });
};

export const logout = (): Promise<void> => {
  return Promise.resolve(); 
};

export const getUsersCount = (): Promise<number> => {
  return request({
    url: '/admin/user/count',
    method: 'get',
  }).then((data) => {
    const payload = data as any;
    const raw = payload?.usersCount ?? payload?.count ?? payload;
    return Number(raw) || 0;
  });
};