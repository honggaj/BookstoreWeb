import { Component } from '@angular/core';
import { BookResponse } from '../../../api/models';
import { BookService } from '../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-home',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
books: BookResponse[] = [];
    loading = false;


  constructor(private bookService: BookService, private router: Router) {
    

  } // ✅ bookService viết đúng tên

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
}