import { Component } from '@angular/core';
import { OrderResponse } from '../../../api/models';
import { OrderService } from '../../../api/services';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
 orders: OrderResponse[] = [];
  currentUserId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.currentUserId = user ? JSON.parse(user).userId : null;

    if (this.currentUserId) {
      this.loadOrders(this.currentUserId);
    }
  }

  loadOrders(userId: number): void {
    this.orderService.apiOrderUserUserIdGet$Json({ userId }).subscribe({
      next: (res) => {
        this.orders = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi khi load đơn hàng:', err);
      }
    });
  }
}