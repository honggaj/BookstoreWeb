import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderListComponent } from './pages/manage-orders/order-list/order-list.component';
import { UserListComponent } from './pages/manage-users/user-list/user-list.component';
import { AuthGuard } from '../guard/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // layout chính
        canActivate: [AuthGuard],  // <-- thêm đây

    children: [
        {
        path: 'dashboard',component:DashboardComponent,
         
      },
      {
        path: 'books',
        loadChildren: () =>
          import('./pages/manage-books/manage-books.module').then(m => m.ManageBooksModule)
      },
        {
        path: 'combos',
        loadChildren: () =>
          import('./pages/manage-combos/manage-combos.module').then(m => m.ManageCombosModule)
      },
      {
        path: 'genres',
        loadChildren: () =>
          import('./pages/manage-genres/manage-genres.module').then(m => m.ManageGenresModule)
      },
        {
        path: 'vouchers',
        loadChildren: () =>
          import('./pages/manage-vouchers/manage-vouchers.module').then(m => m.ManageVouchersModule)
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./pages/manage-orders/manage-orders.module').then(m => m.ManageOrdersModule)
      }, {
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
