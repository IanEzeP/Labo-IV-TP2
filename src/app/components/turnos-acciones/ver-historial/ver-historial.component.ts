import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-ver-historial',
  templateUrl: './ver-historial.component.html',
  styleUrls: ['./ver-historial.component.css']
})
export class VerHistorialComponent implements OnInit{
  
  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  altura! : number;
  peso! : number;
  temperatura! : number;
  presion! : number;

  //Para nuevos datos dinámicos
  claveRango! : string;
  claveNum! : string;
  claveSwitch! : string;

  datoRango! : number;
  datoNum! : number;
  datoSwitch : boolean = false;

  nombrePaciente : string = "";

  campos: { clave: string; valor: string }[] = [];

  constructor (private data : DatabaseService, private firestore: AngularFirestore) {}

  ngOnInit(): void 
  {
    this.datoRango = 50;
    this.nombrePaciente = this.turno.idPaciente;
  }
  
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

    historiaClinica[this.claveRango] = this.datoRango;
    historiaClinica[this.claveNum] = this.datoNum;
    historiaClinica[this.claveSwitch] = this.datoSwitch;

    const documento = this.firestore.doc('Turnos/' + this.turno.id);
    documento.update({ Historia: historiaClinica }).then(() => this.close.emit());
  }
}
