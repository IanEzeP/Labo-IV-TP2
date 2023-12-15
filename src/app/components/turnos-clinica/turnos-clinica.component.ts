import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turnos-clinica',
  templateUrl: './turnos-clinica.component.html',
  styleUrls: ['./turnos-clinica.component.css']
})
export class TurnosClinicaComponent implements OnInit, OnDestroy{

  especialidades : any;
  especialistas : any;

  especialistaSeleccionado : any;
  especialidadSeleccionada : any;

  turnos : any;
  turnosFiltrados : any;
  viewCancel : boolean = false;

  fechaTurno! : string
  observableEspecialidades = Subscription.EMPTY;
  observableTurnos = Subscription.EMPTY;

  constructor(public data : DatabaseService, private alerta: AlertasService) {}

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
  
        if(this.especialistaSeleccionado != null) //Lo cambie, antes era "especialidadSeleccionada".
        {
          this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialidad == this.especialidadSeleccionada && turno.Especialista == this.especialistaSeleccionado);
        }
      }
    });
  }

  ngOnDestroy(): void 
  {
    this.observableEspecialidades.unsubscribe();
    this.observableTurnos.unsubscribe();
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

  public onCancelClick(turno : any)
  {
    this.viewCancel = true;
    this.fechaTurno = turno;
  }
  
  public async onCancelTurnoDismiss(cancel : boolean)
  {
    this.viewCancel = false;
    this.alerta.successToast("Turno cancelado.");
  }

}
