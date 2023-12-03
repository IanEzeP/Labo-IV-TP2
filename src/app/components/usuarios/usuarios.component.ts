import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  showListado : boolean = true;
  showAcceso : boolean = false;
  showRegistro : boolean = false;

  onConsultarClick()
  {
    this.showListado = true;
    this.showAcceso= false;
    this.showRegistro = false;
  }

  onHabilitarClick()
  {
    this.showListado = false;
    this.showAcceso= true;
    this.showRegistro = false;
  }

  onRegistrarClick()
  {
    this.showListado = false;
    this.showAcceso= false;
    this.showRegistro = true;
  }
}
