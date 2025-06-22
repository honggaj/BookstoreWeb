import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCombosRoutingModule } from './manage-combos-routing.module';
import { ComboCreateComponent } from './combo-create/combo-create.component';
import { ComboUpdateComponent } from './combo-update/combo-update.component';
import { ComboListComponent } from './combo-list/combo-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ComboListComponent,
    ComboCreateComponent,
    ComboUpdateComponent
  ],
  imports: [
    CommonModule,
    ManageCombosRoutingModule,
    ReactiveFormsModule
  ]
})
export class ManageCombosModule { }
