import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  public solucionRespuesta : any;
  public medicacionRespuesta : any;
  public estudiosRespuesta : any;

  constructor(private firestore: AngularFirestore) {}
  
  public onDismiss()
  {
    this.close.emit();
  }

  public async onEnviarEncuestaClick()
  {
    let encuesta =
    {
      Solucion: this.solucionRespuesta,
      Medicacion: this.medicacionRespuesta,
      Estudios: this.estudiosRespuesta,
    }

    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Encuesta: encuesta,
    }).then(() => this.close.emit(true));
  }
}
