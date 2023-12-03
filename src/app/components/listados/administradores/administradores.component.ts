import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent {

  @Input() listaAdministradores : Array<Usuario> = [];
  @Output() AdministradorSeleccionadoEvent = new EventEmitter<Usuario>();

  seleccionarAdministrador(admin : Usuario)
  {
    this.AdministradorSeleccionadoEvent.emit(admin);
  }
}
