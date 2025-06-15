import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, GenreService } from '../../../../api/services';
import { BookResponse } from '../../../../api/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book-update',
  standalone: false,
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css']
})
export class BookUpdateComponent implements OnInit {
  bookForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  message = '';
  isSuccess = false;
  genres: any[] = [];
  bookId!: number;
  currentCoverImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGenres();
    this.loadBook();
  }

  loadGenres() {
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => this.genres = res?.data || [],
      error: (err) => console.error('Lỗi load thể loại:', err)
    });
  }

  loadBook() {
    this.bookService.apiBookGet$Json().subscribe({
      next: (res) => {
        const book = res.data?.find((b: BookResponse) => b.bookId === this.bookId);
        if (book) {
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            genreId: book.genreId,
            price: book.price,
            stock: book.stock,
            description: book.description,
            publishedDate: book.publishedDate,
            coverImageUrl: book.coverImageUrl
          });
          this.currentCoverImageUrl = book.coverImageUrl || '';
        }
      },
      error: (err) => console.error('Lỗi load sách:', err)
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
      const formData = new FormData();
      const formValues = this.bookForm.value;

      formData.append('Title', formValues.title || '');
      formData.append('Author', formValues.author || '');
      formData.append('GenreId', formValues.genreId?.toString() || '');
      formData.append('Price', formValues.price?.toString() || '0');
      formData.append('Stock', formValues.stock?.toString() || '0');
      formData.append('Description', formValues.description || '');

      const date = new Date(formValues.publishedDate);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      formData.append('PublishedDate', formattedDate || '');

      if (this.selectedFile) {
        formData.append('CoverImage', this.selectedFile, this.selectedFile.name);
      }

      this.http.put(`/api/Book/Update/${this.bookId}`, formData).subscribe({
        next: (res: any) => {
          this.isSuccess = res.success ?? false;
          this.message = res.message || 'Cập nhật thành công!';
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Lỗi update:', err);
          this.message = 'Cập nhật thất bại!';
          this.isSubmitting = false;
        }
      });
    }
  }
}
