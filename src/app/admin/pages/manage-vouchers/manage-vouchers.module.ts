import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageVouchersRoutingModule } from './manage-vouchers-routing.module';
import { VoucherCreateComponent } from './voucher-create/voucher-create.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VoucherCreateComponent,
    VoucherListComponent,
  ],
  imports: [
    CommonModule,
    ManageVouchersRoutingModule,
    ReactiveFormsModule
  ]
})
export class ManageVouchersModule { }
