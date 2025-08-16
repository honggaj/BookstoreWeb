import { Component } from '@angular/core';
import { ContactFormDto } from '../../../api/models';
import { ContactService } from '../../../api/services';
import Swal from 'sweetalert2';

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

  constructor(private apiContact: ContactService) {}

  onSubmit() {
    this.isSending = true;

    this.apiContact.apiContactSendPost({ body: this.contact })
      .subscribe({
        next: () => {
          this.isSending = false;
          this.contact = { name: '', email: '', phone: '', subject: '', message: '' };

          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Gửi email thành công!',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          this.isSending = false;
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Thất bại!',
            text: 'Gửi email thất bại. Vui lòng thử lại.',
          });
        }
      });
  }
}
