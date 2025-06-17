import { Component } from '@angular/core';
import { BookResponse } from '../../../api/models';
import { BookService } from '../../../api/services';
import { Router } from '@angular/router';
import {  Input } from '@angular/core';

@Component({
  selector: 'app-product-list-home',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  loading = false;
 @Input() books: BookResponse[] = []; // 📥 nhận sách từ cha
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
  goToDetail(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }
addToCart(book: BookResponse): void {
  const user = sessionStorage.getItem('user');
  const username = user ? JSON.parse(user).username : null;
  const cartKey = username ? `cart_${username}` : 'cart_guest';

  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

  // Nếu đã có bookId thì tăng số lượng
  const existing = cart.find((item: any) => item.bookId === book.bookId);
  if (existing) {
    existing.quantity = (existing.quantity ?? 1) + 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  window.dispatchEvent(new Event('storage')); // 🔥 Cập nhật số giỏ hàng trên header
  alert('🛒 Đã thêm vào giỏ hàng!');
}
}