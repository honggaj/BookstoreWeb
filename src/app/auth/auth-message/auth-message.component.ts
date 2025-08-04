import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-message',
  standalone: false,
  templateUrl: './auth-message.component.html',
})
export class AuthMessageComponent {
 @Input() message: string | null = null;
  @Input() type: 'success' | 'error' = 'success';
}
