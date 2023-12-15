import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pacientes } from 'src/app/classes/pacientes';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { GenerateFilesService } from 'src/app/servicios/generate-files.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {

  @Input() listaPacientes : Array<Pacientes> = [];
  @Output() PacienteSeleccionadoEvent = new EventEmitter<Pacientes>();

  observableTurnos = Subscription.EMPTY;
  turnos : Array<any> = [];

  constructor(public auth: AuthService, private data: DatabaseService, private file: GenerateFilesService) {}

  ngOnInit(): void 
  {
    this.observableTurnos = this.data.getCollectionObservable("Turnos").subscribe((next : any) => 
    {
      this.turnos = [];
      let result : Array<any> = next;

      result.forEach(turno =>
      {
        if(turno.Historia != null)
        {
          this.turnos.push(turno);
        }
      });
      
      this.turnos.sort((a, b) => b.Fecha - a.Fecha);
    });
  }

  ngOnDestroy(): void
  {
    this.observableTurnos.unsubscribe();
  }

  seleccionarPaciente(pac : Pacientes)
  {
    this.PacienteSeleccionadoEvent.emit(pac);
  }

  descargarHistoria(pac : Pacientes)
  {
    let turnos = this.turnos;
    turnos = turnos.filter((turno : {Historia : any, idPaciente : any}) => turno.Historia != null && turno.idPaciente == pac.id);
    
    let historiasArray = turnos.map((turno : any) =>
    {
      let unDatosHistoriaClinica: { [clave: string]: any } = {};

      for (let clave in turno.Historia) 
      {
        unDatosHistoriaClinica[clave] = turno.Historia[clave];
      }

      const datosHistoriaClinica = Object.fromEntries(Object.entries(unDatosHistoriaClinica).sort());
      
      return {
        Paciente: pac.nombre + "-" + pac.apellido,
        Especialista: this.data.getNameById(turno.idEspecialista, "Especialistas"),
        Especialidad: turno.Especialidad,
        Dia: turno.Dia,
        ...datosHistoriaClinica,
      }
    });
    
    this.file.historiaClinicaToExcel(historiasArray);
  }
}
