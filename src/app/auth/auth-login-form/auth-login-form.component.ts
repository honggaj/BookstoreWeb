import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest, GoogleLoginRequest } from '../../api/models';
import { Router } from '@angular/router';
import { AuthService as ApiAuthService } from '../../api/services'; // đây là service được gen từ backend
import { AuthService } from '../../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-auth-login-form',
  standalone: false,
  templateUrl: './auth-login-form.component.html',
  styleUrl: './auth-login-form.component.css'
})

export class AuthLoginFormComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<any>();
  @Output() forgotPasswordClicked = new EventEmitter<void>();

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Sử dụng ApiAuthService cho các cuộc gọi API và AuthService mới cho quản lý trạng thái
  constructor(
    private fb: FormBuilder,
    private apiAuthService: ApiAuthService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
ngOnInit(): void {
  // ✅ BƯỚC 1: Lấy user từ localStorage nếu có
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    this.authService.login(user); // hoặc this.authService.setCurrentUser(user);
  }

  // ✅ BƯỚC 2: Khởi tạo Google Login
  google.accounts.id.initialize({
    client_id: '122717583346-i8onvl4v3ntfd6v7dc05j1dmhv3auiib.apps.googleusercontent.com',
    callback: this.handleGoogleLogin.bind(this),
  });

  // ✅ BƯỚC 3: Render nút Google vào div
  google.accounts.id.renderButton(
    document.getElementById('google-btn'),
    { theme: 'outline', size: 'large', type: 'standard' }
  );
}


  // Phương thức xử lý phản hồi từ Google sau khi đăng nhập thành công
  handleGoogleLogin(response: any) {
    if (response.credential) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Gọi phương thức để gửi ID Token đến backend
      this.googleLogin(response.credential);
    } else {
      this.errorMessage = 'Đăng nhập Google thất bại.';
      console.error('❌ Google login error: No credential received');
    }
  }

  // Phương thức gọi API backend GoogleLogin
  googleLogin(idToken: string) {
    const googleLoginRequest: GoogleLoginRequest = {
      idToken: idToken
    };
    
    this.apiAuthService.apiAuthGoogleLoginPost$Json({ body: googleLoginRequest }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Đăng nhập Google thành công!';

        const userData = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          role: response.role,
          token: response.token
        };

        // Sử dụng service để lưu thông tin người dùng
        this.authService.login(userData);

        this.loginSuccess.emit(userData);
        
        // Chuyển trang theo role
        const rolePath = userData.role?.toLowerCase() === 'admin' ? '/admin' : '/user/home';
        this.router.navigateByUrl(rolePath);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
        console.error('❌ Google login API error:', error);
      }
    });
  }

  // Phương thức đăng nhập thông thường
  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.apiAuthService.apiAuthLoginPost({ body: loginData }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Đăng nhập thành công!';
          
          // Thêm kiểm tra nếu response là string thì parse JSON
          if (typeof response === 'string') {
            try {
              response = JSON.parse(response);
            } catch (e) {
              console.error('❌ Không parse được response JSON:', response);
              this.errorMessage = 'Phản hồi máy chủ không hợp lệ.';
              return;
            }
          }

          const userData = {
            userId: response.userId,
            username: response.username,
            email: response.email,
            role: response.role,
            token: response.token
          };

          // Sử dụng service để lưu thông tin người dùng
          this.authService.login(userData);

          this.loginSuccess.emit(userData);
          
          // Chuyển trang theo role
          const rolePath = userData.role?.toLowerCase() === 'admin' ? '/admin' : '/user/home';
          this.router.navigateByUrl(rolePath);
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

  onForgotPassword() {
    this.forgotPasswordClicked.emit();
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
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Mật khẩu'
    };
    return labels[fieldName] || fieldName;
  }
}
