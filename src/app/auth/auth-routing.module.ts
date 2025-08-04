import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLoginFormComponent } from './auth-login-form/auth-login-form.component';
import { AuthRegisterFormComponent } from './auth-register-form/auth-register-form.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { AuthForgotPasswordFormComponent } from './auth-forgot-password-form/auth-forgot-password-form.component';

const routes: Routes = [
  { path: 'login', component: AuthLoginFormComponent },
  { path: 'register', component: AuthRegisterFormComponent },
  { path: 'reset-password', component: AuthResetPasswordComponent },

  { path: 'forrgot-password', component: AuthForgotPasswordFormComponent },

  { path: '**', redirectTo: '' } // fallback nếu URL không khớp
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
