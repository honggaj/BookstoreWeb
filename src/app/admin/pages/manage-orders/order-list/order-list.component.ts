import { Component } from '@angular/core';
import { OrderResponse } from '../../../../api/models';
import { OrderService } from '../../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  orders: OrderResponse[] = [];
  loading = false;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.apiOrderGet$Json().subscribe({
      next: (res) => {
        this.orders = res.data || []; // nếu bạn dùng kiểu CustomModel
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi gọi API order:', err);
        this.loading = false;
      }
    });
  }
  goToDetail(order: OrderResponse): void {
    this.router.navigate(['/orders/order-detail', order.orderId]);
    console.log('TODO: Mở form sửa sách', order);
  }
updateStatus(orderId: number, newStatus: string): void {
  this.orderService.apiOrderUpdateStatusIdPut$Json({
    id: orderId,
    status: newStatus // 👈 chỗ này nè, đúng chuẩn query param
  }).subscribe({
    next: (res) => {
      console.log('✅ Cập nhật trạng thái thành công:', res.message);
      this.fetchOrders();
    },
    error: (err) => {
      console.error('❌ Lỗi cập nhật trạng thái:', err);
      alert('Cập nhật trạng thái thất bại!');
    }
  });
}


}