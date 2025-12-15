package com.skyfirst.library_borrowing.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skyfirst.library_borrowing.common.PageResponse;
import com.skyfirst.library_borrowing.entity.User;
import com.skyfirst.library_borrowing.exception.BusinessException;
import com.skyfirst.library_borrowing.mapper.UserMapper;
import com.skyfirst.library_borrowing.service.IUserService;
import com.skyfirst.library_borrowing.vo.UserVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author starnighter
 * @since 2025-11-08
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    private final UserMapper userMapper;


    @Override
    public User login(String userName, String password) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUserName, userName);
        User user = userMapper.selectOne(queryWrapper);

        if(user == null){
            throw new BusinessException("用户名或密码错误");
        }

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new BusinessException("账号已被封禁，请联系管理员");
        }

        String encryptedInput = DigestUtils.md5DigestAsHex(password.getBytes());
        if(!encryptedInput.equals(user.getPassword())){
            throw new BusinessException("用户名或密码错误");
        }

        return user;
    }

    @Override
    public boolean register(User user) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUserName, user.getUserName());
        Long count = userMapper.selectCount(queryWrapper);
        if(count>0){
            throw new BusinessException("用户名已存在");
        }


        String encryptedPassword = DigestUtils.md5DigestAsHex(user.getPassword().getBytes());
        user.setPassword(encryptedPassword);
        user.setIsDeleted(false);


        return save(user);
    }

    @Override
    public User getUserInfo(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public String getAllUsersCount() {
        return query().eq("is_deleted",0).count().toString();
    }

    @Override
    public PageResponse<UserVO> getUsers(Long currentPage, Long pageSize, String keyword) {
        Page<User> page = new Page<>(currentPage, pageSize);
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.like(User::getUserName, keyword)
                    .or()
                    .like(User::getEmail, keyword);
        }
        
        Page<User> userPage = userMapper.selectPage(page, queryWrapper);
        
        List<UserVO> userVOs = userPage.getRecords().stream().map(user -> UserVO.builder()
                .id(String.valueOf(user.getId()))
                .username(user.getUserName())
                .email(user.getEmail())
                .role(user.getRole())
                .isDeleted(Boolean.TRUE.equals(user.getIsDeleted()) ? 1 : 0)
                .build()).collect(Collectors.toList());
                
        return new PageResponse<>(currentPage, pageSize, userVOs);
    }

    @Override
    public void updateUserStatus(Long userId, Integer status) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setIsDeleted(status != null && status == 1);
        userMapper.updateById(user);
    }

    @Override
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        String encryptedOld = DigestUtils.md5DigestAsHex(oldPassword.getBytes());
        if (!encryptedOld.equals(user.getPassword())) {
            throw new BusinessException("旧密码错误");
        }
        String encryptedNew = DigestUtils.md5DigestAsHex(newPassword.getBytes());
        user.setPassword(encryptedNew);
        userMapper.updateById(user);
    }

    @Override
    public void updateProfile(Long userId, String email) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setEmail(email);
        userMapper.updateById(user);
    }

    @Override
    public void resetPassword(String email, String newPassword) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getEmail, email);
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            throw new BusinessException("该邮箱未注册用户");
        }
        String encryptedNew = DigestUtils.md5DigestAsHex(newPassword.getBytes());
        user.setPassword(encryptedNew);
        userMapper.updateById(user);
    }
}
