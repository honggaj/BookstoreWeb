// auth-header.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  standalone: false,
  templateUrl: './auth-header.component.html',
})
export class AuthHeaderComponent {
  @Input() currentMode: 'login' | 'register' | 'forgot-password' | 'reset-password' = 'login';
  @Output() closeClicked = new EventEmitter<void>();

  get headerText(): string {
    switch (this.currentMode) {
      case 'login': return 'Chào mừng bạn trở lại!';
      case 'register': return 'Tạo tài khoản mới';
      case 'forgot-password': return 'Khôi phục mật khẩu';
      case 'reset-password': return 'Đặt lại mật khẩu';
      default: return '';
    }
  }

  onClose() {
    this.closeClicked.emit();
  }
}