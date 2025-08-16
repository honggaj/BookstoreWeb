import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from '../../../api/services';

@Component({
  selector: 'app-best-sellers-chart',
  standalone: false,
  templateUrl: './best-sellers-chart.component.html',
  styleUrl: './best-sellers-chart.component.css'
})
export class BestSellersChartComponent implements OnInit {

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true
  };

  constructor(private dashboardService: DashboardService) { }

ngOnInit(): void {
  this.dashboardService.apiDashboardBestSellersGet$Json().subscribe(res => {
    const books = res.data ?? []; // fallback null/undefined
    const topBooks = books.slice(0, 5); // chỉ lấy top 10

    this.pieChartData.labels = topBooks.map(b => b.title ?? 'Unknown'); // fallback nếu title null
    this.pieChartData.datasets[0].data = topBooks.map(b => b.totalSold ?? 0); // fallback nếu totalSold undefined
  });
}


}