import { Component } from '@angular/core';
import { BookResponse } from '../../../../api/models';
import { BookService } from '../../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  books: BookResponse[] = [];
  pagedBooks: BookResponse[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  loading = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.totalPages = Math.ceil(this.books.length / this.itemsPerPage);
        this.updatePagedBooks();
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách:', err);
        this.loading = false;
      }
    });
  }

  updatePagedBooks(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedBooks = this.books.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedBooks();
    }
  }

  createBook(): void {
    this.router.navigate(['/books/book-create']);
  }

  editBook(book: BookResponse): void {
    this.router.navigate(['/books/book-update', book.bookId]);
  }

  deleteBook(id: number): void {
    if (confirm('Bạn có chắc muốn xoá sách này không?')) {
      this.bookService.apiBookIdDelete$Json({ id }).subscribe({
        next: (res) => {
          alert(res.message || 'Xoá thành công!');
          this.loadBooks();
        },
        error: (err) => console.error('Lỗi xoá sách:', err)
      });
    }
  }
}
