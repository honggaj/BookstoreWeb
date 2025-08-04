import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserResponse } from '../../../api/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
// ...existing code...
export class NavbarComponent implements OnInit {
  isAuthModalVisible = false;
  isLoggedIn = false;
  username: string | null = null;
  isMobileMenuOpen = false;
currentUser: any = null;
  constructor(private router: Router) { }

ngOnInit() {
  this.checkAuthStatus();

  // Lắng nghe sự kiện login từ AuthModal
  window.addEventListener('user-logged-in', () => {
    console.log('📣 Đã nhận được sự kiện user-logged-in');
    this.checkAuthStatus();
  });
}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  onLoginSuccess(userData?: { username?: string }) {
    console.log('📌 Navbar received loginSuccess:', userData);
    this.isLoggedIn = true;
    this.username = userData?.username ?? null;
  }checkAuthStatus() {
  const userData = sessionStorage.getItem('user');
  if (userData) {
    this.currentUser = JSON.parse(userData);
    console.log('✅ User from session:', this.currentUser);
  } else {
    this.currentUser = null;
    console.log('⚠️ Không có user trong session');
  }
}



  logout() {
    sessionStorage.removeItem('user');
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/user/home']); // Điều hướng về trang chủ user
  }

  openAuthModal() {
    this.isAuthModalVisible = true;
  }

  closeAuthModal() {
    this.isAuthModalVisible = false;
    this.checkAuthStatus(); // Thêm dòng này để cập nhật lại username khi modal đóng
  }

}
