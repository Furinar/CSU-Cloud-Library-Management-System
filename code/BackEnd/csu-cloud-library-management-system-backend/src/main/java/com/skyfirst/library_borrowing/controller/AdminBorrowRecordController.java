package com.skyfirst.library_borrowing.controller;

import com.skyfirst.library_borrowing.common.ApiResponse;
import com.skyfirst.library_borrowing.common.PageResponse;
import com.skyfirst.library_borrowing.exception.BusinessException;
import com.skyfirst.library_borrowing.service.IBorrowRecordService;
import com.skyfirst.library_borrowing.util.VerifyUtil;
import com.skyfirst.library_borrowing.vo.BorrowRecordVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/borrow")
public class AdminBorrowRecordController {

    @Autowired
    private IBorrowRecordService borrowRecordService;

    @PostMapping("/return/confirm")
    public ApiResponse<BorrowRecordVO> confirmReturn(@RequestBody com.skyfirst.library_borrowing.dto.ReturnRequestDTO dto) {
        VerifyUtil.isAdmin();
        BorrowRecordVO vo = borrowRecordService.confirmReturn(dto);
        return ApiResponse.success(vo);
    }

    @GetMapping
    public ApiResponse<PageResponse<BorrowRecordVO>> getAllBorrowRecords(
            @RequestParam Long currentPage,
            @RequestParam Long pageSize,
            @RequestParam(required = false) String bookTitle,
            @RequestParam(required = false) String status
    ) {
        VerifyUtil.isAdmin();
        if (currentPage == null || pageSize == null) {
            throw new BusinessException("传入的当前页码或每页大小为空，请重新传入");
        }

        PageResponse<BorrowRecordVO> response = borrowRecordService.getAllBorrowRecords(currentPage, pageSize, bookTitle, status);

        return ApiResponse.success(response);
    }

    @GetMapping("/count")
    public ApiResponse<String> getAllRecordsCount() {
        VerifyUtil.isAdmin();
        String count = borrowRecordService.getAllRecordsCount();
        return ApiResponse.success(count);
    }

    @GetMapping("/overdue-rate")
    public ApiResponse<String> getOverdueRate() {
        VerifyUtil.isAdmin();
        String overdueRate = borrowRecordService.getOverdueRate();
        return ApiResponse.success(overdueRate);
    }

    @GetMapping("/returned-rate")
    public ApiResponse<String> getReturnedRate() {
        VerifyUtil.isAdmin();
        String returnedRate = borrowRecordService.getReturnedRate();
        return ApiResponse.success(returnedRate);
    }
}
