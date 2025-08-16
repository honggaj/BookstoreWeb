import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../api/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
   user: any = null;
  isLoggedIn = false;
  username: string | null = null;

  showChangePasswordModal = false;
  changePasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService // ✅ service auto-gen từ OpenAPI
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  changePassword() {
  this.errorMessage = '';
  this.successMessage = '';
  if (this.changePasswordForm.invalid) return;

  const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

  if (newPassword !== confirmPassword) {
    this.errorMessage = 'Mật khẩu xác nhận không khớp';
    return;
  }

  this.isLoading = true;

  this.userService.apiUserChangepasswordPost({
    body: {
      userId: this.user.userId,
      oldPassword,
      newPassword
    }
  }).subscribe({
    next: () => {
      this.successMessage = 'Đổi mật khẩu thành công ✅';

      // ❌ KHÔNG reset và đóng modal ngay
      // ✅ Chờ 1.5 giây cho user thấy rồi mới làm
      setTimeout(() => {
        this.changePasswordForm.reset();
        this.showChangePasswordModal = false;
        this.successMessage = '';
      }, 1500);
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.error || 'Đổi mật khẩu thất bại ❌';
    },
    complete: () => this.isLoading = false
  });
}

  logout() { 
    localStorage.clear();
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/user/home']).then(() => location.reload());
  }
}