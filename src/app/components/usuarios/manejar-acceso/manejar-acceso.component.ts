import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Especialistas } from 'src/app/classes/especialistas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manejar-acceso',
  templateUrl: './manejar-acceso.component.html',
  styleUrls: ['./manejar-acceso.component.css']
})
export class ManejarAccesoComponent implements OnInit, OnDestroy{

  especialistas : Array<Especialistas> = [];
  observableControl : Subscription = Subscription.EMPTY;

  constructor(private data: DatabaseService) { }

  ngOnInit(): void 
  {
    console.log("Me subscribo");

    this.observableControl = this.data.getCollectionObservable("Especialistas").subscribe((next : any) => 
    {
      this.especialistas = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let espec = new Especialistas();
        espec.id = element.id;
        espec.mail = element.Mail;
        espec.nombre = element.Nombre;
        espec.apellido = element.Apellido;
        espec.edad = element.Edad;
        espec.dni = element.DNI;
        espec.imagenPerfil = element.ImagenPerfil;
        espec.especialidades = element.Especialidades;
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
    espec.autorizado = !espec.autorizado;
    //Tengo que hacer este cambio en la BD
  }
}
