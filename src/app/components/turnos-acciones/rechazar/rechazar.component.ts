import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-rechazar',
  templateUrl: './rechazar.component.html',
  styleUrls: ['./rechazar.component.css']
})
export class RechazarComponent {

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
    
    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Estado: 'Rechazado',
      Mensaje: this.text
    }).then(() => this.close.emit(true));
    
  }

  public onDismiss()
  {
    this.close.emit();
  }
}
