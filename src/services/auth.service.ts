import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // ✅ Lấy user từ localStorage khi service khởi tạo
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(user: any) {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user)); // ✅ Lưu user khi login
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user'); // ✅ Xoá user khi logout
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
