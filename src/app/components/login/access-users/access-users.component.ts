import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { DatabaseService } from 'src/app/servicios/database.service';
@Component({
  selector: 'app-access-users',
  templateUrl: './access-users.component.html',
  styleUrls: ['./access-users.component.css']
})
export class AccessUsersComponent {

  @Input() arrayUsuarios : Array<Usuario> = [];
  @Output() usuarioElegidoEvent = new EventEmitter<Usuario>();

  constructor(public data: DatabaseService) {}

  seleccionarUsuario(user : Usuario)
  {
    this.usuarioElegidoEvent.emit(user);
  }
}
