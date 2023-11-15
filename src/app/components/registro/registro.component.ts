import { Component } from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { Pacientes } from 'src/app/classes/pacientes';
import { Especialistas } from 'src/app/classes/especialistas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  condition = true;

  paciente = new Pacientes();
  especialista = new Especialistas();

  nombre = '';
  apellido = '';
  edad = null;
  dni = null;
  mail = '';
  password = '';
  imgPerfil1 = ''; //Tipo File?

  //Para especialista
  storageEspecialidades : Array<string> = [];
  especialidades : Array<string> = [];
  //CREAR FUNCION TRAER ESPECIALIDADES

  //Para paciente
  imgPerfil2 = '';
  obraSocial = '';

  constructor(private firestore : AngularFirestore)
  {
    this.traerEspecialidades();
  }

  

  guardarPaciente() 
  {
    const documento = this.firestore.doc('Pacientes/' + this.firestore.createId());

    documento.set(
    {
      id: documento.ref.id,
      Nombre : this.paciente.nombre,
      Apellido : this.paciente.apellido,
      Edad : this.paciente.edad,
      DNI : this.paciente.dni,
      Mail : this.paciente.mail,
      Password : this.paciente.password,
      ImagenPerfil : this.paciente.imagenPerfil,
      ImagenAdicional : this.paciente.imagenAdicional,
      ObraSocial : this.paciente.obraSocial,
    });

    this.validarDatoGuardado(documento.ref.id, 'Pacientes');
  }

  guardarEspecialista() 
  {
    const documento = this.firestore.doc('Especialistas/' + this.firestore.createId());

    documento.set(
    {
      id: documento.ref.id,
      Nombre : this.especialista.nombre,
      Apellido : this.especialista.apellido,
      Edad : this.especialista.edad,
      DNI : this.especialista.dni,
      Mail : this.especialista.mail,
      Password : this.especialista.password,
      ImagenPerfil : this.especialista.imagenPerfil,
      Especialidades : this.especialista.especialidades,
    });

    this.validarDatoGuardado(documento.ref.id, 'Especialistas');
  }

  validarDatoGuardado(id : string, coleccion : string)
  {
    const col = this.firestore.firestore.collection(coleccion);

    col.get().then((next : any) =>
    {
      let result : Array<any> = next;
      let exito = false;

      result.forEach(obj => 
      {
        if(id == obj.id)
        {
          exito = true;
          console.log("Información guardada correctamente");//llamar funcion sweetalert
          this.limpiarTextBox();
          this.reestablecerDatos(); 
        }
      });

      if(exito = false)
      {
        console.log("ERROR - No se pudo guardar la información en la base de datos");//llamar funcion sweetalert
      }
    });
  }

  traerEspecialidades()
  {
    const col = this.firestore.collection('Especialidades');
    col.valueChanges().subscribe((next : any) =>
    {
      let result : Array<any> = next;
      console.log(result);
      result.forEach(especialidad => 
        {
          this.storageEspecialidades.push(especialidad.nombreEspecialidad);
        }
      );
    })
  }

  registrar()
  {
    if(this.condition && this.especialidades.length > 0)
    {
      this.registrarEspecialista();
    }
    else
    {
      if(this.condition == false && (this.imgPerfil2 != '' && this.obraSocial != ''))
      {
        this.registrarPaciente();
      }
    }
  }

  registrarEspecialista()
  {
    this.especialista.nombre = this.nombre;
    this.especialista.apellido = this.apellido;
    this.especialista.edad = this.edad!;
    this.especialista.dni = this.dni!;
    this.especialista.mail = this.mail;
    this.especialista.password = this.password;
    this.especialista.imagenPerfil = this.imgPerfil1;
    this.especialista.especialidades = this.especialidades;

    this.guardarEspecialista();
  }

  registrarPaciente()
  {
    this.paciente.nombre = this.nombre;
    this.paciente.apellido = this.apellido;
    this.paciente.edad = this.edad!;
    this.paciente.dni = this.dni!;
    this.paciente.mail = this.mail;
    this.paciente.password = this.password;
    this.paciente.imagenPerfil = this.imgPerfil1;
    this.paciente.imagenAdicional = this.imgPerfil2;
    this.paciente.obraSocial = this.obraSocial;

    this.guardarPaciente();
  }

  limpiarTextBox()
  {
    this.nombre = '';
    this.apellido = '';
    this.edad = null;
    this.dni = null;
    this.mail = '';
    this.password = '';
    this.imgPerfil1 = '';
    this.imgPerfil2 = '';
    this.obraSocial = '';
  }

  reestablecerDatos()
  {
    this.nombre = '';
    this.apellido = '';
    this.edad = null;
    this.dni = null;
    this.mail = '';
    this.password = '';
    this.imgPerfil1 = '';
    this.especialidades = [];
    this.imgPerfil2 = '';
    this.obraSocial = '';
  }

  cambiarEstado()
  {
    this.condition = !this.condition;

    this.limpiarTextBox();
  }
}
