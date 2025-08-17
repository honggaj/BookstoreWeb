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

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

fetchOrders() {
  this.loading = true;
  this.orderService.apiOrderGet$Json().subscribe({
    next: (res) => {
      this.orders = (res.data || []).reverse(); // 👈 đảo thứ tự
      this.totalPages = Math.ceil(this.orders.length / this.pageSize);
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
  this.orderService.apiOrderIdStatusPut$Json({
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
get paginatedOrders(): OrderResponse[] {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.orders.slice(start, end);
}

changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    // ❌ Không cần gọi lại fetchOrders() nữa
  }
}


}