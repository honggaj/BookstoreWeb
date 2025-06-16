import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserResponse } from '../../../api/models';


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

  ngOnInit() {
    this.checkAuthStatus();
  }

    onLoginSuccess(userData?: { username?: string }) {
    this.isLoggedIn = true;
    this.username = userData?.username ?? null;
    console.log('onLoginSuccess:', this.username);
  }
  
  checkAuthStatus() {
    const user = sessionStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      this.username = userObj.username;
      this.isLoggedIn = !!this.username;
      console.log('checkAuthStatus:', this.username);
    } else {
      this.isLoggedIn = false;
      this.username = null;
    }
  }

  logout() {
    sessionStorage.removeItem('user');
    this.isLoggedIn = false;
    this.username = null;
  }


  openAuthModal() {
    this.isAuthModalVisible = true;
  }

 closeAuthModal() {
  this.isAuthModalVisible = false;
  this.checkAuthStatus(); // Thêm dòng này để cập nhật lại username khi modal đóng
}

}
