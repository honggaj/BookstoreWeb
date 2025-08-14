import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherCreateComponent } from './voucher-create/voucher-create.component';

const routes: Routes = [
  {path: '', redirectTo: 'voucher-list', pathMatch: 'full'},
  {path:'voucher-list', component: VoucherListComponent},
  {path:'voucher-create',component:VoucherCreateComponent},
  {path:'voucher-update/:id', component: VoucherCreateComponent} // Assuming update uses the same component with id param
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageVouchersRoutingModule { }
