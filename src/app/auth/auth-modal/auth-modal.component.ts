// auth-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../api/services';
import { ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, UserResponse } from '../../api/models';
// ...tương tự cho các interface khác nếu đã có...




@Component({
  selector: 'app-auth-modal',
  standalone: false,
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  @Input() isVisible = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>(); // Emit user data

  // Mode states: 'login', 'register', 'forgot-password', 'reset-password'
  currentMode: 'login' | 'register' | 'forgot-password' | 'reset-password' = 'login';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;

  // For reset password flow
  resetToken = '';

  constructor(
    private fb: FormBuilder,
    private apiService: AuthService,

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.newPasswordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
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

  // Computed properties for template
  get isLoginMode() { return this.currentMode === 'login'; }
  get isRegisterMode() { return this.currentMode === 'register'; }
  get isForgotPasswordMode() { return this.currentMode === 'forgot-password'; }
  get isResetPasswordMode() { return this.currentMode === 'reset-password'; }

  setMode(mode: 'login' | 'register' | 'forgot-password' | 'reset-password') {
    this.currentMode = mode;
    this.clearMessages();
    this.resetAllForms();
  }

  toggleMode() {
    if (this.currentMode === 'login') {
      this.setMode('register');
    } else {
      this.setMode('login');
    }
  }

  showForgotPassword() {
    this.setMode('forgot-password');
  }

  showResetPassword(token?: string) {
    this.setMode('reset-password');
    if (token) {
      this.resetToken = token;
      this.resetPasswordForm.patchValue({ token });
    }
  }

  backToLogin() {
    this.setMode('login');
  }

  closeModal() {
    this.isVisible = false;
    this.modalClosed.emit();
    this.clearMessages();
    this.resetAllForms();
    this.setMode('login');
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private resetAllForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.forgotPasswordForm.reset();
    this.resetPasswordForm.reset();
  }
  // ...existing code...
 onLogin() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.apiService.apiAuthLoginPost({ body: loginData }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Đăng nhập thành công!';

        // ✅ Kiểm tra response trả về
        console.log('🎯 Full API response:', response);

        // ✅ Nếu là string (trường hợp backend trả text), thì parse
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response);
          } catch (e) {
            console.error('❌ Không parse được response JSON:', response);
            this.errorMessage = 'Phản hồi máy chủ không hợp lệ.';
            return;
          }
        }

        // ✅ Lưu đầy đủ vào sessionStorage
        const userData = {
          userId: response.userId,           // 👈 QUAN TRỌNG
          username: response.username,
          email: response.email,
          role: response.role,
          token: response.token              // dùng cho các API cần Auth
        };

        console.log('✅ Lưu user vào sessionStorage:', userData);

        sessionStorage.setItem('user', JSON.stringify(userData));
        this.loginSuccess.emit(userData);
        setTimeout(() => this.closeModal(), 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        console.error('❌ Login error:', error);
      }
    });
  } else {
    this.markFormGroupTouched(this.loginForm);
  }
}
  
  // ...existing code...
  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterRequest = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.apiService.apiAuthRegisterPost({ body: registerData }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';

          setTimeout(() => {
            this.setMode('login');
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
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

          // Optionally redirect to reset password form after some time
          setTimeout(() => {
            this.setMode('reset-password');
          }, 3000);
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

          setTimeout(() => {
            this.setMode('login');
          }, 2000);
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
      'password': 'Mật khẩu',
      'username': 'Tên đăng nhập',
      'confirmPassword': 'Xác nhận mật khẩu',
      'token': 'Mã xác thực',
      'newPassword': 'Mật khẩu mới',
      'confirmNewPassword': 'Xác nhận mật khẩu mới'
    };
    return labels[fieldName] || fieldName;
  }
}