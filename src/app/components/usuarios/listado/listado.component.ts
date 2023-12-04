import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../classes/usuario';
import { Pacientes } from '../../../classes/pacientes';
import { Especialistas } from '../../../classes/especialistas';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit, OnDestroy{

  administrador = Usuario.inicializar();
  paciente = Pacientes.inicializar();
  especialista = Especialistas.inicializar();

  arrayAdmin : Array<Usuario> = [];
  arrayEspec : Array<Especialistas> = [];
  arrayPac : Array<Pacientes> = [];

  datoObtenido : boolean = false;
  observableControl : Subscription = Subscription.EMPTY;

  constructor(private data: DatabaseService) {}

  ngOnInit(): void
  {
    this.observableControl = this.data.getCollectionObservable('Pacientes').subscribe((next : any) =>
    {
      this.arrayPac = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let paciente = new Pacientes(element.id,  element.Nombre, element.Apellido, element.Edad, element.DNI, element.Mail, element.Password,
          element.ImagenPerfil, element.ImagenAdicional, element.ObraSocial);
        this.arrayPac.push(paciente);
      });
    });
    //Agregar admin y especialistas cuando tengamos forma de diferenciar roles.
  }

  ngOnDestroy(): void 
  {
    console.log("Me desubscribo");
    this.observableControl.unsubscribe();
  }

  detallarAdmin(admin : Usuario)
  {
    this.administrador = admin;
    this.datoObtenido = true;
  }
  detallarPaciente(paciente : Pacientes)
  {
    this.paciente = paciente;
    this.datoObtenido = true;
  }
  detallarEspecialista(especialista : Especialistas)
  {
    this.especialista = especialista;
    this.datoObtenido = true;
  }
}
