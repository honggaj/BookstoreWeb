import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../../api/services';
import { RevenueResponse } from '../../../api/models';

@Component({
  selector: 'app-revenue-chart',
  standalone: false,
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.css']
})
export class RevenueChartComponent implements OnInit {

  // Chart config
labels: string[] = [];
data: number[] = [];

  chartType: ChartType = 'bar';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadMonthlyRevenue(); // default load monthly
  }

  loadMonthlyRevenue() {
    this.dashboardService.apiDashboardRevenueMonthlyGet$Json().subscribe({
      next: (res: RevenueResponse[]) => {
        this.labels = res.map(r => r.label ?? ''); // fallback empty string
        this.data = res.map(r => r.totalRevenue ?? 0); // fallback 0
      }
    });
  }

  loadWeeklyRevenue() {
    this.dashboardService.apiDashboardRevenueWeeklyGet$Json().subscribe({
      next: (res: RevenueResponse[]) => {
        this.labels = res.map(r => r.label ?? '');
        this.data = res.map(r => r.totalRevenue ?? 0);
      }
    });
  }

  loadYearlyRevenue() {
    this.dashboardService.apiDashboardRevenueYearlyGet$Json().subscribe({
      next: (res: RevenueResponse[]) => {
        this.labels = res.map(r => r.label ?? '');
        this.data = res.map(r => r.totalRevenue ?? 0);
      }
    });
  }
}
