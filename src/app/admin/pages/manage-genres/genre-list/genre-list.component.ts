import { Component, OnInit } from '@angular/core';
import { GenreService } from '../../../../api/services';
import { Router } from '@angular/router';
import { GenreResponse } from '../../../../api/models';
import Swal from 'sweetalert2';

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
 deleteGenre(id: number): void {
    Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Hành động này sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.genreService.apiGenreIdDelete$Json({ id }).subscribe({
          next: () => {
            Swal.fire('Đã xoá!', 'Thể loại đã được xoá thành công.', 'success');
            this.loadGenres();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Lỗi', 'Xoá thể loại thất bại.', 'error');
          }
        });
      }
    });
  }
}