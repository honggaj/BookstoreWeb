import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 cartCount = 0;
  cartKey = 'cart_guest';

  ngOnInit() {
    const user = sessionStorage.getItem('user');
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