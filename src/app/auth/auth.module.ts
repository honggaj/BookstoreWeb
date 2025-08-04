import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AuthToggleComponent } from './auth-toggle/auth-toggle.component';
import { AuthMessageComponent } from './auth-message/auth-message.component';
import { AuthRegisterFormComponent } from './auth-register-form/auth-register-form.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { AuthLoginFormComponent } from './auth-login-form/auth-login-form.component';
import { AuthForgotPasswordFormComponent } from './auth-forgot-password-form/auth-forgot-password-form.component';


@NgModule({
  declarations: [
    AuthModalComponent,
    AuthToggleComponent,
    AuthMessageComponent,
    AuthRegisterFormComponent,
    AuthHeaderComponent,
    AuthResetPasswordComponent,
    AuthLoginFormComponent,
    AuthForgotPasswordFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
   exports: [ // ⬅️ Thêm dòng này
    AuthModalComponent
  ]
})
export class AuthModule { }
