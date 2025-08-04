import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  cartCount = 0;
  cartKey = 'cart_guest';
  constructor(private router: Router) { }

  onSearch(keyword: string): void {
    keyword = keyword.trim();
    if (keyword) {
      this.router.navigate(['/user/search'], {
        queryParams: { keyword: keyword }
      });
    }

  }
  ngOnInit() {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    this.cartKey = username ? `cart_${username}` : 'cart_guest';
    this.updateCartCount();
    // Optional: setInterval để sync theo thời gian thực nếu bạn không dùng EventEmitter
    setInterval(() => this.updateCartCount(), 1000);
  }

  updateCartCount() {
    const stored = localStorage.getItem(this.cartKey);
    const items = stored ? JSON.parse(stored) : [];
    this.cartCount = items.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0);
  }
}