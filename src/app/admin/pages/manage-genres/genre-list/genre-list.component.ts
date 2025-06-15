import { Component } from '@angular/core';
import { GenreService } from '../../../../api/services';
import { Router } from '@angular/router';
import { GenreResponse } from '../../../../api/models';

@Component({
  selector: 'app-genre-list',
  standalone: false,
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent {
 genres: any[] = [];

  constructor(private genreService: GenreService, private router:Router) {}

  ngOnInit(): void {
    this.genreService.apiGenreGet$Json().subscribe({
      next: (res: any) => {
        this.genres = res.data || [];
      },
      error: err => console.error('Lỗi khi load thể loại:', err)
    });
  }

   createGenre(): void {
     this.router.navigate(['/genres/genre-create']);
   }
   editGenre(genre: GenreResponse): void {
     this.router.navigate(['/genres/genre-update', genre.genreId]);
     console.log('TODO: Mở form sửa sách', genre);
   }
 

  deleteGenre(id: number) {
    if (confirm('Xác nhận xóa?')) {
      alert(`TODO: Gọi API xóa thể loại ID: ${id}`);
    }
  }
}