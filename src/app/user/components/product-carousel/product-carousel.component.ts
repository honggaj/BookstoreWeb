import { Component } from '@angular/core';
import { BookService, FavoriteService } from '../../../api/services';
import { Router } from '@angular/router';
import { BookResponse, FavoriteRequest } from '../../../api/models';

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
      error: (err) => {
        console.error('Lỗi khi lấy sách:', err);
        this.loading = false;
      }
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

  toggleFavorite(book: BookResponse): void {
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      alert('Bạn cần đăng nhập để yêu thích!');
      return;
    }

    const bookId = book.bookId;

    if (this.favoriteBookIds.includes(bookId!)) {
      // Đã yêu thích → Xóa
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
      // Chưa yêu thích → Thêm
      const request: FavoriteRequest = { userId: user.userId, bookId };
      this.favoriteService.apiFavoriteAddPost$Json({ body: request }).subscribe({
        next: res => {
          if (res.success) {
            this.favoriteBookIds.push(bookId!);
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
