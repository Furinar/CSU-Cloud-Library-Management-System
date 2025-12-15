package com.skyfirst.library_borrowing.controller;

import com.skyfirst.library_borrowing.common.ApiResponse;
import com.skyfirst.library_borrowing.common.PageResponse;
import com.skyfirst.library_borrowing.common.ResultCode;
import com.skyfirst.library_borrowing.common.context.BaseContext;
import com.skyfirst.library_borrowing.dto.*;
import com.skyfirst.library_borrowing.entity.User;
import com.skyfirst.library_borrowing.exception.BusinessException;
import com.skyfirst.library_borrowing.service.IUserService;
import com.skyfirst.library_borrowing.util.JwtUtils;
import com.skyfirst.library_borrowing.vo.LoginVO;
import com.skyfirst.library_borrowing.vo.RegisterVO;
import com.skyfirst.library_borrowing.vo.UserVO;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 用户表 前端控制器
 * </p>
 *
 * @author starnighter
 * @since 2025-11-08
 */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final IUserService userService;

    @Autowired
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ApiResponse<LoginVO> login(@RequestBody UserLoginDTO loginDTO){
        User loginuser = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
        if(loginuser == null){
            return ApiResponse.failed(ResultCode.PASSWORD_ERROR);
        }
        Map<String,Object> claims = new HashMap<>();
        claims.put("userId",loginuser.getId());
        claims.put("role",loginuser.getRole());
        String token = jwtUtils.generateJwt(claims);
        UserVO userVO = UserVO.builder()
                .id(String.valueOf(loginuser.getId()) )
                .username(loginuser.getUserName())
                .email(loginuser.getEmail())
                .role(loginuser.getRole())
                .isDeleted(Boolean.TRUE.equals(loginuser.getIsDeleted()) ? 1 : 0)
                .build();
        LoginVO loginVO = LoginVO.builder()
                .userInfo(userVO)
                .token(token)
                .build();
        return ApiResponse.success(loginVO);
    }

    @PostMapping("/register")
    public ApiResponse<RegisterVO> register(@RequestBody UserRegisterDTO userDTO){
        User user = User.builder()
                .userName(userDTO.getUsername())
                .password(userDTO.getPassword())
                .email(userDTO.getEmail())
                .role("user")
                .build();
        try{
            boolean result = userService.register(user);
            if(!result){
                throw new BusinessException("注册失败");
            }

            RegisterVO registerVO = RegisterVO.builder()
                    .id(String.valueOf(user.getId()))
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .createTime(LocalDateTime.now())
                    .build();
            return ApiResponse.success(registerVO,"注册成功");
        }catch (BusinessException e){
            return ApiResponse.failed(e.getCode(),e.getMessage());
        }
    }

    @GetMapping("/info")
    public ApiResponse<UserVO> info(){
        Long id = BaseContext.getCurrentId();
        User user = userService.getUserInfo(id);
        if (user == null) {
            return ApiResponse.success(null);
        }
        UserVO userVO = UserVO.builder()
                .id(String.valueOf(user.getId()) )
                .username(user.getUserName())
                .email(user.getEmail())
                .role(user.getRole())
                .isDeleted(Boolean.TRUE.equals(user.getIsDeleted()) ? 1 : 0)
                .build();
        return ApiResponse.success(userVO);
    }

    @GetMapping("/list")
    public ApiResponse<PageResponse<UserVO>> listUsers(
            @RequestParam(defaultValue = "1") Long currentPage,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.success(userService.getUsers(currentPage, pageSize, keyword));
    }

    @PutMapping("/status/{id}")
    public ApiResponse<Void> updateUserStatus(@PathVariable Long id, @RequestBody UserStatusDTO statusDTO) {
        userService.updateUserStatus(id, statusDTO.getStatus());
        return ApiResponse.success(null);
    }

    @PutMapping("/password")
    public ApiResponse<Void> updatePassword(@RequestBody UserPasswordDTO passwordDTO) {
        Long id = BaseContext.getCurrentId();
        userService.updatePassword(id, passwordDTO.getOldPassword(), passwordDTO.getNewPassword());
        return ApiResponse.success(null);
    }

    @PutMapping("/profile")
    public ApiResponse<Void> updateProfile(@RequestBody UserProfileDTO profileDTO) {
        Long id = BaseContext.getCurrentId();
        userService.updateProfile(id, profileDTO.getEmail());
        return ApiResponse.success(null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@RequestBody UserResetPasswordDTO resetDTO) {
        userService.resetPassword(resetDTO.getEmail(), resetDTO.getNewPassword());
        return ApiResponse.success(null);
    }

}
