import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoucherService } from '../../../../api/services';
import { VoucherRequest } from '../../../../api/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-voucher-create',
  standalone: false,
  templateUrl: './voucher-create.component.html',
  styleUrls: ['./voucher-create.component.css']
})
export class VoucherCreateComponent {
  voucherForm: FormGroup;
  isLoading = false;
  message: string | null = null;

  constructor(private fb: FormBuilder, private voucherService: VoucherService,private router: Router) {
    this.voucherForm = this.fb.group({
      code: ['', Validators.required],
      discountPercent: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      expiryDate: ['', Validators.required],
      maxDiscount: [null, Validators.required],
      minOrderAmount: [null, Validators.required],
      usageLimit: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.voucherForm.invalid) {
      this.voucherForm.markAllAsTouched();
      return;
    }

    const request: VoucherRequest = this.voucherForm.value;
    this.isLoading = true;

    this.voucherService.apiVoucherCreatePost$Json({ body: request }).subscribe({
      next: (res) => {
        this.message = res.message || 'Tạo voucher thành công!';
        this.voucherForm.reset();
        this.isLoading = false;
         this.router.navigate(['/vouchers']); // 👈 CHUYỂN TRANG OK
      },
      error: (err) => {
        console.error(err);
        this.message = 'Có lỗi xảy ra khi tạo voucher.';
        this.isLoading = false;
      }
    });
  }
}
