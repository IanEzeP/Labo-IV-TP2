import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turnos-especialistas',
  templateUrl: './turnos-especialistas.component.html',
  styleUrls: ['./turnos-especialistas.component.css']
})
export class TurnosEspecialistasComponent implements OnInit, OnDestroy{

  pacientes : any;//
  turnos : any;
  turnosFiltrados : any;

  especialidadSeleccionada : any;//
  pacienteSeleccionado : any;//
  turnoSeleccionado : any;

  viewCancel : boolean = false;
  viewRechazar : boolean = false;
  viewFinish : boolean = false;
  viewMessage : boolean = false;
  viewHistoria : boolean = false;

  inputFiltro : any;
  observableTurnos = Subscription.EMPTY;

  constructor(public data : DatabaseService, private auth : AuthService, private firestore: AngularFirestore, private alerta: AlertasService) { }

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
        if(this.auth.idUser == turno.idEspecialista)
        {
          this.turnos.push(turno);
          this.turnosFiltrados = this.turnos;
          
        }
      });
      if(this.especialidadSeleccionada != null)
      {
        this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == this.especialidadSeleccionada);
  
        if(this.pacienteSeleccionado != null)
        {
          this.turnosFiltrados = this.turnos.filter((turno: { Paciente: any; Especialidad : any;}) => turno.Especialidad == this.especialidadSeleccionada && turno.Paciente == this.pacienteSeleccionado);
        }
      }
    });
  }

  onLimpiarFiltrosClick()
  {
    this.inputFiltro = '';
    this.turnosFiltrados = this.turnos;
    this.especialidadSeleccionada = null;
    this.pacienteSeleccionado = null;
    this.pacientes = null;
  }

  filtrarTurnos()
  {
    this.turnosFiltrados = this.turnos.filter((turno : any) =>
      Object.values(turno).some((valor: any) => {
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

  //#region Visualizadores de componentes hijos

  onCancelClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewCancel = true;
    this.viewRechazar = false;
    this.viewMessage = false;
    this.viewFinish = false;
  }

  public async onAcceptTurnoClick(turno : any)
  {
    const documento = this.firestore.doc('Turnos/' + turno.id);
    documento.update({
      Estado: 'Aceptado'
    })
  }

  async onRechazarTurnoClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewRechazar = true;
    this.viewCancel = false;
    this.viewMessage = false;
    this.viewFinish = false;
    this.viewHistoria = false;
  }

  async onFinishTurnoClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewFinish = true;
    this.viewRechazar = false;
    this.viewCancel = false;
    this.viewMessage = false;
    this.viewHistoria = false;
  }

  async onViewMessageClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewMessage = true;
    this.viewFinish = false;
    this.viewRechazar = false;
    this.viewCancel = false;
    this.viewHistoria = false;
  }

  async onHistoraClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewHistoria = true;
    this.viewMessage = false;
    this.viewFinish = false;
    this.viewRechazar = false;
    this.viewCancel = false;
  }
  //#endregion

  //#region Event listeners

  async onCancelTurnoDismiss()
  {
    this.viewCancel = false;
    this.alerta.successToast("Turno cancelado.");
  }

  async onRechazarTurnoDismiss()
  {
    this.viewRechazar = false;
    this.alerta.successToast("Turno rechazado.");
  }

  async onFinishTurnosDismiss()
  {
    this.viewFinish = false;
    this.alerta.successToast("Turno finalizado.");
  }

  async onReseniaTurnoDismiss()
  {
    this.viewMessage = false;
  }

  async onHistoriaClinicaDismiss()
  {
    this.viewHistoria = false;
  }
  //#endregion
}
