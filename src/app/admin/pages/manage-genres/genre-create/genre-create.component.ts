import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // 👈 THÊM NÈ
import { GenreService } from '../../../../api/services';

@Component({
  selector: 'app-genre-create',
  standalone: false,
  templateUrl: './genre-create.component.html',
  styleUrl: './genre-create.component.css'
})
export class GenreCreateComponent {

  genreForm: FormGroup;
  isLoading = false;
  message = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private router: Router // 👈 THÊM NÈ
  ) {
    this.genreForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.genreForm.invalid) return;

    this.isLoading = true;
    const payload = this.genreForm.value;

    this.genreService.apiGenrePost$Json({ body: payload }).subscribe({
      next: (res) => {
        this.message = '🟢 Thêm thể loại thành công!';
        this.isSuccess = true;
        this.router.navigate(['/genres']); // 👈 CHUYỂN TRANG OK
      },
      error: (err) => {
        this.message = '🔴 Có lỗi xảy ra khi thêm thể loại!';
        this.isSuccess = false;
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
