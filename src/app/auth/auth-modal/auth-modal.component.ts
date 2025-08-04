// auth-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  standalone: false,
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  @Input() isVisible = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();

  currentMode: 'login' | 'register' | 'forgot-password' | 'reset-password' = 'login';

  // Computed properties for template
  get isLoginMode() { return this.currentMode === 'login'; }
  get isRegisterMode() { return this.currentMode === 'register'; }
  get isForgotPasswordMode() { return this.currentMode === 'forgot-password'; }
  get isResetPasswordMode() { return this.currentMode === 'reset-password'; }

  setMode(mode: 'login' | 'register' | 'forgot-password' | 'reset-password') {
    this.currentMode = mode;
  }

  showForgotPassword() {
    this.setMode('forgot-password');
  }

  showResetPassword() {
    this.setMode('reset-password');
  }

  backToLogin() {
    this.setMode('login');
  }

  closeModal() {
    this.isVisible = false;
    this.modalClosed.emit();
    this.setMode('login');
  }

onLoginSuccess(userData: any) {
  console.log('📌 AuthModal received loginSuccess:', userData);
  this.loginSuccess.emit(userData);

  // Thêm dòng này: Bắn lại sự kiện 'user-logged-in'
  window.dispatchEvent(new Event('user-logged-in'));

  setTimeout(() => this.closeModal(), 1000);
}


  onRegisterSuccess() {
    setTimeout(() => {
      this.setMode('login');
    }, 2000);
  }

  onForgotPasswordSuccess() {
    setTimeout(() => {
      this.setMode('reset-password');
    }, 3000);
  }

  onResetPasswordSuccess() {
    setTimeout(() => {
      this.setMode('login');
    }, 2000);
  }
}