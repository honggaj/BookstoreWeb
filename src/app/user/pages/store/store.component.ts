// store.component.ts (bổ sung tìm kiếm nâng cao)
import { Component } from '@angular/core';
import { BookService, FavoriteService, GenreService } from '../../../api/services';
import { Router } from '@angular/router';
import { BookResponse, FavoriteRequest } from '../../../api/models';

@Component({
  selector: 'app-store',
  standalone: false,
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  books: BookResponse[] = [];
  genres: any[] = [];
  favoriteBookIds: number[] = [];
  loading = false;

  // 🔍 Các trường tìm kiếm nâng cao
  searchTitle: string = '';
  searchAuthor: string = '';
  searchMinPrice?: number;
  searchMaxPrice?: number;

  constructor(
    private bookService: BookService,
    private router: Router,
    private genreService: GenreService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
    this.loadFavorites();
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

  loadGenres(): void {
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        this.genres = res.data || [];
      },
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }

  loadFavorites(): void {
    const userStr = sessionStorage.getItem('user');
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

 searchAdvanced(): void {
  this.loading = true;

  const keywordParts = [];
  if (this.searchTitle) keywordParts.push(this.searchTitle);
  if (this.searchAuthor) keywordParts.push(this.searchAuthor);

  this.bookService.apiBookAdvancedSearchGet$Json({
    keyword: keywordParts.join(' '),   // ✅ Gộp title + author
    minPrice: this.searchMinPrice,
    maxPrice: this.searchMaxPrice
    // Bạn có thể thêm genreId, sortBy nếu cần
  }).subscribe({
    next: res => {
      this.books = res.data ?? [];
      this.loading = false;
    },
    error: err => {
      console.error('Lỗi tìm kiếm nâng cao:', err);
      this.loading = false;
    }
  });
}


  toggleFavorite(book: BookResponse): void {
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      alert('Bạn cần đăng nhập để yêu thích!');
      return;
    }

    const bookId = book.bookId!;
    if (this.favoriteBookIds.includes(bookId)) {
      this.favoriteService.apiFavoriteDeleteByUserBookDelete$Json({ userId: user.userId, bookId }).subscribe({
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
    const user = sessionStorage.getItem('user');
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
