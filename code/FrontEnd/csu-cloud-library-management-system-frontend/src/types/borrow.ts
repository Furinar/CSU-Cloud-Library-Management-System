export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

export interface BorrowRequestDTO {
  bookId: string;
  borrowTime: number; // 1, 3, 7, 14, 30, 60, 90
}

export interface ReturnRequestDTO {
  borrowRecordId: string;
}
