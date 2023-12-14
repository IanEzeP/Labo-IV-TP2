import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paciente-card',
  templateUrl: './paciente-card.component.html',
  styleUrls: ['./paciente-card.component.css']
})
export class PacienteCardComponent implements OnInit{

  @Input() pacienteSeleccionado : any;
  @Input() turnos : Array<any> = [];
  @Output() verHistorial = new EventEmitter<string>();
  turnosPaciente : Array<any> = [];

  ngOnInit(): void 
  {
    let i = 0;
    let j = 0;

    while(i < 3)
    {
      if(this.turnos[j].idPaciente == this.pacienteSeleccionado.id)
      {
        this.turnosPaciente.push(this.turnos[j]);
        i++;
      }
      j++;
      if(j == this.turnos.length)
      {
        break;
      }
    }
  }

  onVerHistorial(id : string)
  {
    this.verHistorial.emit(id);
  }
}
