import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, GenreService } from '../../../api/services';
import { BookResponse } from '../../../api/models';

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
  loading = false;
  randomBooks: BookResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
  private router:Router  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getBookDetail(+id);
    }

    this.loadBooks();
  }

  getBookDetail(id: number): void {
    this.loading = true;
    this.bookService.apiBookIdGet$Json({ id }).subscribe({
      next: (res) => {
        this.book = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sách:', err);
        this.loading = false;
      }
    });
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
    this.router.navigate(['/book', bookId]);
  }

  goHome(): void {
  this.router.navigate(['/user/home']);
}
// ...existing code...
  addToCart(): void {
    // Lấy username từ sessionStorage
    const user = sessionStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    const cartKey = username ? `cart_${username}` : 'cart_guest';

    // Lấy giỏ hàng hiện tại
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    cart.push(this.book);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert('🛒 Đã thêm vào giỏ hàng!');
  }
  // ...existing code...
}
