import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { StoreComponent } from './pages/store/store.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'store', component: StoreComponent },
            { path: 'contact', component: ContactComponent },

            { path: 'book/:id', component: BookDetailComponent },

      // ... các trang khác của user
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
