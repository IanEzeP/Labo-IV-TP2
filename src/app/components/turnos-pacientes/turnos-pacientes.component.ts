import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turnos-pacientes',
  templateUrl: './turnos-pacientes.component.html',
  styleUrls: ['./turnos-pacientes.component.css']
})
export class TurnosPacientesComponent implements OnInit, OnDestroy{
  
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
  viewMessage : boolean = false;

  inputFiltro : any;

  fechaTurno! : string

  observableEspecialidades = Subscription.EMPTY;
  observableTurnos = Subscription.EMPTY;

  constructor(private data : DatabaseService, private auth : AuthService) { }

  async ngOnInit()
  {
    this.cargarEspecialidades();
    this.cargarTurnos();
  }

  ngOnDestroy(): void 
  {
    this.observableEspecialidades.unsubscribe();
    this.observableTurnos.unsubscribe();
  }

  cargarEspecialidades()
  {
    this.observableEspecialidades = this.data.getCollectionObservable('Especialidades').subscribe((next : any) =>
    {
      this.especialidades = [];
      let result : Array<any> = next;

      result.forEach(especialidad =>
      {
        this.especialidades.push(especialidad.nombreEspecialidad);
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
        if(this.auth.idUser == turno.idPaciente)
        {
          this.turnos.push(turno);
          this.turnosFiltrados = this.turnos;
        }
      }
      );
    });
  }

  async onEspecialidadChange(especialidad : string) //No se llama nunca, debe ser exclusiva de Especialistas
  {
    this.especialistas = this.actualizarEspecialistas(especialidad);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }

  actualizarEspecialistas(especialidad : string) //No se llama nunca, debe ser exclusiva de Especialistas
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

  filtrarTurnos()
  {
    this.turnosFiltrados = this.turnos.filter((turno : any) =>
      Object.values(turno).some((valor: any) => 
      {
        if (typeof valor === 'string' || valor instanceof String) 
        {
          return valor.toLowerCase().includes(this.inputFiltro.toLowerCase());
        }
        else
        {
          if(typeof valor === 'number')
          {
            return valor.toString().toLowerCase().includes(this.inputFiltro.toLowerCase());
          }
          else 
          {
            if (typeof valor === 'object' && valor !== null) 
            {
              return Object.values(valor).some((valorAnidado: any) =>
                typeof valorAnidado === 'string' && valorAnidado.toLowerCase().includes(this.inputFiltro.toLowerCase())
              );
            }
          }
        }
        
        return false;
      })
    );
  }

  async onEspecialistaChange(especialista : any)  //No se llama nunca, debe ser exclusiva de Especialistas
  {
    this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialista == especialista && turno.Especialidad == this.especialidadSeleccionada);
  }

  limpiarFiltros()
  {
    this.inputFiltro = '';
    this.turnosFiltrados = this.turnos;
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
    this.especialistas = null;
  }

  //#region Visualizadores de componentes hijos

  onCancelClick(turno : any)
  {
    this.viewCancel = true;
    this.viewRate = false;
    this.viewEncuesta = false;
    this.fechaTurno = turno;
  }

  onRateTurnoClick(turno : any)
  {
    this.viewRate = true;
    this.viewEncuesta = false;
    this.viewCancel = false;
    this.viewMessage = false;
    this.fechaTurno = turno;
  }

  onEncuestaClick(turno : any)
  {
    this.viewEncuesta = true;
    this.viewCancel = false;
    this.viewRate = false;
    this.viewMessage = false;
    this.fechaTurno = turno;
  }

  onReseniaClick(turno : any)
  {
    this.viewMessage = true;
    this.viewEncuesta = false;
    this.viewCancel = false;
    this.viewRate = false;
    this.fechaTurno = turno;
  }
  //#endregion

  //#region Event listeners
  async onCancelTurnoDismiss()
  {
    this.viewCancel = false;
  }

  onRateTurnoDismiss()
  {
    this.viewRate = false;
  }

  onEncuestaTurnoDismiss()
  {
    this.viewEncuesta = false;
  }

  onReseniaTurnoDismiss()
  {
    this.viewMessage = false;
  }
  //#endregion
}
