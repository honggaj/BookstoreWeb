import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenreService } from '../../../../api/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-genre-update',
  standalone: false,
  templateUrl: './genre-update.component.html',
  styleUrls: ['./genre-update.component.css']
})
export class GenreUpdateComponent implements OnInit {
  genreForm: FormGroup;
  isLoading = false;
  message = '';
  isSuccess = false;
  genreId!: number;

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.genreForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.genreId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGenre();
  }

  loadGenre() {
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        const genre = res.data?.find((g: any) => g.genreId === this.genreId);
        if (genre) {
          this.genreForm.patchValue({ name: genre.name });
        } else {
          this.message = 'Không tìm thấy thể loại!';
          this.isSuccess = false;
        }
      },
      error: (err) => {
        console.error('Lỗi load thể loại:', err);
        this.message = 'Lỗi khi lấy dữ liệu thể loại!';
        this.isSuccess = false;
      }
    });
  }

  onSubmit() {
    if (this.genreForm.invalid) return;

    this.isLoading = true;
    const payload = this.genreForm.value;

    this.genreService.apiGenreUpdateIdPut$Json({
      id: this.genreId,
      body: payload
    }).subscribe({
      next: (res) => {
        this.message = res.message || '✅ Cập nhật thành công!';
          this.isSuccess = res.success ?? false;
        this.router.navigate(['/genres']);
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Có lỗi xảy ra khi cập nhật!';
        this.isSuccess = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
