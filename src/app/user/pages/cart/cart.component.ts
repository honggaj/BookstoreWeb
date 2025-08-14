import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loadScript } from '@paypal/paypal-js';

import { BookResponse, OrderItemRequest, OrderRequest } from '../../../api/models';
import { OrderService, VoucherService } from '../../../api/services';
import { AddressService } from '../../../../services/address.service';
import Swal from 'sweetalert2';

interface CartItem {
  quantity: number;
  isCombo?: boolean;
  bookId?: number;
  price?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  cartKey = 'cart';
  recipientName = '';
  address = '';
  phoneNumber = '';
  paymentMethod: 'COD' | 'PayPal' = 'COD';
  voucherCode = '';
  voucherDiscount = 0;
  voucherList: any[] = [];

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  selectedProvinceId = '';
  selectedDistrictId = '';
  selectedWardName = '';
  paymentCompleted: boolean = false;

  private _paymentMethod: 'COD' | 'PayPal' = 'COD';


  constructor(
    private orderService: OrderService,
    private router: Router,
    private voucherService: VoucherService,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.loadVouchers();
    this.setupPayPal();
    this.loadProvinces();
  }


  loadProvinces(): void {
    this.addressService.getProvinces().subscribe({
      next: (res) => (this.provinces = res),
      error: (err) => console.error('Load provinces error:', err)
    });
  }

  onProvinceChange(): void {
    this.selectedDistrictId = this.selectedWardName = '';
    this.districts = this.wards = [];

    if (this.selectedProvinceId) {
      this.addressService.getDistricts(this.selectedProvinceId).subscribe({
        next: (res) => (this.districts = res),
        error: (err) => console.error('Load districts error:', err)
      });
    }
  }

  onDistrictChange(): void {
    this.selectedWardName = '';
    this.wards = [];

    if (this.selectedDistrictId) {
      this.addressService.getWards(this.selectedDistrictId).subscribe({
        next: (res) => (this.wards = res),
        error: (err) => console.error('Load wards error:', err)
      });
    }
  }

  loadCart(): void {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    this.cartKey = username ? `cart_${username}` : 'cart_guest';

    const stored = localStorage.getItem(this.cartKey);
    const rawItems: any[] = stored ? JSON.parse(stored) : [];

    this.cartItems = rawItems.map(item => ({
      ...item,
      quantity: item.quantity ?? 1
    }));
  }

  loadVouchers(): void {
    this.voucherService.apiVoucherGet$Json().subscribe({
      next: (res) => {
        this.voucherList = res.data ?? [];
        this.applyVoucher();
      },
      error: (err) => console.error('Load vouchers error:', err)
    });
  }

  applyVoucher(): void {
    const now = new Date();
    const matchedVoucher = this.voucherList.find(v =>
      v.code?.toLowerCase() === this.voucherCode.toLowerCase() &&
      new Date(v.expiryDate ?? '') >= now &&
      ((v.usageLimit ?? 0) === 0 || (v.usedCount ?? 0) < (v.usageLimit ?? 0)) &&
      this.getSubtotal() >= (v.minOrderAmount ?? 0)
    );

    if (!matchedVoucher) {
      this.voucherDiscount = 0;
      return;
    }


    const discount = (this.getSubtotal() * (matchedVoucher.discountPercent ?? 0)) / 100;
    this.voucherDiscount = Math.min(discount, matchedVoucher.maxDiscount ?? discount);
  }
  ngOnChanges(): void {
    if (this.paymentMethod === 'PayPal') {
      setTimeout(() => this.setupPayPal(), 0); // gọi lại khi thay đổi phương thức thanh toán
    }
  }

  onPaymentMethodChange(method: 'COD' | 'PayPal'): void {
    this.paymentMethod = method;
    if (method === 'PayPal') {
      setTimeout(() => this.setupPayPal(), 0);
    }
  }

  setupPayPal(): void {
    if (this.paymentMethod !== 'PayPal') return;

    loadScript({ clientId: 'Aan6EYWneudr0PxCrRJHAPaTD7IcSvup4uOLhQ9IuEMwaNsIAQ16I_DCVVVdvItlDxBUdeI5JP8SK8uM' })
      .then((paypal) => {
        if (!paypal?.Buttons) return;

        paypal.Buttons({
          createOrder: (data, actions) => {
            const usd = Math.ceil(this.getGrandTotal() / 24000);
            return actions.order?.create({
              intent: 'CAPTURE',
              purchase_units: [{ amount: { currency_code: 'USD', value: usd.toString() } }]
            }) ?? Promise.reject('Create order failed');
          },
          onApprove: (data, actions) => {
            if (actions.order) {
              return actions.order.capture().then(details => {
                alert(`✅ Thanh toán thành công! Cảm ơn ${details.payer?.name?.given_name ?? 'bạn'}`);
                this.paymentCompleted = true;
                this.submitOrder();
              });
            }
            return Promise.resolve();
          },
          onCancel: () => {
            this.paymentCompleted = false;
            alert('❌ Bạn đã huỷ thanh toán PayPal');
          }
        }).render('#paypal-button-container');
      })
      .catch((err) => console.error('PayPal SDK load error:', err));
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price as any) || 0;
      return total + item.quantity * price;
    }, 0);
  }

  getGrandTotal(): number {
    return this.getSubtotal() - this.voucherDiscount + 30000;
  }

  removeItem(i: number): void {
    this.cartItems.splice(i, 1);
    this.saveCart();
  }

  changeQuantity(i: number, delta: number): void {
    this.cartItems[i].quantity = Math.max(1, this.cartItems[i].quantity + delta);
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
      !!this.phoneNumber.trim() &&
      !!this.selectedProvinceId &&
      !!this.selectedDistrictId &&
      !!this.selectedWardName;
  }
submitOrder(): void {
  if (this.paymentMethod === 'PayPal' && !this.paymentCompleted) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa thanh toán',
      text: 'Vui lòng hoàn tất thanh toán trước khi đặt hàng.'
    });
    return;
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    Swal.fire({
      icon: 'info',
      title: 'Chưa đăng nhập',
      text: 'Vui lòng đăng nhập để đặt hàng!'
    });
    return;
  }

  if (!this.isFormValid()) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu thông tin',
      text: 'Điền đầy đủ thông tin giao hàng!'
    });
    return;
  }

  const items: OrderItemRequest[] = this.cartItems.map(item => ({
    bookId: item.isCombo ? null : item.bookId ?? null,
    comboId: item['comboId'] ?? null,
    quantity: item.quantity,
    price: typeof item.price === 'number' ? item.price : parseFloat(item.price as any) || 0
  }));

  if (!items.length) {
    Swal.fire({
      icon: 'error',
      title: 'Giỏ hàng trống',
      text: '🛑 Bạn chưa có sản phẩm nào trong giỏ!'
    });
    return;
  }

  const order: OrderRequest = {
    userId: user.userId,
    recipientName: this.recipientName,
    address: `${this.address}, ${this.selectedWardName}, ${this.getDistrictName()}, ${this.getProvinceName()}`,
    phoneNumber: this.phoneNumber,
    items,
    paymentMethod: this.paymentMethod,
    isPaid: this.paymentMethod === 'PayPal',
    voucherCode: this.voucherCode || null
  };

  this.orderService.apiOrderCreatePost$Json({ body: order }).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Đặt hàng thành công!',
        text: 'Cảm ơn bạn đã mua hàng ❤️'
      }).then(() => {
        this.clearCart();
        this.router.navigate(['/user/history']);
      });
    },
    error: (err) => {
      console.error('Đặt hàng lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra khi đặt hàng! Vui lòng thử lại.'
      });
    }
  });
}

  getProvinceName(): string {
    return this.provinces.find(p => p.id === this.selectedProvinceId)?.name || '';
  }

  getDistrictName(): string {
    return this.districts.find(d => d.id === this.selectedDistrictId)?.name || '';
  }
}
