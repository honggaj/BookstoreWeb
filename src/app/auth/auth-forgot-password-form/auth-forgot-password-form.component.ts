
// forgot-password-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../api/services';
import { ForgotPasswordRequest } from '../../api/models';
@Component({
  selector: 'app-auth-forgot-password-form',
  standalone: false,
  templateUrl: './auth-forgot-password-form.component.html',
})
export class AuthForgotPasswordFormComponent {


  @Output() forgotPasswordSuccess = new EventEmitter<void>();

  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const forgotPasswordData: ForgotPasswordRequest = {
        email: this.forgotPasswordForm.value.email
      };

      this.apiService.apiAuthForgotPasswordPost({ body: forgotPasswordData }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.';
          this.forgotPasswordSuccess.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Không thể gửi email khôi phục. Vui lòng thử lại.';
          console.error('Forgot password error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.forgotPasswordForm);
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
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email'
    };
    return labels[fieldName] || fieldName;
  }
}