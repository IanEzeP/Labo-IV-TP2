import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.css']
})
export class FinalizarComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;

  constructor(private firestore: AngularFirestore) {}

  public async onFinishClick()
  {
    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Estado: 'Finalizado',
      Diagnostico: this.text
    }).then(() => this.close.emit(true));
  }

  public onDismiss()
  {
    this.close.emit();
  }
}
