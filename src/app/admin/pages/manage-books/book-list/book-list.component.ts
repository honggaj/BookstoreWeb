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
  loading = false;

  constructor(private bookService: BookService, private router:Router) { } // ✅ bookService viết đúng tên

  ngOnInit(): void {
    this.loadBooks();
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

  createBook(): void {
    this.router.navigate(['/books/book-create']);
  }
  editBook(book: BookResponse): void {
    this.router.navigate(['/books/book-update', book.bookId]);
    console.log('TODO: Mở form sửa sách', book);
  }

  deleteBook(id: number): void {
    if (confirm('Bạn có chắc muốn xoá sách này không?')) {
      this.bookService.apiBookDeleteIdDelete$Json({ id }).subscribe({
        next: (res) => {
          alert(res.message || 'Xoá thành công!');
          this.loadBooks(); // reload danh sách sau khi xoá
        },
        error: (err) => console.error('Lỗi xoá sách:', err)
      });
    }
  }
}