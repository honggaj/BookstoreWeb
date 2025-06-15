// auth-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../api/services';

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface RegisterRequest {
  email?: string | null;
  password?: string | null;
  username?: string | null;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    fullName?: string;
  };
  message?: string;
}

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

  isLoginMode = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: AuthService
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

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  closeModal() {
    this.isVisible = false;
    this.modalClosed.emit();
    this.errorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  // Chỉ cần thay thế phần onLogin() method trong auth-modal.component.ts

  // Thay thế method onLogin() trong auth-modal.component.ts
// Thay thế method onLogin() trong auth-modal.component.ts - LOẠI BỎ setTimeout

onLogin() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';

    const loginData: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.apiService.apiAuthLoginPost({ body: loginData }).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        this.isLoading = false;
        this.successMessage = 'Đăng nhập thành công!';
        
        // Store token
        if (response?.token) {
          sessionStorage.setItem('token', response.token);
        }

        // API trả về user data trực tiếp ở root level
        if (response?.username || response?.email) {
          const userData = {
            username: response.username,
            email: response.email,
            role: response.role,
            displayName: response.username || response.email || 'User'
          };

          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('username', userData.username || userData.email || 'User');

          console.log('Storing user data and emitting:', userData);

          // EMIT NGAY LẬP TỨC - KHÔNG DÙNG setTimeout
          this.loginSuccess.emit(userData);
          
          // Delay chỉ cho việc đóng modal để user thấy success message
          setTimeout(() => {
            this.closeModal();
          }, 1000);
        } else {
          // Fallback
          const userData = {
            username: loginData.email?.split('@')[0] || 'User',
            email: loginData.email,
            displayName: loginData.email?.split('@')[0] || 'User'
          };
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('username', userData.username);
          
          console.log('Storing fallback user data and emitting:', userData);
          
          // EMIT NGAY LẬP TỨC
          this.loginSuccess.emit(userData);
          
          setTimeout(() => {
            this.closeModal();
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        console.error('Login error:', error);
      }
    });
  } else {
    this.markFormGroupTouched(this.loginForm);
  }
}
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
            this.isLoginMode = true;
            this.successMessage = '';
            this.registerForm.reset();
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
      'confirmPassword': 'Xác nhận mật khẩu'
    };
    return labels[fieldName] || fieldName;
  }
}