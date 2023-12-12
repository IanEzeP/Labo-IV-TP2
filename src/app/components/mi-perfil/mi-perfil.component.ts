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
  especialidades : any;
  turnos : any;

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
  
  public onDownloadHistoriaClick(especialidad : string)
  {
    let turnos;
    this.data.getTurnosByUserUserName(this.auth.userName).subscribe((x) =>
      {
        turnos = x;
        turnos = turnos.filter((turno : {HistoriaClinica : any, Especialidad : any}) => turno.HistoriaClinica != null && turno.Especialidad == especialidad);
        let historiasArray = turnos.map((turno : any) =>
        {
          let datosHistoriaClinica: { [clave: string]: any } = {};
          for (let clave in turno.HistoriaClinica) {
            datosHistoriaClinica[clave] = turno.HistoriaClinica[clave];
          }

          return {
            Paciente: turno.Paciente,
            Especialista: turno.Especialista,
            Especialidad: turno.Especialidad,
            Dia: turno.Dia,
            Mes: turno.Mes,
            ['Año']: turno.Año,
            ...datosHistoriaClinica,
          }
        });
        this.file.downloadPDF(historiasArray);
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
