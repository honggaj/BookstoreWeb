import { Component } from '@angular/core';
import { BookResponse, FavoriteResponse } from '../../../api/models';
import { FavoriteService } from '../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
 favorites: FavoriteResponse[] = [];

  constructor(private favoriteService: FavoriteService, private router:Router) {}

  ngOnInit(): void {
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      alert('Bạn cần đăng nhập!');
      return;
    }

    this.favoriteService.apiFavoriteUserUserIdGet$Json({ userId: user.userId }).subscribe(res => {
      this.favorites = res.data ?? [];
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
  removeFromFavorite(bookId: number): void {
  if (!confirm('Bạn có chắc muốn xoá khỏi danh sách yêu thích?')) return;

  this.favoriteService.apiFavoriteDeleteByUserBookDelete$Json({
    userId: JSON.parse(sessionStorage.getItem('user')!).userId,
    bookId
  }).subscribe({
    next: () => {
      this.favorites = this.favorites.filter(f => f.bookId !== bookId);
      alert('❌ Đã xoá khỏi danh sách yêu thích');
    },
    error: () => alert('Lỗi khi xoá khỏi yêu thích')
  });
}

  
}