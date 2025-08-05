import { Component } from '@angular/core';
import { DashboardService } from '../../../api/services';
import { DashboardStatsResponse } from '../../../api/models';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  username: string = '';
  isSidebarOpen: boolean = true;
   stats: DashboardStatsResponse = {
    totalUsers: 0,
    totalBooks: 0,
    totalCombos: 0,
    totalOrders: 0,
    totalSales: 0
  };
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

  this.dashboardService.apiDashboardStatsGet$Json().subscribe({
    next: (res: DashboardStatsResponse) => {
      this.stats = res;
    },
    error: (err) => {
      console.error('❌ Lỗi lấy thống kê:', err);
    }
  });
}


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
