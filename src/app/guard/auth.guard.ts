// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router) { }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      // Không redirect nữa để khỏi bung layout
      return false;
    }

    const user = JSON.parse(userJson);
    const url = '/' + route.path;

    if (url.startsWith('/admin') && user.role !== 'Admin') {
      // Cấm vào admin nếu không phải admin
      return false;
    }

    return true;
  }
  canActivate(): boolean {
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    this.router.navigate(['/auth/login']);
    return false;
  }
  const user = JSON.parse(userJson);

  if (user.role !== 'Admin') {
    this.router.navigate(['/user']); // quay về trang user
    return false;
  }

  return true;
}

}