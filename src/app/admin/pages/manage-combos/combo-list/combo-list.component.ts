import { Component, OnInit } from '@angular/core';
import { ComboResponse } from '../../../../api/models';
import { ComboService } from '../../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-combo-list',
  standalone: false,
  templateUrl: './combo-list.component.html',
  styleUrl: './combo-list.component.css'
})
export class ComboListComponent implements OnInit {
  combos: ComboResponse[] = [];

  constructor(private comboService: ComboService, private router: Router) {}

  ngOnInit(): void {
    this.loadCombos();
  }

  loadCombos(): void {
    this.comboService.apiComboGet$Json().subscribe({
      next: (res) => {
        this.combos = res.data || [];
      },
      error: (err) => console.error('Lỗi load combo:', err)
    });
  }

  createCombo(): void {
    this.router.navigate(['/combos/combo-create']);
  }

  editCombo(id: number): void {
    this.router.navigate(['/combos/combo-update', id]);
  }

  deleteCombo(id: number): void {
    if (confirm('Bạn có chắc muốn xoá combo này không?')) {
      this.comboService.apiComboDeleteIdDelete({ id }).subscribe({
        next: () => {
          alert('Xoá combo thành công!');
          this.loadCombos();
        },
        error: (err) => console.error('Lỗi xoá combo:', err)
      });
    }
  }
}