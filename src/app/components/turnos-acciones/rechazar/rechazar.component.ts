import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  constructor(private firestore: AngularFirestore) {}

  public async onCancelClick()
  {
    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Estado: 'Rechazado',
      Motivo: this.text
    }).then(() => this.close.emit(true));
  }

  public onDismiss()
  {
    this.close.emit();
  }
}
