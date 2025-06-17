import { Component } from '@angular/core';
import { OrderResponse } from '../../../../api/models';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../api/services';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
 orderId!: number;
  order?: OrderResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.loading = true;
    this.orderService.apiOrderIdGet$Json({ id: this.orderId }).subscribe({
      next: (res) => {
        this.order = res.data!;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi lấy chi tiết đơn hàng:', err);
        this.loading = false;
      }
    });
  }
}