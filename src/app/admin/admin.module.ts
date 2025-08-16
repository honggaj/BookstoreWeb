import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageBooksModule } from './pages/manage-books/manage-books.module';
import { ManageUsersModule } from './pages/manage-users/manage-users.module';
import { ManageOrdersModule } from './pages/manage-orders/manage-orders.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { ManageGenresModule } from './pages/manage-genres/manage-genres.module';

import { ManageCombosModule } from './pages/manage-combos/manage-combos.module';

import { ManageVouchersModule } from './pages/manage-vouchers/manage-vouchers.module';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { BestSellersChartComponent } from './components/best-sellers-chart/best-sellers-chart.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    RevenueChartComponent,
    BestSellersChartComponent,
    AdminLayoutComponent,

    
   
    
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ManageBooksModule,
    ManageUsersModule,
    ManageOrdersModule,
    ManageGenresModule,
    ManageCombosModule,
    ManageVouchersModule,
    NgChartsModule,
    
  ]
})
export class AdminModule { }
