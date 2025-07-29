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
bookBanners = [
  {
    image: 'assets/images/banner_bookstore.jpg',
    title: 'Sách nổi bật 1',
  },
  {
    image: 'assets/images/banner_bookstore_1.jpg',
    title: 'Sách nổi bật 2',
  },
  {
    image: 'assets/images/banner_bookstore_3.jpg',
    title: 'Sách nổi bật 3',
  },
];

responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '768px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1,
  },
];



  constructor(private bookService: BookService, private router: Router, private genreService: GenreService) {
  

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