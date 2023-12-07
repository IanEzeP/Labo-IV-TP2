import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-valorar',
  templateUrl: './valorar.component.html',
  styleUrls: ['./valorar.component.css']
})
export class ValorarComponent implements OnInit {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;
  public rating! : number;

  constructor(private data : DatabaseService) {}

  ngOnInit(): void {
    this.text = "";
    this.rating = 0;
  }
  
  public onDismiss()
  {
    this.close.emit();
  }

  public async onEnviarRateClick()
  { 
    let date = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno.Año
    }
    let turnoId = await this.data.getTurnoIdByDateTime(date, this.turno.Horario);
    await this.data.updateRatingTurnoByTurnoId(turnoId, this.rating.toString(), this.text);
    this.close.emit();
  }
}
