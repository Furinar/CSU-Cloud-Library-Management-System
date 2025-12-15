package com.skyfirst.library_borrowing.controller;

import com.skyfirst.library_borrowing.common.ApiResponse;
import com.skyfirst.library_borrowing.dto.NotificationPushDTO;
import com.skyfirst.library_borrowing.exception.BusinessException;
import com.skyfirst.library_borrowing.service.INotificationService;
import com.skyfirst.library_borrowing.util.VerifyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/notification")
public class AdminNotificationController {

    @Autowired
    private INotificationService notificationService;

    @GetMapping("/list")
    public ApiResponse<com.skyfirst.library_borrowing.common.PageResponse<com.skyfirst.library_borrowing.vo.NotificationVO>> getAllNotifications(
            @RequestParam Long currentPage,
            @RequestParam Long pageSize,
            @RequestParam(required = false) String keyword) {
        VerifyUtil.isAdmin();
        if (currentPage == null || pageSize == null) {
            throw new BusinessException("传入的当前页码或每页大小为空，请重新传入");
        }

        java.util.List<com.skyfirst.library_borrowing.vo.NotificationVO> vo = notificationService.getAllNotifications(currentPage, pageSize, keyword);
        return ApiResponse.success(new com.skyfirst.library_borrowing.common.PageResponse<>(currentPage, pageSize, vo));
    }

    @PostMapping("/push-all")
    public ApiResponse<Void> pushNotification2All(@RequestBody NotificationPushDTO dto) {
        VerifyUtil.isAdmin();
        if (dto == null) {
            throw new BusinessException("传入的通知信息为空，请重新传入");
        }
        notificationService.pushNotification2All(dto);

        return ApiResponse.success();
    }

    @PostMapping("/push/{userName}")
    public ApiResponse<Void> pushNotification2User(@PathVariable String userName, @RequestBody NotificationPushDTO dto) {
        VerifyUtil.isAdmin();
        if (dto == null || userName == null) {
            throw new BusinessException("传入的通知信息或用户名为空，请重新传入");
        }

        notificationService.pushNotification2User(userName, dto);

        return ApiResponse.success();
    }
}
