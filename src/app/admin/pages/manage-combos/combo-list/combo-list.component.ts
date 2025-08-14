import { Component, OnInit } from '@angular/core';
import { ComboResponse } from '../../../../api/models';
import { ComboService } from '../../../../api/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // import SweetAlert2

@Component({
  selector: 'app-combo-list',
  standalone: false,
  templateUrl: './combo-list.component.html',
  styleUrls: ['./combo-list.component.css'] // sửa thành styleUrls
})
export class ComboListComponent implements OnInit {
  combos: ComboResponse[] = [];
  pagedCombos: ComboResponse[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(private comboService: ComboService, private router: Router) {}

  ngOnInit(): void {
    this.loadCombos();
  }

  loadCombos(): void {
    this.comboService.apiComboGet$Json().subscribe({
      next: (res) => {
        this.combos = res.data || [];
        this.totalPages = Math.ceil(this.combos.length / this.itemsPerPage);
        this.updatePagedCombos();
      },
      error: (err) => console.error('Lỗi load combo:', err)
    });
  }

  updatePagedCombos(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedCombos = this.combos.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedCombos();
    }
  }

  createCombo(): void {
    this.router.navigate(['/combos/combo-create']);
  }

  editCombo(id: number): void {
    this.router.navigate(['/combos/combo-update', id]);
  }

  deleteCombo(id: number): void {
    Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Hành động này sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comboService.apiComboDeleteIdDelete({ id }).subscribe({
          next: () => {
            Swal.fire('Đã xoá!', 'Combo đã được xoá thành công.', 'success');
            this.loadCombos();
          },
          error: (err) => {
            console.error('Lỗi xoá combo:', err);
            Swal.fire('Lỗi', 'Xoá combo thất bại.', 'error');
          }
        });
      }
    });
  }
}
