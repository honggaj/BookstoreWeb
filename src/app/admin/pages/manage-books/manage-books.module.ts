import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageBooksRoutingModule } from './manage-books-routing.module';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookUpdateComponent } from './book-update/book-update.component';
import { BookListComponent } from './book-list/book-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BookCreateComponent,
    BookUpdateComponent,
    BookListComponent
  ],
  imports: [
    CommonModule,
    ManageBooksRoutingModule,
    ReactiveFormsModule
  ]
})
export class ManageBooksModule { }
