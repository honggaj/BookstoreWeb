import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../../api/services';
import { BookResponse } from '../../../../api/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-combo-create',
  standalone: false,
  templateUrl: './combo-create.component.html',
  styleUrls: ['./combo-create.component.css'] // ✅ fix: styleUrl ➜ styleUrls
})
export class ComboCreateComponent implements OnInit {
  comboForm!: FormGroup;
  books: BookResponse[] = [];
  selectedBookIds: number[] = [];
  selectedImageFile!: File;

  // ✅ Thêm FormBuilder vào constructor
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.comboForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      totalPrice: [0, Validators.required],
      discountPrice: [0, Validators.required]
    });

    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.apiBookGet$Json().subscribe(res => {
      this.books = res.data || [];
    });
  }

  onBookSelected(event: any): void {
    const bookId = Number(event.target.value);
    if (event.target.checked) {
      this.selectedBookIds.push(bookId);
    } else {
      this.selectedBookIds = this.selectedBookIds.filter(id => id !== bookId);
    }
  }

  onImageSelected(event: any): void {
    this.selectedImageFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.comboForm.invalid || this.selectedBookIds.length === 0) {
      alert('🚫 Bạn chưa điền đủ thông tin hoặc chưa chọn sách nào!');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.comboForm.value.name);
    formData.append('description', this.comboForm.value.description);
    formData.append('totalPrice', this.comboForm.value.totalPrice);
    formData.append('discountPrice', this.comboForm.value.discountPrice);
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
    this.selectedBookIds.forEach(id => formData.append('bookIds', id.toString()));

    this.http.post('http://localhost:5206/api/Combo/Create', formData).subscribe({
      next: () => {
        alert('✅ Tạo combo thành công!');
        this.router.navigate(['/combos']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Tạo combo thất bại');
      }
    });
  }
}
