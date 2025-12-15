package com.skyfirst.library_borrowing.service;

import com.skyfirst.library_borrowing.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 用户表 服务类
 * </p>
 *
 * @author starnighter
 * @since 2025-11-08
 */
public interface IUserService extends IService<User> {
    public User login(String userName,String password);

    public boolean register(User user);

    public User getUserInfo(Long userId);

    String getAllUsersCount();

    com.skyfirst.library_borrowing.common.PageResponse<com.skyfirst.library_borrowing.vo.UserVO> getUsers(Long currentPage, Long pageSize, String keyword);

    void updateUserStatus(Long userId, Integer status);

    void updatePassword(Long userId, String oldPassword, String newPassword);

    void updateProfile(Long userId, String email);

    void resetPassword(String email, String newPassword);
}
