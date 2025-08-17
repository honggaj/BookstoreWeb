import { Component, OnInit } from '@angular/core';
import { ComboService } from '../../../api/services';
import { Router } from '@angular/router';
import { ComboResponse } from '../../../api/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-combo-list',
  standalone: false,
  templateUrl: './combo-list.component.html',
  styleUrls: ['./combo-list.component.css']
})
export class ComboListComponent implements OnInit {
  combos: ComboResponse[] = [];
  loading = false;

  constructor(
    private comboService: ComboService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCombos();
  }

  loadCombos(): void {
    this.loading = true;
    this.comboService.apiComboGet$Json().subscribe({
      next: res => {
        this.combos = res.data ?? [];
        this.loading = false;
      },
      error: err => {
        console.error('Lỗi khi load combo:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải danh sách combo!',
        });
      }
    });
  }

  addToCart(combo: ComboResponse): void {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    const cartKey = username ? `cart_${username}` : 'cart_guest';

    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const existing = cart.find((item: any) => item.comboId === combo.comboId && item.isCombo);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        isCombo: true,
        comboId: combo.comboId,
        title: combo.name || 'Combo không tên',
        coverImageUrl: combo.image,
        price: combo.discountPrice ?? combo.totalPrice ?? 0,
        quantity: 1,
        comboDescription: combo.description || ''
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    Swal.fire({
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng',
      showConfirmButton: false,
      timer: 1500
    });
  }

  // goToDetail(comboId: number): void {
  //   this.router.navigate(['/user/combo', comboId]);
  // }
}
