import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../classes/usuario';
import { Pacientes } from '../../../classes/pacientes';
import { Especialistas } from '../../../classes/especialistas';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit{

  administrador = new Usuario();
  paciente = new Pacientes();
  especialista = new Especialistas();

  arrayAdmin : Array<Usuario> = [];
  arrayEspec : Array<Especialistas> = [];
  arrayPac : Array<Pacientes> = [];

  datoObtenido : boolean = false;

  constructor(private data: DatabaseService) {}

  ngOnInit(): void
  {
    this.data.getCollectionObservable('Pacientes').subscribe((next : any) =>
    {
      this.arrayPac = [];
      let result : Array<any> = next;
      result.forEach(element => {
        let paciente = new Pacientes();
        paciente.id = element.id;
        paciente.mail = element.Mail;
        paciente.nombre = element.Nombre;
        paciente.apellido = element.Apellido;
        paciente.edad = element.Edad;
        paciente.dni = element.DNI;
        paciente.obraSocial = element.ObraSocial;
        paciente.imagenPerfil = element.ImagenPerfil;
        paciente.imagenAdicional = element.ImagenAdicional;
        this.arrayPac.push(paciente);
      });
    });
    //Agregar admin y especialistas cuando tengamos forma de diferenciar roles.
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
