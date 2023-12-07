import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-cancelar',
  templateUrl: './cancelar.component.html',
  styleUrls: ['./cancelar.component.css']
})
export class CancelarComponent {
  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;

  constructor(private data : DatabaseService, private firestore: AngularFirestore) {}

  public async onCancelClick()
  {
    let turnoFecha = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno['Año']
    }
  
    //let idTurno = await this.data.getTurnoIdByDateTime(turnoFecha, this.turno.Horario) || '';

    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Estado: 'Cancelado',
      Mensaje: this.text
    }).then(() => this.close.emit(true));

  }

  public onDismiss()
  {
    this.close.emit(false);
  }
}
