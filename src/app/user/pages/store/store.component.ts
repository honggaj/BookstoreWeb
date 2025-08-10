// store.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService, FavoriteService, GenreService } from '../../../api/services';
import { BookResponse, FavoriteRequest } from '../../../api/models';

@Component({
  selector: 'app-store',
  standalone: false,
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  books: BookResponse[] = [];
  pagedBooks: BookResponse[] = [];
  genres: any[] = [];
  favoriteBookIds: number[] = [];
  selectedGenreId: number | null = null;

  searchTitle = '';
  searchAuthor = '';
  searchMinPrice?: number;
  searchMaxPrice?: number;

  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  loading = false; // Thêm biến trạng thái loading
  hasBooks = false; // Thêm biến trạng thái để kiểm tra sách

  constructor(
    private bookService: BookService,
    private router: Router,
    private genreService: GenreService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.getBooks();
    this.getGenres();
    this.getFavoriteBooks();
  }

  /** Lấy toàn bộ sách */
  private getBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: res => this.setBooks(res.data ?? []),
      error: err => this.handleError('Lỗi khi lấy sách', err)
    });
  }

  /** Lấy sách theo thể loại */
  selectGenre(id: number): void {
    this.selectedGenreId = id;
    this.loading = true;
    this.bookService.apiBookByGenreGenreIdGet$Json({ genreId: id }).subscribe({
      next: res => this.setBooks(res.data ??[]),
      error: err => this.handleError('Lỗi khi lấy sách theo thể loại', err)
    });
  }

  /** Lấy thể loại */
  private getGenres(): void {
    this.genreService.apiGenreGet$Json().subscribe({
      next: res => this.genres = res.data || [],
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }

  /** Lấy sách yêu thích của user */
  private getFavoriteBooks(): void {
    const user = this.getUser();
    if (!user) return;

    this.favoriteService.apiFavoriteUserUserIdGet$Json({ userId: user.userId }).subscribe({
      next: res => this.favoriteBookIds = (res.data ?? []).map(f => f.bookId!).filter(Boolean),
      error: err => console.error('Lỗi khi load yêu thích:', err)
    });
  }

  /** Tìm kiếm nâng cao */
  searchBooks(): void {
    this.loading = true;
    const keyword = [this.searchTitle, this.searchAuthor].filter(Boolean).join(' ');

    this.bookService.apiBookAdvancedSearchGet$Json({
      keyword,
      minPrice: this.searchMinPrice,
      maxPrice: this.searchMaxPrice
    }).subscribe({
      next: res => this.setBooks(res.data ?? []),
      error: err => this.handleError('Lỗi tìm kiếm nâng cao', err)
    });
  }

  /** Thêm/Xoá yêu thích */
  toggleFavorite(book: BookResponse): void {
    const user = this.getUser();
    if (!user) return alert('Bạn cần đăng nhập để yêu thích!');

    const bookId = book.bookId!;
    const isFav = this.favoriteBookIds.includes(bookId);

    const action$ = isFav
      ? this.favoriteService.apiFavoriteDeleteByUserBookDelete$Json({ userId: user.userId, bookId })
      : this.favoriteService.apiFavoriteAddPost$Json({ body: { userId: user.userId, bookId } });

    action$.subscribe({
      next: () => {
        this.favoriteBookIds = isFav
          ? this.favoriteBookIds.filter(id => id !== bookId)
          : [...this.favoriteBookIds, bookId];
        alert(isFav ? '❌ Đã xoá khỏi yêu thích' : '❤️ Đã thêm vào yêu thích!');
      },
      error: () => alert('Lỗi khi cập nhật yêu thích')
    });
  }

  /** Xem chi tiết sách */
  viewBookDetail(bookId: number): void {
    this.router.navigate(['/user/book-detail', bookId]);
  }

  /** Thêm vào giỏ hàng */
  addToCart(book: BookResponse): void {
    const user = this.getUser();
    const cartKey = user ? `cart_${user.username}` : 'cart_guest';
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const existing = cart.find((item: any) => item.bookId === book.bookId);
    existing ? existing.quantity++ : cart.push({ ...book, quantity: 1 });

    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert('🛒 Đã thêm vào giỏ hàng!');
  }

  /** Phân trang */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Cập nhật sách hiển thị theo trang */
  private updatePagedBooks(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedBooks = this.books.slice(start, start + this.pageSize);
    this.totalPages = Math.ceil(this.books.length / this.pageSize);
  }

  /** Set danh sách sách & cập nhật phân trang */
  private setBooks(data: BookResponse[] | undefined): void {
    this.books = data ?? [];
    this.currentPage = 1;
    this.updatePagedBooks();
    this.loading = false;
    // Cập nhật trạng thái khi sách có/không có
    this.hasBooks = this.books.length > 0;
  }

  /** Lấy thông tin user từ localStorage */
  private getUser() {
    const str = localStorage.getItem('user');
    return str ? JSON.parse(str) : null;
  }

  /** Xử lý lỗi chung */
  private handleError(msg: string, err: any): void {
    console.error(msg, err);
    this.loading = false;
    this.hasBooks = false;
  }
}