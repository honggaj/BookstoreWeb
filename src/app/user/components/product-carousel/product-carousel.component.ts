import { Component } from '@angular/core';
import { BookResponse } from '../../../api/models';
import { BookService } from '../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-carousel',
  standalone: false,
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent {
  books: BookResponse[] = [];
    loading = false;
responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

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