import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pedir-turno',
  templateUrl: './pedir-turno.component.html',
  styleUrls: ['./pedir-turno.component.css']
})
export class PedirTurnoComponent implements OnInit, OnDestroy{

  especialidades : Array<any> = [];
  especialistasBD : Array<any> = [];
  turnosBD : Array<any> = [];
  pacientesBD : Array<any> = [];
  especDisplay : Array<any> = [];
  especialidadSeleccionada : string = '';
  especialistaSeleccionado : any;
  pacienteSeleccionado : any;

  esAdmin : boolean = false;

  diasTurnos : Array<any> = [];
  horarios : Array<any> = [];
  diaSeleccionado : any | null;
  horaSeleccionada : any | null;

  observableEspecialidades = Subscription.EMPTY;
  observableEspecialistas = Subscription.EMPTY;
  observablePacientes = Subscription.EMPTY;
  observableTurnos = Subscription.EMPTY;

  constructor(private auth: AuthService, private data: DatabaseService, private router: Router,
    private alerta: AlertasService, private firestore: AngularFirestore) { }

  ngOnInit(): void 
  {
    this.cargarEspecialidades();
    this.cargarEspecialistas();
    this.cargarTurnos();
    if(this.auth.rol == "ADMINISTRADOR")
    {
      this.esAdmin = true;
    }
  }

  ngOnDestroy(): void 
  {
    this.observableEspecialidades.unsubscribe();
    this.observableEspecialistas.unsubscribe();
    this.observableTurnos.unsubscribe();
    this.observablePacientes.unsubscribe();
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
      });
    });
  }

  cargarEspecialistas()
  {
    this.observableEspecialistas = this.data.getCollectionObservable('Especialistas').subscribe((next : any) =>
    {
      this.especialistasBD = [];
      let result : Array<any> = next;

      result.forEach(especialista =>
      {
        this.especialistasBD.push(especialista);
      });
    });
  }

  cargarPacientes()
  {
    this.observablePacientes = this.data.getCollectionObservable('Pacientes').subscribe((next : any) =>
    {
      this.pacientesBD = [];
      let result : Array<any> = next;

      result.forEach(paciente =>
      {
        this.pacientesBD.push(paciente);
      });
    });
  }

  cargarTurnos() 
  {
    this.observableTurnos = this.data.getCollectionObservable('Turnos').subscribe((next : any) =>
    {
      this.turnosBD = [];
      let result : Array<any> = next;

      result.forEach(turno =>
      {
        this.turnosBD.push(turno);
      });
    });
  }

  actualizarEspecialistas(especialidad : string)
  {
    this.especialidadSeleccionada = especialidad;
    this.especDisplay = [];
    this.diasTurnos = [];
    this.horarios = [];
    this.horaSeleccionada = null;
    this.diaSeleccionado = null;
    this.especialistaSeleccionado = null;

    if(this.esAdmin)
    {
      this.cargarPacientes();
    }

    if(this.especialidadSeleccionada != '')
    {
      this.especialistasBD.forEach(espec => {
        if(espec.Especialidades.includes(this.especialidadSeleccionada))
        {
          this.especDisplay.push(espec);
        }
      });
    }
  }

  actualizarDias(especialista : any)
  {
    this.especialistaSeleccionado = especialista;
    this.diasTurnos = [];
    this.horarios = [];
    this.horaSeleccionada = null;
    this.diaSeleccionado = null;
    let diasProximos = 15;
    for (let i = 0; i < diasProximos; i++)
    {
      const fechaActual = new Date();
      const fechaProx = new Date();
      fechaProx.setDate(fechaActual.getDate() + i);

      if(fechaProx.getDay() != 0 && !(especialista.TurnoTarde && especialista.TurnoMañana == false && fechaProx.getDay() == 6))
      {
        let dayInfo = this.parseDate(fechaProx);
        this.diasTurnos.push(dayInfo);
      }
      else
      {
        diasProximos++;
      }
    }
  }

  public parseDate(date : Date)
  {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    const fechaString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
    return {
      date: fechaString,
      day: day,
      month: month,
      year: year,
      dayText: date.toDateString().split(' ')[0],
      ocupado: false
    };
  }

  public actualizarHorarios(dia : any)
  {
    this.diaSeleccionado = dia;
    this.horarios = [];
    this.horaSeleccionada = null;
    
    for (let hora = 8; hora <= 19; hora++)
    { 
      for (let minutos = 0; minutos < 60; minutos += 30)
      { 
        let horaFormateada : string;
        let disponible : boolean;

        if(hora >= 12)
        {
          if(hora == 12)
          {
            horaFormateada = `${(hora).toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}pm`;
          }
          else
          {
            horaFormateada = `${(hora - 12).toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}pm`;
          }
        }
        else
        {
          horaFormateada = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}am`;
        }

        if(dia.dayText == 'Sat')
        {
          disponible = (this.especialistaSeleccionado.TurnoMañana && hora >= 8 && hora <= 13);
        }
        else
        {
          disponible =
            (this.especialistaSeleccionado.TurnoMañana && hora >= 8 && hora <= 13) ||
            (this.especialistaSeleccionado.TurnoTarde && ((hora > 13 && hora < 19) || (hora === 18 && minutos <= 30)));
        }
  
        if (disponible) 
        {
          let fecha = new Date(dia.year, dia.month-1, dia.day, hora, minutos);
          let horaOcupada = false;
          
          this.turnosBD.forEach(turno => 
          {
            if(turno.idEspecialista == this.especialistaSeleccionado.id)
            {
              if(turno.Fecha.seconds == (fecha.valueOf() / 1000))
              {
                horaOcupada = true;
              }
            }
          });
          const horario = 
          { hour: hora, minute: minutos, time: horaFormateada, checked: horaOcupada };
          this.horarios.push(horario);
        }
      }
    }
  }

  onHoraElegida(hora : any)
  {
    this.horaSeleccionada = hora;
  }

  onPacienteElegido(paciente : any)
  {
    this.pacienteSeleccionado = paciente;
  }

  public solicitarTurno()
  {
    let id : string;
    const fecha = new Date(this.diaSeleccionado.year, this.diaSeleccionado.month - 1, this.diaSeleccionado.day,
    this.horaSeleccionada.hour, this.horaSeleccionada.minute);

    let anio = new Date().getFullYear();
    const documento = this.firestore.doc('Turnos/' + this.firestore.createId());

    if(this.esAdmin)
    {
      id = this.pacienteSeleccionado.id;
    }
    else
    {
      id = this.auth.idUser;
    }

    documento.set({
      id: documento.ref.id,
      idPaciente: id,
      idEspecialista: this.especialistaSeleccionado.id,
      Especialidad: this.especialidadSeleccionada,
      Horario: this.horaSeleccionada.time,
      Dia: this.diaSeleccionado.date + "/" + anio,
      Estado: 'Pendiente',
      Fecha: fecha
    }).then(() => 
    {
      this.alerta.sweetAlert("Turno solicitado correctamente", "Puede revisar en Mis Turnos el estado de su solicitud", "success")
      .then(() => this.router.navigateByUrl('home'));
    }).catch(error => 
    {
      console.log(error);
      this.alerta.failureAlert("Algo salio mal, no se pudo solicitar el turno");
    });
  }
}