import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';

@Component({
  selector: 'app-access-users',
  templateUrl: './access-users.component.html',
  styleUrls: ['./access-users.component.css']
})
export class AccessUsersComponent {

  @Input() arrayUsuarios : Array<Usuario> = [];
  @Output() usuarioElegidoEvent = new EventEmitter<Usuario>();

  seleccionarUsuario(user : Usuario)
  {
    this.usuarioElegidoEvent.emit(user);
  }
}
