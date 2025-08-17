import { Component, OnInit } from '@angular/core';
import { CrispService } from '../services/crisp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
   constructor(private crispService: CrispService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user && user.role === 'User') {
      this.crispService.load();
    }
  }
}