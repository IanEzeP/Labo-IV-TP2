import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-ver-historial',
  templateUrl: './ver-historial.component.html',
  styleUrls: ['./ver-historial.component.css']
})
export class VerHistorialComponent {
  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  public altura! : number;
  public peso! : number;
  public temperatura! : number;
  public presion! : number

  campos: { clave: string; valor: string }[] = [];

  constructor (private data : DatabaseService) {}

  public agregarCampo() {
    this.campos.push({ clave: '', valor: '' });
  }

  public onDismiss()
  {
    this.close.emit();
  }

  public async onSubirHistoriaClinica()
  {
    let historiaClinica : any = {
      Altura: this.altura,
      Peso: this.peso,
      Temperatura: this.temperatura,
      Presion: this.presion,
    }

    for (let i = 0; i < this.campos.length; i++) {
      const clave = (document.getElementById(`clave${i}`) as HTMLInputElement).value;
      const valor = (document.getElementById(`valor${i}`) as HTMLInputElement).value;

      if (clave && valor) {
        historiaClinica[clave] = valor;
      }
    }

    let date = {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno.Año,
    }

    let turnoId = await this.data.getTurnoIdByDateTime(date, this.turno.Horario);
    await this.data.saveHistoriaClinicaByTurnoId(turnoId, historiaClinica);
    
    this.close.emit();
  }

  public eliminarCampo(index : number)
  {
    this.campos.splice(index, 1);
  }
}
