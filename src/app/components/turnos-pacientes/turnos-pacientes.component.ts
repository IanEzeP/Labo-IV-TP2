import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turnos-pacientes',
  templateUrl: './turnos-pacientes.component.html',
  styleUrls: ['./turnos-pacientes.component.css']
})
export class TurnosPacientesComponent implements OnInit, OnDestroy{
  
  turnos : any;
  turnosFiltrados : any;
  historia : any;

  viewCancel : boolean = false;
  viewRate : boolean = false;
  viewEncuesta : boolean = false;
  viewMessage : boolean = false;

  inputFiltro : any;
  fechaTurno! : string

  observableTurnos = Subscription.EMPTY;

  constructor(public data : DatabaseService, private auth : AuthService, private alerta: AlertasService) { }

  async ngOnInit()
  {
    this.cargarTurnos();
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
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
          turno.idEspecialista = this.data.getNameById(turno.idEspecialista, "Especialistas");
          this.turnos.push(turno);
          this.turnosFiltrados = this.turnos;
        }
      });
    });
  }

  filtrarTurnos()
  {
    this.turnosFiltrados = this.turnos.filter((turno : any) => //Aca "turno" es un objeto dentro del array "turnos". La idea es que "turnosFiltrados" contenga los turnos que cumplan con la condicion de busqueda del filtro (que devuelvan True).
      Object.values(turno).some((valor: any) => //Aca Object.values() devuelve un Array con los valores cargados en el turno Y Array.some() devuleve True o False si algún elemento del array cumple una condicion. Va a iterar sobre cada elemento del array, haciendo que en cada uno se evalue la condicion. 
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
              {
                if(typeof valorAnidado === 'number')
                {
                  valorAnidado = valorAnidado.toString();
                }
                return typeof valorAnidado === 'string' && valorAnidado.toLowerCase().includes(this.inputFiltro.toLowerCase());
              });
            }
          }
        }
        return false;
      })
    );
  }

  limpiarFiltros()
  {
    this.inputFiltro = '';
    this.turnosFiltrados = this.turnos;
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
    this.alerta.successToast("Turno cancelado.");
  }

  onRateTurnoDismiss()
  {
    this.viewRate = false;
    this.alerta.successToast("Valoración completada.");
  }

  onEncuestaTurnoDismiss()
  {
    this.viewEncuesta = false;
    this.alerta.successToast("Encuesta completada.");
  }

  onReseniaTurnoDismiss()
  {
    this.viewMessage = false;
  }
  //#endregion
}
