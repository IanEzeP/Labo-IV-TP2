import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Especialistas } from 'src/app/classes/especialistas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manejar-acceso',
  templateUrl: './manejar-acceso.component.html',
  styleUrls: ['./manejar-acceso.component.css']
})
export class ManejarAccesoComponent implements OnInit, OnDestroy{

  especialistas : Array<Especialistas> = [];
  observableControl : Subscription = Subscription.EMPTY;

  constructor(private data: DatabaseService, private firestore: AngularFirestore) { }

  ngOnInit(): void 
  {
    console.log("Me subscribo");

    this.observableControl = this.data.getCollectionObservable("Especialistas").subscribe((next : any) => 
    {
      this.especialistas = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let espec = new Especialistas(element.id, element.Nombre, element.Apellido, element.Edad, element.DNI, 
          element.Mail, element.Password, element.ImagenPerfil, element.Especialidades, element.autorizado);
        this.especialistas.push(espec);
      });
    });
  }

  ngOnDestroy(): void 
  {
    console.log("Me desubscribo");

    this.observableControl.unsubscribe();
  }

  cambiarAutorizacion(espec : Especialistas)
  {
    const col = this.firestore.doc('Especialistas/' + espec.id);
    col.update({
      autorizado : !espec.autorizado
    });
  }
}
