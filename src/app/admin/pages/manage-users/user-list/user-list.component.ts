import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../api/services';
import { UserResponse } from '../../../../api/models';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  loading = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers(); // ✅ Gọi đúng hàm
  }

  loadUsers(): void {
    this.userService.apiUserGet$Json().subscribe({
      next: (res) => {
        this.users = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi khi load user:', err);
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/users/user-create']);
  }
  editUser(user: UserResponse): void {
    this.router.navigate(['/users/user-update', user.userId]);
    console.log('TODO: Mở form sửa sách', user);
  }

    deleteUser(id: number): void {
  if (confirm('Bạn có chắc muốn xoá người dùng này không?')) {
    this.userService.apiUserDeleteIdDelete({ id }).subscribe({
      next: () => {
        alert('🗑️ Xoá thành công!');
        this.loadUsers(); // load lại list
      },
      error: (err) => {
        console.error('❌ Lỗi xoá người dùng:', err);
        alert('❌ Xoá thất bại!');
      }
    });
  }
}


}
