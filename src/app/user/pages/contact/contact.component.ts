import { Component } from '@angular/core';
import { ContactFormDto } from '../../../api/models';
import { ContactService } from '../../../api/services';


@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
 contact: ContactFormDto = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};


  isSending = false;
  successMsg = '';
  errorMsg = '';

  constructor(private apiContact: ContactService) {}

  onSubmit() {
    this.isSending = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.apiContact.apiContactPost({ body: this.contact })
      .subscribe({
        next: () => {
          this.successMsg = 'Gửi email thành công!';
          this.isSending = false;
          this.contact = { name: '', email: '', phone: '', subject: '', message: '' };
        },
        error: (err) => {
          this.errorMsg = 'Gửi email thất bại!';
          this.isSending = false;
          console.error(err);
        }
      });
  }
}
