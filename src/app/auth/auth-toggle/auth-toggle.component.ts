import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-toggle',
  standalone: false,
  templateUrl: './auth-toggle.component.html',
})
export class AuthToggleComponent {
  
@Input() currentMode: 'login' | 'register' | 'forgot-password' | 'reset-password' = 'login';
@Output() modeChanged = new EventEmitter<'login' | 'register' | 'forgot-password' | 'reset-password'>();

get isLoginMode() { return this.currentMode === 'login'; }
get isRegisterMode() { return this.currentMode === 'register'; }

setMode(mode: 'login' | 'register' | 'forgot-password' | 'reset-password') {
  this.modeChanged.emit(mode);
}

}