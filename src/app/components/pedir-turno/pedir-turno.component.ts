import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { Especialistas } from 'src/app/classes/especialistas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pedir-turno',
  templateUrl: './pedir-turno.component.html',
  styleUrls: ['./pedir-turno.component.css']
})
export class PedirTurnoComponent implements OnInit, OnDestroy{

  especialidades : Array<string> = [];
  especialistasBD : Array<any> = [];
  //Tambien necesito a los Pacientes. Ya que los administradores pueden sacarle turno a un paciente.
  especDisplay : Array<any> = [];
  public especialidadSeleccionada : string = '';
  especialistaSeleccionado : Especialistas = Especialistas.inicializar();
  diasTurnos : Array<any> = [];
  horarios : any;
  diaSeleccionado : any | null;
  horaSeleccionada : any | null;
  
  horaOcupada : boolean = false;
  observableEspecialidades = Subscription.EMPTY;
  observableEspecialistas = Subscription.EMPTY;

  constructor(private auth: AuthService, private data: DatabaseService, private loading: LoadingService, private router: Router,
    private alerta: AlertasService, private firestore: AngularFirestore) { }

  ngOnInit(): void 
  {
    this.cargarEspecialidades();
    this.cargarEspecialistas();
  }

  ngOnDestroy(): void 
  {
    this.observableEspecialidades.unsubscribe();
    this.observableEspecialistas.unsubscribe();
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

  cargarEspecialistas()
  {
    this.observableEspecialistas = this.data.getCollectionObservable('Especialistas').subscribe((next : any) =>
    {
      this.especialistasBD = [];
      let result : Array<any> = next;

      result.forEach(especialista =>
      {
        this.especialistasBD.push(especialista);
      }
      );
    });
  }

  actualizarEspecialistas()
  {
    console.log(this.especialidadSeleccionada);
    this.especDisplay = [];
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

  public async onEspecialistaChange(especialista : any) 
  {
    console.log(this.especialistaSeleccionado);
    this.diasTurnos = [];
    let diasProximos = 15;
    for (let i = 0; i < diasProximos; i++) 
    {
      const fechaActual = new Date();
      const fechaProx = new Date();
      fechaProx.setDate(fechaActual.getDate() + i);

      console.log(fechaActual);
      console.log(fechaProx);

      console.log(!(especialista.TurnoTarde && especialista.TurnoMañana == false && fechaProx.getDay() == 6));
      if(fechaProx.getDay() != 0 && !(especialista.TurnoTarde && especialista.TurnoMañana == false && fechaProx.getDay() == 6))
      {
        let dayInfo = await this.getDayInfo(fechaProx)
        this.diasTurnos.push(dayInfo);
      }
      else
      {
        diasProximos++;
      }
    }
  }

  public async getDayInfo(date : Date) 
  {
    const day = date.getDate();
    const month = date.getMonth() + 1; //rari
    const year = date.getFullYear();
  
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthName = monthNames[date.getMonth()]; 
  
    return {
      day: day,
      dayText: date.toDateString().split(' ')[0],
      month: month,
      year: year,
      monthText: monthName,
      ocupado: false
    };
  }

  public async onDayChange(day : any) //Dia seleccionado
  {
    this.loading.load();
    this.horaSeleccionada = null;
    this.horarios = await this.generateTimeArray(this.especialidadSeleccionada, this.especialistaSeleccionado, day);
    this.loading.stop();
  }

  public async generateTimeArray(especialidad : string, especialista : any, date : any) //generar horas disponibles
  {
    for (let hour = 8; hour <= 19; hour++) //11 iteraciones
    { 
      for (let minute = 0; minute < 60; minute += 30) //2 Iteraciones
      { 
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`; //Funcion para escribir "08:00"

        let isAvailable : any;

        if(date.dayText == 'Sat')
        {
          isAvailable = (especialista.TurnoMañana && hour >= 8 && hour <= 13);
        }
        else
        {
          isAvailable =
            (especialista.HorarioMañana && hour >= 8 && hour <= 13) ||
            (especialista.HorarioTarde && ((hour > 13 && hour < 19) || (hour === 18 && minute <= 30)));
        }
  
        if (isAvailable) 
        {
          let fecha = new Date(date.year, date.month, date.day);
          console.log(fecha);
          this.horaOcupada = false;
          this.data.getCollectionObservable('Turnos').subscribe((next : any) => 
          {
            let result : Array<any> = next;
            result.forEach(turno => {
            if(turno.idEspecialista == especialista.id && turno.Especialidad == especialidad && turno.Fecha == fecha.toDateString())
            {
              this.horaOcupada = true;
            }
            });
            const timeObject = 
            {
              time: time,
              checked: this.horaOcupada,
            };
            this.horarios.push(timeObject);
          });
        }
      }
    }
  }

  public onSolicitarTurnoClick() //pedir turno.
  {
    const documento = this.firestore.doc('Turnos/' + this.firestore.createId());

    documento.set({
      id: documento.ref.id,
      idPaciente: this.auth.idUser, 
      Especialidad: this.especialidadSeleccionada,
      idEspecialista: this.especialistaSeleccionado.id, 
      Horario: this.horaSeleccionada,
      Dia: this.diaSeleccionado,
      Estado: 'Pendiente',
      Fecha: new Date(this.diaSeleccionado.year, this.diaSeleccionado.month - 1, this.diaSeleccionado.day)
    }).then(() => 
    {
      this.alerta.successAlert("Turno solicitado correctamente. Puede revisar en Mis Turnos el estado de su solicitud.");
      //this.router.navigateByUrl('home');
    }).catch(error => 
    {
      console.log(error);
      this.alerta.failureAlert("Algo salio mal, no se pudo crear el turno");
    });
  }
}
