import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  usuario : any;
  atencionManiana : boolean = false;
  atencionTarde : boolean = false;
  //especialidades : any;
  //turnos : any;

  constructor(public auth: AuthService, private data: DatabaseService) {}

  ngOnInit(): void 
  {
    let coleccion = this.data.getCollectionByRol(this.auth.rol);
    let id = this.data.getIdByEmail(this.auth.email, coleccion);
    this.data.traerUnDocumento(coleccion, id).then(res => 
    {
      this.usuario = res.data();
      
      if(this.auth.rol == "ESPECIALISTA")
      {
        this.atencionManiana = this.usuario.TurnoMañana;
        this.atencionTarde = this.usuario.TurnoTarde;
      }
    });
  }

  public cambiarAtencion(time: string) 
  {
    if(time == 'tarde')
    {
      this.atencionTarde = !this.atencionTarde;
    }
    else
    {
      this.atencionManiana = !this.atencionManiana;
    }

    let horario = { TurnoMañana: this.atencionManiana, TurnoTarde: this.atencionTarde };
    
    this.data.actualizarHorarios(this.usuario.id, horario);
  }
  
}
