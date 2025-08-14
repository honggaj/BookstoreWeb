import { Component, OnInit } from '@angular/core';
import { VoucherResponse } from '../../../../api/models';
import { VoucherService } from '../../../../api/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // import SweetAlert2

@Component({
  selector: 'app-voucher-list',
  standalone: false,
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.css']
})
export class VoucherListComponent implements OnInit {
  vouchers: VoucherResponse[] = [];

  // phân trang
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedVouchers: VoucherResponse[] = [];

  constructor(
    private voucherService: VoucherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getVouchers();
  }

  getVouchers() {
    this.voucherService.apiVoucherGet$Json().subscribe(res => {
      this.vouchers = res.data || [];
      this.totalPages = Math.ceil(this.vouchers.length / this.pageSize);
      this.setPagedData();
    });
  }

  setPagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedVouchers = this.vouchers.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPagedData();
    }
  }

  createVoucher(): void {
    this.router.navigate(['/vouchers/voucher-create']);
  }

  deleteVoucher(id: number): void {
    Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Hành động này sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.apiVoucherIdDelete$Json({ id }).subscribe({
          next: () => {
            Swal.fire('Đã xoá!', 'Voucher đã được xoá thành công.', 'success');
            this.getVouchers();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Lỗi', 'Xoá voucher thất bại.', 'error');
          }
        });
      }
    });
  }
}
