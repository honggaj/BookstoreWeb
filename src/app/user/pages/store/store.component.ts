// store.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService, FavoriteService, GenreService } from '../../../api/services';
import { BookResponse } from '../../../api/models';
import Swal from 'sweetalert2';

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
  loading = false;
  hasBooks = false;

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

  private getBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: res => this.setBooks(res.data ?? []),
      error: err => this.handleError('Lỗi khi lấy sách', err)
    });
  }

  selectGenre(id: number): void {
    this.selectedGenreId = id;
    this.loading = true;
    this.bookService.apiBookByGenreGenreIdGet$Json({ genreId: id }).subscribe({
      next: res => this.setBooks(res.data ?? []),
      error: err => this.handleError('Lỗi khi lấy sách theo thể loại', err)
    });
  }

  private getGenres(): void {
    this.genreService.apiGenreGet$Json().subscribe({
      next: res => this.genres = res.data || [],
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }

  private getFavoriteBooks(): void {
    const user = this.getUser();
    if (!user) return;

    this.favoriteService.apiFavoriteUserUserIdGet$Json({ userId: user.userId }).subscribe({
      next: res => this.favoriteBookIds = (res.data ?? []).map(f => f.bookId!).filter(Boolean),
      error: err => console.error('Lỗi khi load yêu thích:', err)
    });
  }

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

  toggleFavorite(book: BookResponse): void {
    const user = this.getUser();
    if (!user) {
      Swal.fire('Thông báo', 'Bạn cần đăng nhập để yêu thích!', 'info');
      return;
    }

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

        Swal.fire(
          isFav ? '❌ Đã xoá khỏi yêu thích' : '❤️ Đã thêm vào yêu thích!',
          '',
          'success'
        );
      },
      error: () => Swal.fire('Lỗi', 'Không thể cập nhật yêu thích', 'error')
    });
  }

  viewBookDetail(bookId: number): void {
    this.router.navigate(['/user/book-detail', bookId]);
  }

  addToCart(book: BookResponse): void {
    const user = this.getUser();
    const cartKey = user ? `cart_${user.username}` : 'cart_guest';
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const existing = cart.find((item: any) => item.bookId === book.bookId);
    existing ? existing.quantity++ : cart.push({ ...book, quantity: 1 });

    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    Swal.fire('🛒 Đã thêm vào giỏ hàng!', '', 'success');
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePagedBooks(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedBooks = this.books.slice(start, start + this.pageSize);
    this.totalPages = Math.ceil(this.books.length / this.pageSize);
  }

  setBooks(data: BookResponse[] | undefined): void {
    this.books = data ?? [];
    this.currentPage = 1;
    this.updatePagedBooks();
    this.loading = false;
    this.hasBooks = this.books.length > 0;
  }

  getUser() {
    const str = localStorage.getItem('user');
    return str ? JSON.parse(str) : null;
  }

  handleError(msg: string, err: any): void {
    console.error(msg, err);
    this.loading = false;
    this.hasBooks = false;
  }
}
