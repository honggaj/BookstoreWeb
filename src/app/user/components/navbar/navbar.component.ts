// navbar.component.ts - Fixed version
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

interface User {
  id?: number;
  username?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAuthModalVisible = false;
  isLoggedIn = false;
  currentUser: User | null = null;
  displayName = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    
    console.log('🔍 Checking auth status - Token exists:', !!token, 'User data:', user);
    
    if (token && user) {
      try {
        this.currentUser = JSON.parse(user);
        this.isLoggedIn = true;
        this.displayName = this.currentUser?.username || 
                          this.currentUser?.email || 
                          'User';
        
        console.log('✅ User is logged in as:', this.displayName);
        console.log('📊 Current state - isLoggedIn:', this.isLoggedIn, 'displayName:', this.displayName);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        this.logout();
      }
    } else {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.displayName = '';
      console.log('❌ User is not logged in');
    }
  }

  openAuthModal() {
    this.isAuthModalVisible = true;
  }

  closeAuthModal() {
    this.isAuthModalVisible = false;
  }

  onLoginSuccess(userData?: User) {
    console.log('🎉 Login success event received:', userData);
    
    // CẬP NHẬT STATE NGAY LẬP TỨC
    this.isLoggedIn = true;
    
    if (userData) {
      this.currentUser = userData;
      this.displayName = (userData as any).displayName || 
                        userData.username || 
                        userData.email || 
                        'User';
      
      console.log('✅ Updated display name to:', this.displayName);
      console.log('📊 New state - isLoggedIn:', this.isLoggedIn, 'displayName:', this.displayName);
    }
    
    // Force change detection
    this.cdr.detectChanges();
    
    // KHÔNG GỌI checkAuthStatus() NỮA - vì nó có thể reset state
    // this.checkAuthStatus(); // ❌ BỎ DÒNG NÀY
    
    console.log('🔄 State after login success - isLoggedIn:', this.isLoggedIn, 'displayName:', this.displayName);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username');
    
    this.isLoggedIn = false;
    this.currentUser = null;
    this.displayName = '';
    
    console.log('🚪 User logged out');
    this.cdr.detectChanges();
  }
}