import { Component } from '@angular/core';
import { BookResponse, FavoriteResponse } from '../../../api/models';
import { FavoriteService } from '../../../api/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  favorites: FavoriteResponse[] = [];

  constructor(private favoriteService: FavoriteService, private router: Router) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Chưa đăng nhập',
        text: 'Bạn cần đăng nhập để xem danh sách yêu thích!'
      });
      return;
    }

    this.favoriteService.apiFavoriteUserUserIdGet$Json({ userId: user.userId }).subscribe(res => {
      this.favorites = res.data ?? [];
    });
  }

  goToDetail(bookId: number): void {
    this.router.navigate(['/user/book-detail', bookId]);
  }

  addToCart(book: BookResponse): void {
    const user = localStorage.getItem('user');
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

    Swal.fire({
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng',
      text: 'Sản phẩm của bạn đã được thêm vào giỏ 🛒'
    });
  }

  removeFromFavorite(bookId: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xoá',
      text: 'Bạn có chắc muốn xoá khỏi danh sách yêu thích?',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ'
    }).then(result => {
      if (result.isConfirmed) {
        this.favoriteService.apiFavoriteUserBookDelete$Json({
          userId: JSON.parse(localStorage.getItem('user')!).userId,
          bookId
        }).subscribe({
          next: () => {
            this.favorites = this.favorites.filter(f => f.bookId !== bookId);
            Swal.fire({
              icon: 'success',
              title: 'Đã xoá',
              text: 'Sản phẩm đã được xoá khỏi danh sách yêu thích'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Có lỗi khi xoá khỏi danh sách yêu thích'
            });
          }
        });
      }
    });
  }
}
