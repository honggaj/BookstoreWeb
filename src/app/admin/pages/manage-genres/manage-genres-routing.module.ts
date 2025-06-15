import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreCreateComponent } from './genre-create/genre-create.component';
import { GenreUpdateComponent } from './genre-update/genre-update.component';

const routes: Routes = [
   { path: '', component: GenreListComponent },
  { path: 'genre-create', component: GenreCreateComponent },
  { path: 'genre-update/:id', component: GenreUpdateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageGenresRoutingModule { }
