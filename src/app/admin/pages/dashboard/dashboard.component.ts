import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../api/services';
import { DashboardStatsResponse } from '../../../api/models';

@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats: DashboardStatsResponse = {
    totalUsers: 0,
    totalBooks: 0,
    totalCombos: 0,
    totalOrders: 0,
    totalSales: 0
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.apiDashboardStatsGet$Json().subscribe({
      next: (res: DashboardStatsResponse) => {
        this.stats = res;
      },
      error: (err) => {
        console.error('❌ Lỗi lấy thống kê:', err);
      }
    });
  }

}
