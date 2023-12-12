import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turnos-clinica',
  templateUrl: './turnos-clinica.component.html',
  styleUrls: ['./turnos-clinica.component.css']
})
export class TurnosClinicaComponent {

  especialidades : any;
  especialistas : any;

  especialistaSeleccionado : any;
  especialidadSeleccionada : any;
  ratingSeleccionado : number = 0;

  turnos : any;

  turnosFiltrados : any;
  viewCancel : boolean = false;
  viewRate : boolean = false;
  viewEncuesta : boolean = false;

  fechaTurno! : string
  observableEspecialidades = Subscription.EMPTY;
  observableTurnos = Subscription.EMPTY;

  constructor(private data : DatabaseService, private auth : AuthService) {}

  async ngOnInit()
  {
    this.cargarEspecialidades();
    this.cargarTurnos();
  }

  cargarEspecialidades()
  {
    this.observableEspecialidades = this.data.getCollectionObservable('Especialidades').subscribe((next : any) =>
    {
      this.especialidades = [];
      let result : Array<any> = next;

      result.forEach(especialidad =>
      {
        this.especialidades.push(especialidad);
      }
      );
    });
  }

  cargarTurnos()
  {
    this.observableTurnos = this.data.getCollectionObservable('Turnos').subscribe((next : any) =>
    {
      this.turnos = [];
      this.turnosFiltrados = [];
      let result : Array<any> = next;

      result.forEach(turno =>
      {
        this.turnos.push(turno);
        this.turnosFiltrados = this.turnos;
      });
      if(this.especialidadSeleccionada != null)
      {
        this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == this.especialidadSeleccionada);
  
        if(this.especialidadSeleccionada != null) //Sera especialistaSeleccionado?
        {
          this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialidad == this.especialidadSeleccionada && turno.Especialista == this.especialistaSeleccionado);
        }
      }
    });
  }

  public async onEspecialidadChange(especialidad : any)
  {
    this.especialistas = this.actualizarEspecialistas(especialidad);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }

  actualizarEspecialistas(especialidad : string)
  {
    let especialistas : Array<any> = [];
    this.data.especDB.forEach(espec => {
      if(espec.especialidades.includes(especialidad))
      {
        especialistas.push(espec);
      }
    });
    return especialistas;
  }

  public async onEspecialistaChange(especialista : any)
  {
    this.turnosFiltrados = this.turnos.filter((turno: { idEspecialista: any; Especialidad : any;}) => turno.idEspecialista == especialista.id && turno.Especialidad == this.especialidadSeleccionada);
  }

  public onLimpiarFiltrosClick()
  {
    this.turnosFiltrados = this.turnos;
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
    this.especialistas = null;
  }

  public onCancelClick(turno : any) //La unica usada
  {
    this.viewCancel = true;
    this.viewRate = false;
    this.viewEncuesta = false;
    this.fechaTurno = turno;
  }

  public onRateTurnoClick(turno : any)
  {
    this.viewRate = true;
    this.viewEncuesta = false;
    this.viewCancel = false;
    this.fechaTurno = turno;
  }

  public onEncuestaClick(turno : any)
  {
    this.viewEncuesta = true;
    this.viewCancel = false;
    this.viewRate = false;
    this.fechaTurno = turno;
  }

  public async onCancelTurnoDismiss(cancel : boolean) //La unica usada
  {
    this.viewCancel = false;
  }

  public onRateTurnoDismiss()
  {
    this.viewRate = false;
  }

  public onEncuestaTurnoDismiss()
  {
    this.viewEncuesta = false;
  }
}
