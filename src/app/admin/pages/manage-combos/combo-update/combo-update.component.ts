import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService, ComboService } from '../../../../api/services';
import { BookResponse, ComboResponse } from '../../../../api/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-combo-update',
  standalone: false,
  templateUrl: './combo-update.component.html',
  styleUrls: ['./combo-update.component.css']
})
export class ComboUpdateComponent implements OnInit {
  comboForm!: FormGroup;
  comboId!: number;
  books: BookResponse[] = [];
  selectedBookIds: number[] = [];
  selectedImageFile!: File;
imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private comboService: ComboService,
    private bookService: BookService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.comboId = +this.route.snapshot.paramMap.get('id')!;
    
    this.comboForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      totalPrice: [0, Validators.required],
      discountPrice: [0, Validators.required]
    });

    this.loadBooks();
    
    this.loadCombo();
  }

  loadBooks(): void {
    this.bookService.apiBookGet$Json().subscribe(res => {
      this.books = res.data || [];
    });
  }

 loadCombo(): void {
  this.comboService.apiComboIdGet$Json({ id: this.comboId }).subscribe(res => {
    const combo: ComboResponse = res.data!;
    
    this.comboForm.patchValue({
      name: combo.name,
      description: combo.description,
      totalPrice: combo.totalPrice,
      discountPrice: combo.discountPrice
    });

    this.selectedBookIds = combo.books?.map(b => b.bookId!).filter(Boolean) || [];

    this.imagePreviewUrl = combo.image ?? null; // ✅ Set URL ảnh cũ từ BE để hiển thị preview
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

    this.http.put(`http://localhost:5206/api/Combo/Update/${this.comboId}`, formData).subscribe({
      next: () => {
        alert('✅ Cập nhật combo thành công!');
        this.router.navigate(['/combos']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Cập nhật combo thất bại');
      }
    });
  }
}
