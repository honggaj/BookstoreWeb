import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-news',
  standalone: false,
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
 newsList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const apiUrl = 'https://gnews.io/api/v4/search?q=sách&lang=vi&token=YOUR_API_KEY';
    this.http.get<any>(apiUrl).subscribe({
      next: (res) => this.newsList = res.articles,
      error: (err) => console.error('Lỗi API:', err)
    });
  }
}