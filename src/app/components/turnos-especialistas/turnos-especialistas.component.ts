import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-turnos-especialistas',
  templateUrl: './turnos-especialistas.component.html',
  styleUrls: ['./turnos-especialistas.component.css']
})
export class TurnosEspecialistasComponent implements OnInit, OnDestroy{

  especialidades : any;
  pacientes : any;
  turnos : any;
  turnosFiltrados : any;

  especialidadSeleccionada : any;
  pacienteSeleccionado : any;
  turnoSeleccionado : any;

  viewCancel : boolean = false;
  viewRechazar : boolean = false;
  viewFinish : boolean = false;
  viewMessage : boolean = false;
  viewHistoria : boolean = false;

  inputFiltro : any;
  observableEspecialidades = Subscription.EMPTY;
  observableTurnos = Subscription.EMPTY;

  constructor(private data : DatabaseService, private auth : AuthService, private firestore: AngularFirestore) { }

  async ngOnInit()
  {
    this.data.traerDocumentoObservable('Especialistas', this.auth.idUser).subscribe((next : any) =>
    {
      this.especialidades = next.data().Especialidades;
    })
    console.log(this.especialidades);
    this.cargarTurnos();//Por las
  }
  
  ngOnDestroy(): void 
  {
    this.observableEspecialidades.unsubscribe();
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

  async onEspecialidadChange(especialidad : any)
  {
    this.turnos.forEach((turno : any) => {
      if(turno.Especialidad == especialidad)
      {
        //Me tengo que traer todos los pacientes que son atendidos por el medico logueado en la especialidad seleccionada.
      }
    });
    //this.pacientes = await this.data.GetPacientes('JoseFE', especialidad);
    console.log(this.pacientes);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }

  async onPacienteChange(paciente : any)
  {
    this.turnosFiltrados = this.turnos.filter((turno: { Paciente: any; }) => turno.Paciente == paciente);
  }

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
    let turnoFecha = 
    {
      day: turno.Dia,
      monthText: turno.Mes,
      year: turno['Año']
    }
    //let idTurno = await this.data.getTurnoIdByDateTime(turnoFecha, turno.Horario) || '';
    //console.log(idTurno);
    console.log(turnoFecha, turno.Horario);

    const documento = this.firestore.doc('Turnos/' + turno.id);
    documento.update({
      Estado: 'Esperando'
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

  async onCancelTurnoDismiss()
  {
    this.viewCancel = false;
  }

  async onRechazarTurnoDismiss()
  {
    this.viewRechazar = false;
  }

  async onFinishTurnosDismiss()
  {
    this.viewFinish = false;
  }

  async onReseniaTurnoDismiss()
  {
    this.viewMessage = false;
  }

  async onHsitoriaClinicaDismiss()
  {
    this.viewHistoria = false;
  }
}
