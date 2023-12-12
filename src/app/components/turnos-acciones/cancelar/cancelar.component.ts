import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(private firestore: AngularFirestore) {}

  public async onCancelClick()
  {
    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Estado: 'Cancelado',
      Motivo: this.text
    }).then(() => this.close.emit(true));
  }

  public onDismiss()
  {
    this.close.emit(false);
  }
}
