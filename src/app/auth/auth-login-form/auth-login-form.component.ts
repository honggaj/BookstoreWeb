// auth-login-form.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../api/services';
import { LoginRequest, GoogleLoginRequest } from '../../api/models';

declare const google: any;

@Component({
  selector: 'app-auth-login-form',
  standalone: false,
  templateUrl: './auth-login-form.component.html',
  styleUrls: ['./auth-login-form.component.css']
})
export class AuthLoginFormComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<any>();
  @Output() forgotPasswordClicked = new EventEmitter<void>();

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  googleClientId = '122717583346-i8onvl4v3ntfd6v7dc05j1dmhv3auiib.apps.googleusercontent.com'; // Thay thế bằng Google Client ID của bạn

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Khởi tạo Google Identity Services
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: this.handleGoogleLogin.bind(this)
    });

    // Render nút Google Login vào div có id="google-btn"
    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', type: 'standard' }
    );
  }

  // --- Getters cho Form Controls để code HTML gọn hơn ---
  get emailFormControl(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get passwordFormControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get isEmailInvalid(): boolean {
    return !!(this.emailFormControl?.touched && this.emailFormControl?.errors);
  }

  get isPasswordInvalid(): boolean {
    return !!(this.passwordFormControl?.touched && this.passwordFormControl?.errors);
  }
  
  // --- Phương thức xử lý đăng nhập Email/Password ---
  handleEmailPasswordLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.apiAuthLoginPost({ body: loginData }).subscribe({
        next: (response) => this._handleLoginSuccess(response, 'Đăng nhập thành công!'),
        error: (error) => this._handleLoginError(error, 'Đăng nhập thất bại. Vui lòng thử lại.')
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // --- Phương thức xử lý đăng nhập Google ---
  handleGoogleLogin(response: any): void {
    if (response.credential) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.handleGoogleLoginApiCall(response.credential);
    } else {
      this._handleLoginError(null, 'Đăng nhập Google thất bại.');
      console.error('❌ Google login error: No credential received');
    }
  }

  // --- Phương thức gọi API backend GoogleLogin ---
  handleGoogleLoginApiCall(idToken: string): void {
    const googleLoginRequest: GoogleLoginRequest = { idToken: idToken };

    this.authService.apiAuthGoogleLoginPost$Json({ body: googleLoginRequest }).subscribe({
      next: (response) => this._handleLoginSuccess(response, 'Đăng nhập Google thành công!'),
      error: (error) => this._handleLoginError(error, 'Đăng nhập Google thất bại. Vui lòng thử lại.')
    });
  }

  // --- Xử lý sự kiện "Quên mật khẩu" ---
  handleForgotPasswordClick(): void {
    this.forgotPasswordClicked.emit();
  }

  // --- Hàm hỗ trợ lấy lỗi validation ---
  getFieldError(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this._getFieldLabel(fieldName)} là bắt buộc`;
    }
    if (control.errors['email']) {
      return 'Email không hợp lệ';
    }
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${this._getFieldLabel(fieldName)} tối thiểu ${requiredLength} ký tự`;
    }
    return '';
  }

  // --- Private helpers ---
  private _handleLoginSuccess(response: any, successMsg: string): void {
    this.isLoading = false;
    this.successMessage = successMsg;
    this._saveUserData(response);
  }

  private _handleLoginError(error: any, defaultMsg: string): void {
    this.isLoading = false;
    this.errorMessage = error?.error?.message || defaultMsg;
    console.error('❌ Login API error:', error);
  }

  private _saveUserData(response: any): void {
    const userData = {
      userId: response.userId,
      username: response.username,
      email: response.email,
      role: response.role,
      token: response.token
    };
    sessionStorage.setItem('user', JSON.stringify(userData));
    this.loginSuccess.emit(userData);
    
    // Sử dụng Observable/Service để giao tiếp là tốt hơn, nhưng đây là cách hiện tại
    setTimeout(() => {
      window.dispatchEvent(new Event('user-logged-in'));
    }, 100);
  }

  private _getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Mật khẩu'
    };
    return labels[fieldName] || fieldName;
  }
}
