import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { StoreComponent } from './pages/store/store.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NewsComponent } from './pages/news/news.component';
import { CartComponent } from './pages/cart/cart.component';
import { AccountComponent } from './pages/account/account.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { AboutComponent } from './pages/about/about.component';
import { HistoryComponent } from './pages/history/history.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'store', component: StoreComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'news', component: NewsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'account', component: AccountComponent },
      { path: 'about', component: AboutComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'favorite', component: FavoriteComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'search', component: SearchPageComponent },

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
