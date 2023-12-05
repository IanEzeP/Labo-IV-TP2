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
  usersDisplay : Array<Usuario> = [];

  constructor()
  {
    for(let i = 0; i < this.arrayUsuarios.length; i++)
    {
      if(this.arrayUsuarios[i].id == "yjgmXjNiKczD6FQm9EAS" || this.arrayUsuarios[i].id == "ZyBUdgjqPvQxiKeOZ1Ku" || 
      this.arrayUsuarios[i].id == "mwh0vqwlYJGGWqxio7un" || this.arrayUsuarios[i].id == "7Lbf58mlBOKfqsooNnRG" ||
      this.arrayUsuarios[i].id == "OKMsZX5dTkqWFQ6lG7KT")
      {
        this.usersDisplay.push(this.arrayUsuarios[i]);
      }
    }
  }

  seleccionarUsuario(user : Usuario)
  {
    this.usuarioElegidoEvent.emit(user);
  }
}
