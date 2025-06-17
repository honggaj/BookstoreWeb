import { Component } from '@angular/core';
import { BookService, GenreService } from '../../../api/services';
import { Router } from '@angular/router';
import { BookResponse } from '../../../api/models';

@Component({
  selector: 'app-store',
  standalone: false,
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
 books: BookResponse[] = [];
  loading = false;
  genres: any[] = [];
 

  constructor(private bookService: BookService, private router: Router, private genreService: GenreService) {
   

  } // ✅ bookService viết đúng tên

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
  }
  loadGenres(): void {
    this.loading = true;
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        this.genres = res.data || [];
      },
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }
  loadBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách:', err);
        this.loading = false;
      }
    });
  }
  loadBooksByGenre(genreId: number): void {
    this.loading = true;
    this.bookService.apiBookByGenreGenreIdGet$Json({ genreId }).subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách theo thể loại:', err);
        this.loading = false;
      }
    });
  }

  goToDetail(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }
   addToCart(book: BookResponse): void {
  const user = sessionStorage.getItem('user');
  const username = user ? JSON.parse(user).username : null;
  const cartKey = username ? `cart_${username}` : 'cart_guest';

  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

  // Nếu đã có bookId thì tăng số lượng
  const existing = cart.find((item: any) => item.bookId === book.bookId);
  if (existing) {
    existing.quantity = (existing.quantity ?? 1) + 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  window.dispatchEvent(new Event('storage')); // 🔥 Cập nhật số giỏ hàng trên header
  alert('🛒 Đã thêm vào giỏ hàng!');
}

}