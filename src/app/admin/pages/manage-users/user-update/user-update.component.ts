import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../api/services';

@Component({
  selector: 'app-user-update',
  standalone: false,
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  userId!: number;
  isLoading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required]
      // Không sửa password ở đây
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
  }

  loadUser(): void {
    this.userService.apiUserGet$Json().subscribe({
      next: (res) => {
        const user = res.data?.find(u => u.userId === this.userId);
        if (user) {
          this.userForm.patchValue({
            username: user.username,
            email: user.email,
            role: user.role
          });
        }
      },
      error: (err) => {
        console.error('❌ Lỗi khi lấy thông tin user:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const payload = this.userForm.value;

    this.userService.apiUserUpdateIdPut({
      id: this.userId,
      body: payload
    }).subscribe({
      next: () => {
        this.message = '✅ Cập nhật người dùng thành công!';
        setTimeout(() => this.router.navigate(['/users']), 1000);
      },
      error: (err) => {
        console.error('❌ Lỗi khi cập nhật:', err);
        this.message = '❌ Cập nhật thất bại!';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
