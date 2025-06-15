import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookUpdateComponent } from './book-update/book-update.component';
import { BookListComponent } from './book-list/book-list.component';

const routes: Routes = [
   { path: '', component: BookListComponent },
  { path: 'book-create', component: BookCreateComponent },
  { path: 'book-update/:id', component: BookUpdateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageBooksRoutingModule { }
