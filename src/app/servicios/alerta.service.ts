import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  public successToast(mensaje : string) : void
  {
    Swal.fire(
      {
        icon: 'success',
        title: mensaje,
        toast: true,
        position: 'top-end',
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
        position: 'top-end',
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
/*
  public async inputText(mensaje : string)
  {
    const { value: string } = await Swal.fire({
        icon: 'question',
        title: mensaje,
        input: "text",
        inputValidator: (value) => {
          if(!value) {
            return "Ingrese una especialidad";
          }
        }
      });
  }*/
}
