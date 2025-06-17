import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageOrdersRoutingModule } from './manage-orders-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderUpdateComponent } from './order-update/order-update.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';


@NgModule({
  declarations: [
    OrderListComponent,
    OrderCreateComponent,
    OrderUpdateComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    ManageOrdersRoutingModule
  ]
})
export class ManageOrdersModule { }
