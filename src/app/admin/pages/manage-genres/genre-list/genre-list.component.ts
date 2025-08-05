import { Component, OnInit } from '@angular/core';
import { GenreService } from '../../../../api/services';
import { Router } from '@angular/router';
import { GenreResponse } from '../../../../api/models';

@Component({
  selector: 'app-genre-list',
  standalone: false,
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent implements OnInit {
  genres: GenreResponse[] = [];
  pagedGenres: GenreResponse[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private genreService: GenreService, private router: Router) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        this.genres = res.data || [];
        this.totalPages = Math.ceil(this.genres.length / this.itemsPerPage);
        this.updatePagedGenres();
      },
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }

  updatePagedGenres(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedGenres = this.genres.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedGenres();
    }
  }

  createGenre(): void {
    this.router.navigate(['/genres/genre-create']);
  }

  editGenre(genre: GenreResponse): void {
    this.router.navigate(['/genres/genre-update', genre.genreId]);
    console.log('TODO: Mở form sửa thể loại', genre);
  }

  deleteGenre(id: number) {
    if (confirm('Xác nhận xóa?')) {
      alert(`TODO: Gọi API xóa thể loại ID: ${id}`);
    }
  }
}
