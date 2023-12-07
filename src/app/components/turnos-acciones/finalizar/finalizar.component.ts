import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AlertasService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.css']
})
export class FinalizarComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;

  constructor(private data : DatabaseService) {}

  public async onFinishClick()
  {    
    let turnoFecha = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno['Año']
    }
    let idTurno = await this.data.getTurnoIdByDateTime(turnoFecha, this.turno.Horario) || '';
    this.data.updateEstadoTurno(idTurno, this.text, 'finalizado');
    this.close.emit();
  }

  public onDismiss()
  {
    this.close.emit();
  }
}
