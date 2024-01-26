import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Router } from '@angular/router';
import { GenerateFilesService } from 'src/app/servicios/generate-files.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit, OnDestroy {

  usuario : any;
  atencionManiana : boolean = false;
  atencionTarde : boolean = false;
  turnos : Array<any> = [];
  especialidades : Array<any> = [];

  observableTurnos = Subscription.EMPTY;
  observableEspecialidades = Subscription.EMPTY;

  constructor(public auth: AuthService, private data: DatabaseService, private router: Router, private file: GenerateFilesService) {}

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

    if(this.auth.rol == "PACIENTE")
    {
      this.observableTurnos = this.data.getCollectionObservable("Turnos").subscribe((next : any) => 
      {
        this.turnos = [];
        let result : Array<any> = next;
  
        result.forEach(turno =>
        {
          if(this.auth.idUser == turno.idPaciente && turno.Historia != null)
          {
            this.turnos.push(turno);
          }
        });
        
        this.turnos.sort((a, b) => b.Fecha - a.Fecha);
      });
      this.observableEspecialidades = this.data.getCollectionObservable("Especialidades").subscribe((next:any) =>
      {
        let res : Array<any> = next;

        res.forEach(especialidad =>
        {
          this.especialidades.push(especialidad);
        });
      })
    }
  }

  ngOnDestroy(): void
  {
    if(this.auth.rol == "PACIENTE")
    {
      this.observableTurnos.unsubscribe();
      this.observableEspecialidades.unsubscribe();
    }
  }
  
  consultarHistoriaClinica()
  {
    this.router.navigateByUrl("historial-clinico");
  }

  descargarHistoriaCompleta()
  {
    let turnos = this.turnos;
    turnos = turnos.filter((turno : {Historia : any}) => turno.Historia != null);
    
    let historiasArray = turnos.map((turno : any) =>
    {
      let unDatosHistoriaClinica: { [clave: string]: any } = {};

      for (let clave in turno.Historia) 
      {
        unDatosHistoriaClinica[clave] = turno.Historia[clave];
      }

      const datosHistoriaClinica = Object.fromEntries(Object.entries(unDatosHistoriaClinica).sort());
      
      return {
        Paciente: this.usuario.Nombre + "-" + this.usuario.Apellido,
        Especialista: this.data.getNameById(turno.idEspecialista, "Especialistas"),
        Especialidad: turno.Especialidad,
        Dia: turno.Dia,
        ...datosHistoriaClinica,
      }
    });

    this.file.historiaClinicaToPDF(historiasArray);
  }

  descargarHistoriaEspecialidad(especialidad : any)
  {
    let turnos = this.turnos;
    turnos = turnos.filter((turno : {Historia : any, Especialidad : any}) => turno.Historia != null && turno.Especialidad == especialidad.nombreEspecialidad);
    
    let historiasArray = turnos.map((turno : any) =>
    {
      let unDatosHistoriaClinica: { [clave: string]: any } = {};

      for (let clave in turno.Historia) 
      {
        unDatosHistoriaClinica[clave] = turno.Historia[clave];
      }

      const datosHistoriaClinica = Object.fromEntries(Object.entries(unDatosHistoriaClinica).sort());
      
      return {
        Paciente: this.usuario.Nombre + "-" + this.usuario.Apellido,
        Especialista: this.data.getNameById(turno.idEspecialista, "Especialistas"),
        Especialidad: turno.Especialidad,
        Dia: turno.Dia,
        ...datosHistoriaClinica,
      }
    });

    this.file.historiaClinicaToPDF(historiasArray);
  }

  cambiarAtencion(time: string) 
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
