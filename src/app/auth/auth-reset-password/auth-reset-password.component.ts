
// reset-password-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../api/services';
import { ResetPasswordRequest } from '../../api/models';
@Component({
  selector: 'app-auth-reset-password',
  standalone: false,
  templateUrl: './auth-reset-password.component.html',
})
export class AuthResetPasswordComponent {
 @Output() resetPasswordSuccess = new EventEmitter<void>();

  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.newPasswordMatchValidator });
  }

  newPasswordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmNewPassword = form.get('confirmNewPassword');

    if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
      confirmNewPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const resetPasswordData: ResetPasswordRequest = {
        email: this.resetPasswordForm.value.email,
        token: this.resetPasswordForm.value.token,
        newPassword: this.resetPasswordForm.value.newPassword
      };

      this.apiService.apiAuthResetPasswordPost({ body: resetPasswordData }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập với mật khẩu mới.';
          this.resetPasswordSuccess.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Không thể đặt lại mật khẩu. Token có thể đã hết hạn.';
          console.error('Reset password error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.resetPasswordForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc`;
      if (field.errors['email']) return 'Email không hợp lệ';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      if (field.errors['passwordMismatch']) return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email',
      'token': 'Mã xác thực',
      'newPassword': 'Mật khẩu mới',
      'confirmNewPassword': 'Xác nhận mật khẩu mới'
    };
    return labels[fieldName] || fieldName;
  }
}