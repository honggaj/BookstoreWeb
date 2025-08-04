import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, ReviewService } from '../../../api/services';
import { BookResponse, ReviewRequest } from '../../../api/models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: false,
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book?: BookResponse;
  books: BookResponse[] = [];
  genres: any[] = [];
  reviews: any[] = [];
  isEditing = false;
  currentUserId: number | null = null;

editingReviewId: number | null = null;

  loading = false;
  randomBooks: BookResponse[] = [];

  review: { bookId?: number; userId?: number; comment: string; rating: number } = {
    bookId: undefined,
    userId: undefined,
    comment: '',
    rating: 0
  };

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService,
     private location: Location, // 👈 thêm nè
    private router: Router) { }

  ngOnInit(): void {
  this.route.params.subscribe(params => {
    const id = +params['id'];
    if (id) {
      this.getBookDetail(id);
    }
  });

  this.loadBooks();

  // 🔐 Gán userId hiện tại từ localStorage
  const user = localStorage.getItem('user');
  this.currentUserId = user ? JSON.parse(user).userId : null;
}

  loadReviews(): void {
    if (!this.book?.bookId) return;
    this.reviewService.apiReviewBookBookIdGet$Json({ bookId: this.book.bookId }).subscribe({
      next: (res) => {
        this.reviews = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi khi tải đánh giá:', err);
      }
    });
  }
   getBookDetail(id: number): void {
    this.loading = true;
    this.bookService.apiBookIdGet$Json({ id }).subscribe({
      next: (res) => {
        this.book = res.data;
        this.loading = false;
        this.loadReviews(); // 🆕 Load review sau khi có sách
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sách:', err);
        this.loading = false;
      }
    });
  }
goBack(): void {
  this.location.back();
}


  loadBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.randomBooks = this.getRandomBooks(4); // ⬅ lấy 5 sách random
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách:', err);
        this.loading = false;
      }
    });
  }

  getRandomBooks(count: number): BookResponse[] {
    const shuffled = [...this.books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  goToDetail(bookId: number): void {
    this.router.navigate(['/user/book-detail', bookId]);
  }

  goHome(): void {
    this.router.navigate(['/user/home']);
  }
  // ...existing code...
  addToCart(): void {
    // Lấy username từ localStorage
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    const cartKey = username ? `cart_${username}` : 'cart_guest';

    // Lấy giỏ hàng hiện tại
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    cart.push(this.book);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert('🛒 Đã thêm vào giỏ hàng!');
  }
 submitReview(): void {
  const user = localStorage.getItem('user');
  if (!user) return alert('Bạn cần đăng nhập để đánh giá!');

  const userData = JSON.parse(user);
  if (!userData.userId || !this.book) return alert('Thiếu thông tin người dùng hoặc sách!');

  const review: ReviewRequest = {
    bookId: this.book.bookId,
    userId: userData.userId,
    comment: this.review.comment ?? '',
    rating: this.review.rating ?? 0
  };

  if (this.isEditing && this.editingReviewId) {
    // 👉 Cập nhật
    this.reviewService.apiReviewUpdateIdPut$Json({
      id: this.editingReviewId,
      body: review
    }).subscribe({
      next: () => {
        alert('🛠️ Đã cập nhật đánh giá!');
        this.afterReviewSubmit(userData.userId);
      },
      error: (err) => {
        console.error('Lỗi update:', err);
        alert('❌ Cập nhật thất bại!');
      }
    });
  } else {
    // 👉 Tạo mới
    this.reviewService.apiReviewCreatePost$Json({ body: review }).subscribe({
      next: () => {
        alert('✅ Đánh giá đã được gửi!');
        this.afterReviewSubmit(userData.userId);
      },
      error: (err) => {
        console.error('Lỗi tạo review:', err);
        alert('❌ Gửi đánh giá thất bại!');
      }
    });
  }
}

  editReview(r: any): void {
  this.isEditing = true;
  this.editingReviewId = r.reviewId;
  this.review.comment = r.comment;
  this.review.rating = r.rating;
}
afterReviewSubmit(userId: number): void {
  this.review = {
    bookId: this.book?.bookId,
    userId: userId,
    comment: '',
    rating: 0
  };
  this.editingReviewId = null;
  this.isEditing = false;
  this.loadReviews();
}


deleteReview(reviewId: number): void {
  const user = localStorage.getItem('user');
  if (!user) return alert('Bạn chưa đăng nhập!');
  const userId = JSON.parse(user).userId;

  if (!confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return;

  this.reviewService.apiReviewDeleteIdDelete$Json({ id: reviewId, userId }).subscribe({
    next: () => {
      alert('🗑️ Đã xóa đánh giá!');
      this.loadReviews();
    },
    error: (err) => {
      console.error('Lỗi khi xóa:', err);
      alert('❌ Không thể xóa đánh giá!');
    }
  });
}

}
