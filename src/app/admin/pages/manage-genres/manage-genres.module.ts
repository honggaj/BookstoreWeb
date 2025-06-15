import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageGenresRoutingModule } from './manage-genres-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreCreateComponent } from './genre-create/genre-create.component';
import { GenreUpdateComponent } from './genre-update/genre-update.component';


@NgModule({
  declarations: [
    GenreListComponent,
    GenreCreateComponent,
    GenreUpdateComponent
  ],
  imports: [
    CommonModule,
    ManageGenresRoutingModule,
    ReactiveFormsModule
  ]
})
export class ManageGenresModule { }
