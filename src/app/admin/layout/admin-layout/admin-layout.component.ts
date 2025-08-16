import { Component } from '@angular/core';
import { DashboardService } from '../../../api/services';
import { DashboardStatsResponse } from '../../../api/models';
@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  username: string = '';
  isUserDropdownOpen = false;

  isSidebarOpen: boolean = true;
   
  constructor(private dashboardService: DashboardService) { }
ngOnInit(): void {
  // Nếu lưu dạng JSON
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      this.username = parsed.username || 'Guest';
    } catch (e) {
      this.username = 'Guest';
    }
  } else {
    this.username = 'Guest';
  }


}


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  toggleUserDropdown() {
  this.isUserDropdownOpen = !this.isUserDropdownOpen;
}

logout() {
  // Clear local storage / token, redirect login
  localStorage.clear();
  window.location.href = '/user'; // hoặc router.navigate(['/auth/login'])
}

}
