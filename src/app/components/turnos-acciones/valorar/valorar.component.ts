import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.text = "";
    this.rating = 3;
  }
  
  public onDismiss()
  {
    this.close.emit();
  }

  public async onEnviarRateClick()
  {
    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({
      Valoracion: this.rating.toString(),
      Opinion: this.text
    }).then(() => this.close.emit(true));
    
  }
}
