import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderListComponent } from './pages/manage-orders/order-list/order-list.component';
import { UserListComponent } from './pages/manage-users/user-list/user-list.component';
import { BookListComponent } from './pages/manage-books/book-list/book-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, // cái layout chính có sidebar + topbar + router-outlet
    children: [
      {
        path: 'books',
        component: BookListComponent,
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: '',
        redirectTo: 'books', // hoặc 'dashboard' nếu bạn có
        pathMatch: 'full',
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
