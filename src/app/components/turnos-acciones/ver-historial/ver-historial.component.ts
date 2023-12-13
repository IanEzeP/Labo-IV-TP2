import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-ver-historial',
  templateUrl: './ver-historial.component.html',
  styleUrls: ['./ver-historial.component.css']
})
export class VerHistorialComponent {
  
  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  altura! : number;
  peso! : number;
  temperatura! : number;
  presion! : number;

  campos: { clave: string; valor: string }[] = [];

  constructor (public data : DatabaseService, private firestore: AngularFirestore) {}

  agregarCampo() 
  {
    this.campos.push({ clave: '', valor: '' });
  }

  eliminarCampo(index : number)
  {
    this.campos.splice(index, 1);
  }

  onDismiss()
  {
    this.close.emit();
  }

  onSubirHistoriaClinica()
  {
    let historiaClinica : any = 
    {
      Altura: this.altura,
      Peso: this.peso,
      Temperatura: this.temperatura,
      Presion: this.presion,
    }

    for (let i = 0; i < this.campos.length; i++) 
    {
      const clave = (document.getElementById('clave' + i) as HTMLInputElement).value;
      const valor = (document.getElementById('valor' + i) as HTMLInputElement).value;

      if (clave && valor) 
      {
        historiaClinica[clave] = valor;
      }
    }

    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({ Historia: historiaClinica }).then(() => this.close.emit());
  }
}
