import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  public sweetAlert(titulo: string, mensaje: string, icono: any)
  {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono,
    });
  }

  public successToast(mensaje : string) : void
  {
    Swal.fire(
      {
        icon: 'success',
        title: mensaje,
        toast: true,
        position: 'bottom-right',
        timer: 3000,
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
      });
  }

  public infoToast(mensaje : string) : void
  {
    Swal.fire(
      {
        icon: 'info',
        title: mensaje,
        toast: true,
        position: 'bottom-right',
        timer: 3000,
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
      });
  }

  public successAlert(mensaje : string) : void
  {
    Swal.fire(
      {
        icon: 'success',
        title: mensaje,
      });
  }

  public failureAlert(mensaje : string) : void
  {
    Swal.fire(
      {
        icon: 'error',
        title: mensaje
      });
  }

}
