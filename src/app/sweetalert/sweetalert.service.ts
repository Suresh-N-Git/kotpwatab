import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})


export class SweetalertService {

  isMobile = window.innerWidth < 500;

  constructor() { }

  private baseOptions = {
    background: '#1e293b',
    color: '#f8fafc',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    customClass: {
      popup: 'rounded-2xl shadow-lg',
      title: 'text-lg font-semibold',
    },
  };

  show(
    title: string,
    text: string,
    icon: SweetAlertIcon = 'info',
    confirmText = 'OK'
  ) {
    return Swal.fire({
      ...this.baseOptions,
      title,
      text,
      icon,
      width: this.isMobile ? '80vw' : '512px',//👈 make it smaller (default is ~32em ≈ 512px)
      // padding: '1em',           // reduce internal spacing
      allowOutsideClick: false,  // 👈 disables click outside
      allowEscapeKey: false,     // 👈 disables ESC key
      confirmButtonText: confirmText,
      // allowEnterKey: false,      // 👈 disables Enter key
      // didOpen: () => {
      //   // 👇 manually disable Enter key
      //   Swal.getPopup()?.addEventListener('keydown', (e) => {
      //     if (e.key === 'Enter') e.preventDefault();
      //   });
      // }
    });
  }

  confirm(
    title: string,
    text: string,
    icon: SweetAlertIcon = 'warning'
  ) {
    return Swal.fire({
      ...this.baseOptions,
      title,
      text,
      icon,
      width: this.isMobile ? '80vw' : '512px',//👈 make it smaller (default is ~32em ≈ 512px)
      allowOutsideClick: false,  // 👈 disables click outside
      allowEscapeKey: false,     // 👈 disables ESC key
      allowEnterKey: false,      // 👈 disables Enter key
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',

    });
  }

  autoClose(
    title: string,
    text: string,
    icon: SweetAlertIcon = 'success',
    duration = 2000
  ) {
    return Swal.fire({
      ...this.baseOptions,
      title,
      text,
      icon,
      width: this.isMobile ? '80vw' : '512px',//👈 make it smaller (default is ~32em ≈ 512px)
      timer: duration,
      showConfirmButton: false,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }
}
