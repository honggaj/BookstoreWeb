import { Component } from '@angular/core';
import { BookService, FavoriteService } from '../../../api/services';
import { Router } from '@angular/router';
import { BookResponse, FavoriteRequest } from '../../../api/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-carousel',
  standalone: false,
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent {
  books: BookResponse[] = [];
  favoriteBookIds: number[] = [];
  loading = false;

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  constructor(
    private bookService: BookService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadFavorites();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Lỗi', 'Không thể tải sách!', 'error');
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
      error: () => Swal.fire('Lỗi', 'Không thể tải danh sách yêu thích!', 'error')
    });
  }

  toggleFavorite(book: BookResponse): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      Swal.fire('Thông báo', 'Bạn cần đăng nhập để yêu thích!', 'warning');
      return;
    }

    const bookId = book.bookId!;

    if (this.favoriteBookIds.includes(bookId)) {
      // Xóa khỏi yêu thích
      this.favoriteService.apiFavoriteUserBookDelete$Json({
        userId: user.userId,
        bookId
      }).subscribe({
        next: () => {
          this.favoriteBookIds = this.favoriteBookIds.filter(id => id !== bookId);
          Swal.fire('Đã xoá', `"${book.title}" đã xoá khỏi yêu thích ❌`, 'success');
        },
        error: () => Swal.fire('Lỗi', 'Không thể xoá khỏi yêu thích!', 'error')
      });
    } else {
      // Thêm vào yêu thích
      const request: FavoriteRequest = { userId: user.userId, bookId };
      this.favoriteService.apiFavoritePost$Json({ body: request }).subscribe({
        next: res => {
          if (res.success) {
            this.favoriteBookIds.push(bookId);
            Swal.fire('Thành công', `"${book.title}" đã thêm vào yêu thích ❤️`, 'success');
          } else {
Swal.fire('Thông báo', res.message ?? '', 'info');
          }
        },
        error: () => Swal.fire('Lỗi', 'Không thể thêm vào yêu thích!', 'error')
      });
    }
  }

  goToDetail(bookId: number): void {
    this.router.navigate(['/user/book-detail', bookId]);
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

    Swal.fire({
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng 🛒',
      showConfirmButton: false,
      timer: 1500
    });
  }

  filterBooks(type: 'latest' | 'top-rated' | 'best-seller'): void {
    this.loading = true;

    let request$;
    switch (type) {
      case 'latest':
        request$ = this.bookService.apiBookLatestGet$Json();
        break;
      case 'top-rated':
        request$ = this.bookService.apiBookTopRatedGet$Json();
        break;
      case 'best-seller':
        request$ = this.bookService.apiBookBestSellersGet$Json();
        break;
      default:
        request$ = this.bookService.apiBookGet$Json();
    }

    request$.subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Lỗi', 'Không thể lọc sách!', 'error');
      }
    });
  }
}
