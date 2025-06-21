import { Component, OnInit } from '@angular/core';
import { BookResponse, OrderItemRequest, OrderRequest } from '../../../api/models';
import { OrderService, VoucherService } from '../../../api/services';
import { Router } from '@angular/router';
import { loadScript } from '@paypal/paypal-js';

interface CartItem extends BookResponse {
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartKey: string = 'cart';
  recipientName = '';
  address = '';
  city = '';
  postalCode = '';
  country = '';
  phoneNumber = '';
  paymentMethod: 'COD' | 'PayPal' = 'COD';
  voucherCode: string = '';
  voucherDiscount: number = 0;
  voucherList: any[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private voucherService: VoucherService
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadVouchers();
    this.initPayPalButton();
    this.watchPaymentMethod();
  }

  // ✅ Load cart từ localStorage
  loadCartItems(): void {
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

  // ✅ Gọi API voucher và apply luôn nếu có mã đang chọn
  loadVouchers(): void {
    this.voucherService.apiVoucherGet$Json().subscribe({
      next: (res) => {
        this.voucherList = res.data ?? [];
        this.applyVoucher(); // gọi sau khi có list
      },
      error: (err) => {
        console.error('❌ Không lấy được voucher:', err);
      }
    });
  }

  // ✅ Áp dụng mã giảm giá
  applyVoucher(): void {
    const now = new Date();

    const voucher = this.voucherList.find(v =>
      v.code?.toLowerCase() === this.voucherCode.toLowerCase() &&
      new Date(v.expiryDate ?? '') >= now &&
      ((v.usageLimit ?? 0) === 0 || (v.usedCount ?? 0) < (v.usageLimit ?? 0)) &&
      this.getSubtotal() >= (v.minOrderAmount ?? 0)
    );

    if (!voucher) {
      this.voucherDiscount = 0;
      return;
    }

    const discount = (this.getSubtotal() * (voucher.discountPercent ?? 0)) / 100;
    this.voucherDiscount = Math.min(discount, voucher.maxDiscount ?? discount);
  }

  watchPaymentMethod(): void {
    setTimeout(() => {
      if (this.paymentMethod === 'PayPal') {
        this.initPayPalButton();
      }
    });
  }

  // ✅ PayPal nút
  initPayPalButton(): void {
    loadScript({ clientId: 'YOUR_CLIENT_ID_HERE' }).then((paypal) => {
      if (!paypal || !paypal.Buttons) {
        console.error('❌ Không load được PayPal SDK');
        return;
      }

      paypal.Buttons({
        createOrder: (data, actions) => {
          const usdAmount = Math.ceil(this.getGrandTotal() / 24000);
          return actions.order?.create({
            intent: 'CAPTURE',
            purchase_units: [{ amount: { currency_code: 'USD', value: usdAmount.toString() } }]
          }) ?? Promise.reject('⚠️ Không tạo được order');
        },
        onApprove: (data, actions) => {
          if (!actions.order) {
            return Promise.reject(new Error('⚠️ actions.order undefined'));
          }

          return actions.order.capture().then((details) => {
            const name = details.payer?.name?.given_name ?? 'bạn';
            alert('✅ Thanh toán thành công qua PayPal! Cảm ơn ' + name);
            this.placeOrder();
          });
        },

        onError: (err) => {
          console.error('❌ Lỗi PayPal:', err);
          alert('Thanh toán thất bại!');
        }
      }).render('#paypal-button-container');
    }).catch(err => {
      console.error('❌ Lỗi load SDK PayPal:', err);
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseInt(item.price as any) || 0;
      return total + (item.quantity * price);
    }, 0);
  }

  getGrandTotal(): number {
    return this.getSubtotal() - this.voucherDiscount + 30000;
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

  saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    window.dispatchEvent(new Event('storage'));
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem(this.cartKey);
  }

  isFormValid(): boolean {
    return !!this.recipientName.trim() &&
      !!this.address.trim() &&
      !!this.city.trim() &&
      !!this.postalCode.trim() &&
      !!this.country.trim() &&
      !!this.phoneNumber.trim();
  }

  placeOrder(): void {
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      return;
    }

    if (!this.isFormValid()) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin!');
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
      items,
      paymentMethod: this.paymentMethod,
      isPaid: this.paymentMethod === 'PayPal',
      voucherCode: this.voucherCode || null
    };

    this.orderService.apiOrderCreatePost$Json({ body: orderRequest }).subscribe({
      next: (res) => {
        alert('✅ Đặt hàng thành công!');
        this.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Đặt hàng lỗi:', err);
        alert('Có lỗi xảy ra!');
      }
    });
  }
}
