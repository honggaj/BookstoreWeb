import { Component, Input, OnInit } from '@angular/core';
import { BookResponse, FavoriteRequest } from '../../../api/models';
import { BookService, FavoriteService } from '../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-home',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  loading = false;
  @Input() books: BookResponse[] = []; // 📥 nhận sách từ cha
  favoriteBookIds: number[] = [];

  constructor(
    private bookService: BookService,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadFavorites(); // 💖 Load yêu thích
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

  loadFavorites(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    this.favoriteService.apiFavoriteUserUserIdGet$Json({ userId: user.userId }).subscribe({
      next: res => {
        this.favoriteBookIds = (res.data ?? [])
          .map(f => f.bookId)
          .filter((id): id is number => id !== undefined);
      },
      error: err => console.error('Lỗi load yêu thích:', err)
    });
  }

  toggleFavorite(book: BookResponse): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      alert('Bạn cần đăng nhập để yêu thích!');
      return;
    }

    const bookId = book.bookId!;
    if (this.favoriteBookIds.includes(bookId)) {
      this.favoriteService.apiFavoriteDeleteByUserBookDelete$Json({
        userId: user.userId,
        bookId
      }).subscribe({
        next: () => {
          this.favoriteBookIds = this.favoriteBookIds.filter(id => id !== bookId);
          alert('❌ Đã xoá khỏi yêu thích');
        },
        error: () => alert('Lỗi khi xoá khỏi yêu thích')
      });
    } else {
      const request: FavoriteRequest = { userId: user.userId, bookId };
      this.favoriteService.apiFavoriteAddPost$Json({ body: request }).subscribe({
        next: res => {
          if (res.success) {
            this.favoriteBookIds.push(bookId);
            alert('❤️ Đã thêm vào yêu thích!');
          } else {
            alert(res.message);
          }
        },
        error: err => {
          console.error('Lỗi thêm yêu thích:', err);
          alert('❌ Lỗi khi thêm vào yêu thích!');
        }
      });
    }
  }

  goToDetail(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  addToCart(book: BookResponse): void {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    const cartKey = username ? `cart_${username}` : 'cart_guest';

    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existing = cart.find((item: any) => item.bookId === book.bookId);
    if (existing) {
      existing.quantity = (existing.quantity ?? 1) + 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert('🛒 Đã thêm vào giỏ hàng!');
  }
}
