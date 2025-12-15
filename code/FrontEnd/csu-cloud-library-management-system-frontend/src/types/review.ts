export interface Review {
  id: string;
  bookId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  gmtCreate: string;
}

export interface CreateReviewDTO {
  bookId: string;
  rating: number;
  comment: string;
}