import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookResponse, FavoriteRequest } from '../../../api/models';
import { BookService, FavoriteService } from '../../../api/services';

@Component({
  selector: 'app-search-page',
  standalone: false,
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit {
  keyword: string = '';
  books: BookResponse[] = [];
  loading = true;
  favoriteBookIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.fetchBooks();
      this.loadFavorites();
    });
  }

  fetchBooks(): void {
    if (!this.keyword.trim()) return;
    this.loading = true;
    this.bookService.apiBookSearchGet$Json({ keyword: this.keyword }).subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tìm kiếm sách:', err);
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
      this.favoriteService.apiFavoriteUserBookDelete$Json({
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
      this.favoriteService.apiFavoritePost$Json({ body: request }).subscribe({
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
