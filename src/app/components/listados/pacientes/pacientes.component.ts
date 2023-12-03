import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pacientes } from 'src/app/classes/pacientes';
@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {

  @Input() listaPacientes : Array<Pacientes> = [];
  @Output() PacienteSeleccionadoEvent = new EventEmitter<Pacientes>();

  seleccionarPaciente(pac : Pacientes)
  {
    this.PacienteSeleccionadoEvent.emit(pac);
  }
}
