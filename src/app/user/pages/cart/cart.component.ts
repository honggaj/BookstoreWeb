import { Component, OnInit } from '@angular/core';
import { BookResponse } from '../../../api/models';

interface CartItem extends BookResponse {
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
// ...existing code...
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartKey: string = 'cart';

  ngOnInit(): void {
    // Lấy username từ sessionStorage
    const user = sessionStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    this.cartKey = username ? `cart_${username}` : 'cart_guest';

    const stored = localStorage.getItem(this.cartKey);
    const rawItems: any[] = stored ? JSON.parse(stored) : [];
    this.cartItems = rawItems.map(item => ({
      ...item,
      quantity: item.quantity ?? 1,
    }));
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCart();
  }

  updateQuantity(index: number, change: number): void {
    const item = this.cartItems[index];
    item.quantity = Math.max(1, item.quantity + change);
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseInt(item.price as any) || 0;
      return total + (item.quantity * price);
    }, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem(this.cartKey);
  }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseInt(item.price as any) || 0;
      return total + (item.quantity * price);
    }, 0);
  }

  getGrandTotal(): number {
    return this.getSubtotal() + 30000; // phí ship cố định
  }

// ...existing code...
}
