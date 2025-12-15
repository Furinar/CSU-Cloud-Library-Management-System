package com.skyfirst.library_borrowing.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skyfirst.library_borrowing.common.PageResponse;
import com.skyfirst.library_borrowing.common.context.BaseContext;
import com.skyfirst.library_borrowing.dto.BorrowRequestDTO;
import com.skyfirst.library_borrowing.dto.HistoryRecordsDeleteDTO;
import com.skyfirst.library_borrowing.dto.ReturnRequestDTO;
import com.skyfirst.library_borrowing.entity.Book;
import com.skyfirst.library_borrowing.entity.BorrowRecord;
import com.skyfirst.library_borrowing.entity.User;
import com.skyfirst.library_borrowing.exception.BusinessException;
import com.skyfirst.library_borrowing.mapper.BookMapper;
import com.skyfirst.library_borrowing.mapper.BorrowRecordMapper;
import com.skyfirst.library_borrowing.mapper.UserMapper;
import com.skyfirst.library_borrowing.service.IBorrowRecordService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.skyfirst.library_borrowing.vo.BorrowRecordVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * <p>
 * 借阅记录表 服务实现类
 * </p>
 *
 * @author starnighter
 * @since 2025-11-08
 */
@Service
public class BorrowRecordServiceImpl extends ServiceImpl<BorrowRecordMapper, BorrowRecord> implements IBorrowRecordService {

    @Autowired
    private BookMapper bookMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional
    public BorrowRecordVO borrowBookById(BorrowRequestDTO dto) {
        if (dto == null || dto.getBookId() == null || dto.getBookId().isEmpty() || dto.getBorrowTime() == null) {
            throw new BusinessException("借阅书籍请求对象为空或未传递所需数据");
        }

        Long bookId = Long.parseLong(dto.getBookId());
        Long userId = BaseContext.getCurrentId();
        Integer borrowTime = dto.getBorrowTime();
        LocalDateTime now = LocalDateTime.now();

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setBookId(bookId);
        borrowRecord.setUserId(userId);
        borrowRecord.setBorrowDate(now);
        borrowRecord.setDueDate(now.plusDays(borrowTime));
        borrowRecord.setStatus("BORROWED");
        if (!save(borrowRecord)) {
            throw new BusinessException("保存借阅书籍失败，请重试");
        }

        // 减少库存
        Book book = bookMapper.selectById(bookId);
        if (book != null && book.getAvailableStock() > 0) {
            book.setAvailableStock(book.getAvailableStock() - 1);
            bookMapper.updateById(book);
        } else {
            throw new BusinessException("库存不足，无法借阅");
        }

        return borrowRecord2VO(borrowRecord,bookId);
    }

    @Override
    @Transactional
    public BorrowRecordVO returnBookByBorrowId(ReturnRequestDTO dto) {
        if (dto == null || dto.getBorrowRecordId() == null || dto.getBorrowRecordId().isEmpty()) {
            throw new BusinessException("传入的归还数据为空或借阅ID为空");
        }
        boolean success = update().eq("id", Long.parseLong(dto.getBorrowRecordId()))
                .set("status", "RETURN_PENDING")
                .update();
        if (!success) {
            throw new BusinessException("申请归还书籍失败，请重试");
        }
        BorrowRecord borrowRecord = query().eq("id", Long.parseLong(dto.getBorrowRecordId())).one();

        return borrowRecord2VO(borrowRecord, borrowRecord.getBookId());
    }

    @Override
    @Transactional
    public BorrowRecordVO confirmReturn(ReturnRequestDTO dto) {
        if (dto == null || dto.getBorrowRecordId() == null || dto.getBorrowRecordId().isEmpty()) {
            throw new BusinessException("传入的归还数据为空或借阅ID为空");
        }
        boolean success = update().eq("id", Long.parseLong(dto.getBorrowRecordId()))
                .set("return_date", LocalDateTime.now())
                .set("status", "RETURNED")
                .update();
        if (!success) {
            throw new BusinessException("确认归还书籍失败，请重试");
        }
        BorrowRecord borrowRecord = query().eq("id", Long.parseLong(dto.getBorrowRecordId())).one();

        // 增加库存
        Book book = bookMapper.selectById(borrowRecord.getBookId());
        if (book != null) {
            book.setAvailableStock(book.getAvailableStock() + 1);
            bookMapper.updateById(book);
        }

        return borrowRecord2VO(borrowRecord, borrowRecord.getBookId());
    }

    @Override
    public PageResponse<BorrowRecordVO> getCurrentBorrowRecords(Long currentPage, Long pageSize) {
        Page<BorrowRecord> page = new Page<>(currentPage, pageSize);
        Long userId = BaseContext.getCurrentId();

        List<BorrowRecord> borrowRecords = query()
                .eq("user_id", userId)
                .ne("status", "RETURNED")
                .last("ORDER BY CASE WHEN status = 'OVERDUE' OR due_date < NOW() THEN 0 ELSE 1 END, borrow_date DESC")
                .page(page)
                .getRecords();

        if (borrowRecords == null || borrowRecords.isEmpty()) {
            return new PageResponse<>(currentPage, pageSize, Collections.emptyList(), 0L);
        }

        List<BorrowRecordVO> vos = borrowRecords.stream()
                .map(borrowRecord -> borrowRecord2VO(borrowRecord, borrowRecord.getBookId()))
                .toList();
        
        return new PageResponse<>(currentPage, pageSize, vos, page.getTotal());
    }

    @Override
    public PageResponse<BorrowRecordVO> getHistoryBorrowRecords(Long currentPage, Long pageSize) {
        Page<BorrowRecord> page = new Page<>(currentPage, pageSize);
        Long userId = BaseContext.getCurrentId();

        List<BorrowRecord> borrowRecords = query()
                .eq("user_id", userId)
                .eq("status", "RETURNED")
                .orderByDesc("borrow_date")
                .page(page)
                .getRecords();

        if (borrowRecords == null || borrowRecords.isEmpty()) {
            return new PageResponse<>(currentPage, pageSize, Collections.emptyList(), 0L);
        }

        List<BorrowRecordVO> vos = borrowRecords.stream()
                .map(borrowRecord -> borrowRecord2VO(borrowRecord, borrowRecord.getBookId()))
                .toList();

        return new PageResponse<>(currentPage, pageSize, vos, page.getTotal());
    }

    @Override
    @Transactional
    public void deleteHistoryRecords(HistoryRecordsDeleteDTO dto) {
        if (dto == null || dto.getBorrowRecordIdList() == null || dto.getBorrowRecordIdList().isEmpty()) {
            throw new BusinessException("传入的历史数据为空，请重新传入");
        }
        List<BorrowRecord> borrowRecords = listByIds(dto.getBorrowRecordIdList());

        if (borrowRecords == null || borrowRecords.isEmpty()) {
            throw new BusinessException("传入的借阅记录ID错误，请重新传入");
        }

        List<Long> filterIdList = borrowRecords.stream()
                .filter(record -> "RETURNED".equals(record.getStatus()))
                .map(BorrowRecord::getId)
                .toList();
        if (!removeBatchByIds(filterIdList)) {
            throw new BusinessException("批量删除历史借阅记录失败，请重试");
        }
    }

    @Override
    public PageResponse<BorrowRecordVO> getAllBorrowRecords(Long currentPage, Long pageSize, String bookTitle, String status) {
        Page<BorrowRecord> page = new Page<>(currentPage, pageSize);

        boolean condition = bookTitle != null && !bookTitle.isEmpty();
        boolean statusCondition = status != null && !status.isEmpty();
        query()
                .like(condition, "book_title", bookTitle)
                .last("ORDER BY CASE WHEN status = 'RETURN_PENDING' THEN 0 ELSE 1 END, borrow_date DESC")
                .eq(statusCondition, "status", status)
                .page(page);

        List<BorrowRecord> borrowRecords = page.getRecords();

        if (borrowRecords == null || borrowRecords.isEmpty()) {
            return new PageResponse<>(currentPage, pageSize, Collections.emptyList(), 0L);
        }

        List<BorrowRecordVO> vos = borrowRecords.stream()
                .map(borrowRecord -> borrowRecord2VO(borrowRecord, borrowRecord.getBookId()))
                .toList();

        return new PageResponse<>(currentPage, pageSize, vos, page.getTotal());
    }

    @Override
    public String getAllRecordsCount() {
        return query().count().toString();
    }

    @Override
    public String getOverdueRate() {
        Long allCount = query().count();
        Long overDueCount = query().eq("status", "OVERDUE").count();
        double overDueRate = overDueCount.doubleValue() / allCount;

        return Double.toString(overDueRate * 100);
    }

    @Override
    public String getReturnedRate() {
        Long allCount = query().count();
        Long returnedCount = query().eq("status", "RETURNED").count();
        double returnedRate = returnedCount.doubleValue() / allCount;

        return Double.toString(returnedRate * 100);
    }

    private BorrowRecordVO borrowRecord2VO(BorrowRecord borrowRecord, Long bookId) {
        Book book = bookMapper.selectById(bookId);
        User user = userMapper.selectById(borrowRecord.getUserId());
        BorrowRecordVO vo = new BorrowRecordVO();
        BeanUtils.copyProperties(borrowRecord, vo);
        vo.setId(borrowRecord.getId().toString());
        vo.setBookId(bookId.toString());
        vo.setBookTitle(book.getTitle());
        vo.setBookCoverUrl(book.getCoverUrl());
        if (user != null) {
            vo.setUserId(user.getId().toString());
            vo.setUserName(user.getUserName());
        }
        return vo;
    }
}
