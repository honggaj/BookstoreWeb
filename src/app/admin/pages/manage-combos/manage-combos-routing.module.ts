import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComboListComponent } from './combo-list/combo-list.component';
import { ComboCreateComponent } from './combo-create/combo-create.component';
import { ComboUpdateComponent } from './combo-update/combo-update.component';

const routes: Routes = [
   { path: '', component: ComboListComponent },
  { path: 'combo-create', component: ComboCreateComponent },
  { path: 'combo-update/:id', component: ComboUpdateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCombosRoutingModule { }
