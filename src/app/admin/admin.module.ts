import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageBooksModule } from './pages/manage-books/manage-books.module';
import { ManageUsersModule } from './pages/manage-users/manage-users.module';
import { ManageOrdersModule } from './pages/manage-orders/manage-orders.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ManageBooksModule,
    ManageUsersModule,
    ManageOrdersModule
  ]
})
export class AdminModule { }
