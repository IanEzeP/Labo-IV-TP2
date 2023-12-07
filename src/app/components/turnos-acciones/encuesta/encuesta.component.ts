import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  public solucionRespuesta : any;
  public recomendacionRespuesta : any;
  public limpiezaRespuesta : any;

  constructor(private data : DatabaseService) {}
  
  public onDismiss()
  {
    this.close.emit();
  }

  public async onEnviarEncuestaClick()
  {
    let encuesta =
    {
      SOLUCION: this.solucionRespuesta,
      RECOMENDACION: this.recomendacionRespuesta,
      LIMPIEZA: this.limpiezaRespuesta,
    }

    let date = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno.Año
    }

    let turnoId = await this.data.getTurnoIdByDateTime(date, this.turno.Horario);
    await this.data.updateEncuestaByTurnoId(turnoId, encuesta);
    this.close.emit();
  }
}
