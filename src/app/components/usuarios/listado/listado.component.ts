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

  switchListado = 1;
  datoObtenido : boolean = false;
  observableAdmin : Subscription = Subscription.EMPTY;
  observableEspec : Subscription = Subscription.EMPTY;
  observablePac : Subscription = Subscription.EMPTY;

  constructor(private data: DatabaseService) { }

  ngOnInit(): void
  {
    this.observablePac = this.data.getCollectionObservable('Pacientes').subscribe((next : any) =>
    {
      this.arrayPac = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let paciente = new Pacientes(element.id,  element.Nombre, element.Apellido, element.Edad, element.DNI, element.Mail, element.Password,
          element.ImagenPerfil, element.ImagenAdicional, element.ObraSocial);
        this.arrayPac.push(paciente);
      });
    });
    this.observableAdmin = this.data.getCollectionObservable('Administradores').subscribe((next : any) =>
    {
      this.arrayAdmin = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let usuario = new Usuario(element.id,  element.Nombre, element.Apellido, element.Edad, element.DNI, element.Mail, element.Password,
          element.ImagenPerfil);
        this.arrayAdmin.push(usuario);
      });
    });
    this.observableEspec = this.data.getCollectionObservable('Especialistas').subscribe((next : any) =>
    {
      this.arrayEspec = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let especialista = new Especialistas(element.id,  element.Nombre, element.Apellido, element.Edad, element.DNI, element.Mail, element.Password,
          element.ImagenPerfil, element.Especialidades, element.autorizado);
        this.arrayEspec.push(especialista);
      });
    });
  }

  ngOnDestroy(): void 
  {
    console.log("Me desubscribo");
    this.observablePac.unsubscribe();
    this.observableAdmin.unsubscribe();
    this.observableEspec.unsubscribe();
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
  cambiarListado(accion : number)
  {
    this.switchListado = accion;
    this.datoObtenido = false;
  }
}
