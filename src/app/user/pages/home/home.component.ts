import { Component } from '@angular/core';
import { BookResponse } from '../../../api/models';
import { BookService, GenreService } from '../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  books: BookResponse[] = [];
  loading = false;
  genres: any[] = [];
  currentSlide = 0;
  mainImages = [
    'https://i.pinimg.com/736x/f2/1e/3b/f21e3bb7773622e945aad2375224c93c.jpg',
    'https://img.freepik.com/free-vector/flat-social-media-cover-template-world-book-day-celebration_23-2150201450.jpg?size=626&ext=jpg',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/3ce709113389695.60269c221352f.jpg'
  ];
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private bookService: BookService, private router: Router, private genreService: GenreService) {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.mainImages.length;
    }, 3000); // đổi ảnh mỗi 3 giây

  } // ✅ bookService viết đúng tên

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
  }
  loadGenres(): void {
    this.loading = true;
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        this.genres = res.data || [];
      },
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }
  loadBooks(): void {
    this.loading = true;
    this.bookService.apiBookGet$Json().subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách:', err);
        this.loading = false;
      }
    });
  }
  loadBooksByGenre(genreId: number): void {
    this.loading = true;
    this.bookService.apiBookByGenreGenreIdGet$Json({ genreId }).subscribe({
      next: (res) => {
        this.books = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách theo thể loại:', err);
        this.loading = false;
      }
    });
  }


}