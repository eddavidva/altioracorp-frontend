import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  successToast(text: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      text,
      showConfirmButton: false,
      timer: 2000
    });
  }

  errorAlert(text: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text
    });
  }

  async confirmDeleteAlert(text: string) {
    return Swal.fire({
      title: 'Advertencia!!!',
      icon: 'warning',
      text,
      confirmButtonText: 'Aceptar'
      // html: text
    });
  }
}



