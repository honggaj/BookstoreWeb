import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderListComponent } from './pages/manage-orders/order-list/order-list.component';
import { UserListComponent } from './pages/manage-users/user-list/user-list.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, // layout chính
      children: [
      {
        path: 'books',
        loadChildren: () =>
          import('./pages/manage-books/manage-books.module').then(m => m.ManageBooksModule)
      },
       {
        path: 'genres',
        loadChildren: () =>
          import('./pages/manage-genres/manage-genres.module').then(m => m.ManageGenresModule)
      },
      { path: 'orders', component: OrderListComponent },
         {
        path: 'users',
        loadChildren: () =>
          import('./pages/manage-users/manage-users.module').then(m => m.ManageUsersModule)
      },
      { path: '', redirectTo: 'books', pathMatch: 'full' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
