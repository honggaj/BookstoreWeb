import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenreService } from '../../../../api/services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book-create',
  standalone: false,
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  bookForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  message = '';
  isSuccess = false;
  genres: any[] = [];

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private http: HttpClient
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genreId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      publishedDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres() {
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        this.genres = res?.data || [];
      },
      error: (err) => {
        console.error('Lỗi load thể loại', err);
      }
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.isSubmitting = true;
      this.message = '';
      const formValues = this.bookForm.value;
      const formData = new FormData();

      formData.append('Title', formValues.title.trim());
      formData.append('Author', formValues.author.trim());
      formData.append('GenreId', formValues.genreId.toString());
      formData.append('Price', formValues.price.toString());
      formData.append('Stock', formValues.stock.toString());

      if (formValues.description?.trim()) {
        formData.append('Description', formValues.description.trim());
      }

      const date = new Date(formValues.publishedDate);
      if (!isNaN(date.getTime())) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        formData.append('PublishedDate', formattedDate);
      }

      if (this.selectedFile) {
        formData.append('CoverImage', this.selectedFile, this.selectedFile.name);
      }

      this.http.post<any>('http://localhost:5206/api/Book/Create', formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.isSuccess = res?.success;
          this.message = res?.message || 'Thêm sách thành công!';
          if (res?.success) {
            this.resetForm();
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.isSuccess = false;

          let errorMessage = 'Có lỗi xảy ra khi thêm sách!';
          if (err.error?.errors) {
            const validationErrors = err.error.errors;
            const errorMessages: string[] = [];
            Object.keys(validationErrors).forEach(key => {
              if (Array.isArray(validationErrors[key])) {
                errorMessages.push(`${key}: ${validationErrors[key].join(', ')}`);
              } else {
                errorMessages.push(`${key}: ${validationErrors[key]}`);
              }
            });
            if (errorMessages.length > 0) {
              errorMessage = 'Lỗi xác thực: ' + errorMessages.join('; ');
            }
          } else if (err.error?.title) {
            errorMessage = err.error.title;
          }

          this.message = errorMessage;
        }
      });

    } else {
      Object.keys(this.bookForm.controls).forEach(key => {
        const control = this.bookForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
        control?.markAsTouched();
      });
    }
  }

  private resetForm() {
    this.bookForm.reset({
      title: '',
      author: '',
      genreId: '',
      price: 0,
      stock: 0,
      description: '',
      publishedDate: ''
    });
    this.selectedFile = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} là bắt buộc`;
      }
      if (field.errors['min']) {
        return `${fieldName} phải lớn hơn ${field.errors['min'].min}`;
      }
    }
    return '';
  }
}
