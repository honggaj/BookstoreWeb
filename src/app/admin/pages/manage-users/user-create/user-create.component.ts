import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  userForm: FormGroup;
  isLoading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['User', Validators.required] // default là User
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const payload = this.userForm.value;

    this.userService.apiUserPost({ body: payload }).subscribe({
      next: () => {
        this.message = '🟢 Thêm người dùng thành công!';
        setTimeout(() => {
          this.router.navigate(['/users']); // Chuyển về list user
        }, 1000);
      },
      error: (err) => {
        console.error('❌ Lỗi khi thêm user:', err);
        this.message = '❌ Thêm người dùng thất bại!';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
