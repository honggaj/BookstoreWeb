import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageBooksModule } from './pages/manage-books/manage-books.module';
import { ManageUsersModule } from './pages/manage-users/manage-users.module';
import { ManageOrdersModule } from './pages/manage-orders/manage-orders.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { ManageGenresModule } from './pages/manage-genres/manage-genres.module';
import { ComboCreateComponent } from './pages/manage-combos/combo-create/combo-create.component';
import { ComboListComponent } from './pages/manage-combos/combo-list/combo-list.component';
import { ComboUpdateComponent } from './pages/manage-combos/combo-update/combo-update.component';
import { ManageCombosModule } from './pages/manage-combos/manage-combos.module';


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
    ManageOrdersModule,
    ManageGenresModule,
    ManageCombosModule
  ]
})
export class AdminModule { }
