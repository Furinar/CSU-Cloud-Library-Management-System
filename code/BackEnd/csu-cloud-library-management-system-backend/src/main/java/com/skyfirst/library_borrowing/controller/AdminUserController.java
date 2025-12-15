package com.skyfirst.library_borrowing.controller;

import com.skyfirst.library_borrowing.common.ApiResponse;
import com.skyfirst.library_borrowing.dto.UserStatusDTO;
import com.skyfirst.library_borrowing.service.IUserService;
import com.skyfirst.library_borrowing.util.VerifyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    @Autowired
    private IUserService userService;

    @GetMapping("/count")
    public ApiResponse<String> getAllUsersCount() {
        VerifyUtil.isAdmin();
        String usersCount = userService.getAllUsersCount();
        return ApiResponse.success(usersCount);
    }

    @PutMapping("/{userId}/status")
    public ApiResponse<Void> updateUserStatus(@PathVariable Long userId, @RequestBody UserStatusDTO userStatusDTO) {
        VerifyUtil.isAdmin();
        userService.updateUserStatus(userId, userStatusDTO.getStatus());
        return ApiResponse.success(null);
    }

}
