import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../api/services';
import { UserResponse } from '../../../../api/models';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  loading = false;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.apiUserGet$Json().subscribe({
      next: (res) => {
        this.users = res.data || [];
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
      },
      error: (err) => {
        console.error('Lỗi khi load user:', err);
      }
    });
  }

  get paginatedUsers(): UserResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.users.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  createUser(): void {
    this.router.navigate(['/users/user-create']);
  }

  editUser(user: UserResponse): void {
    this.router.navigate(['/users/user-update', user.userId]);
  }

  deleteUser(id: number): void {
    if (confirm('Bạn có chắc muốn xoá người dùng này không?')) {
      this.userService.apiUserDeleteIdDelete({ id }).subscribe({
        next: () => {
          alert('🗑️ Xoá thành công!');
          this.loadUsers();
        },
        error: (err) => {
          console.error('❌ Lỗi xoá người dùng:', err);
          alert('❌ Xoá thất bại!');
        }
      });
    }
  }
}
