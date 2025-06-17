import { Component, OnInit } from '@angular/core';
import { BookResponse, OrderItemRequest, OrderRequest } from '../../../api/models';
import { OrderService } from '../../../api/services';
import { Router } from '@angular/router';

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
  recipientName = '';
  address = '';
  city = '';
  postalCode = '';
  country = '';
  phoneNumber = '';

  constructor(private orderService: OrderService, private router: Router) { }

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
  window.dispatchEvent(new Event('storage')); // 🔥 Cập nhật Header luôn
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

  placeOrder(): void {
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      return;
    }

    const items: OrderItemRequest[] = this.cartItems.map(item => {
      const parsedPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price as any) || 0;
      return {
        bookId: item.bookId!,
        quantity: item.quantity,
        price: parsedPrice
      };
    });

    const orderRequest: OrderRequest = {
      userId: user.userId,
      recipientName: this.recipientName,
      address: this.address,
      city: this.city,
      postalCode: this.postalCode,
      country: this.country,
      phoneNumber: this.phoneNumber,
      items
    };


    console.log('📦 OrderRequest gửi đi:', orderRequest);

    this.orderService.apiOrderCreatePost$Json({ body: orderRequest }).subscribe({
      next: (res) => {
        console.log('✅ Đặt hàng thành công:', res);
        alert('Đặt hàng thành công 🎉');
        this.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Lỗi khi tạo đơn hàng:', err);
        alert('Có lỗi xảy ra khi đặt hàng!');
      }
    });
  }


}
