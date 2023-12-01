import { Component, OnInit } from '@angular/core';
import { Pacientes } from 'src/app/classes/pacientes';
import { Especialistas } from 'src/app/classes/especialistas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
//import { collection } from '@angular/fire/firestore';
import { Usuario } from 'src/app/classes/usuario';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit{

  condition = true;

  paciente = new Pacientes();
  especialista = new Especialistas();

  nombre = '';
  apellido = '';
  edad = 0;
  dni = 0;
  mail = '';
  password = '';
  imgPerfil1 = '';

  //Para especialista
  storageEspecialidades : Array<string> = [];
  especialidad : string = '';

  //Para paciente
  imgPerfil2 = '';
  obraSocial = '';

  //Image files
  imgFile1 : any;
  imgFile2 : any;

  constructor(private firestore : AngularFirestore, private firestorage : AngularFireStorage) {}

  ngOnInit(): void 
  {
    this.traerEspecialidades();
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
    if(this.condition && this.especialidad != '')
    {
      this.registrarEspecialista();
    }
    else
    {
      if(this.condition == false && this.imgFile2 && this.obraSocial != '')
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
    this.especialista.especialidades.push(this.especialidad);

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
    this.paciente.obraSocial = this.obraSocial;

    this.guardarPaciente();
  }

  guardarEspecialista()
  {
    const documento = this.firestore.doc('Especialistas/' + this.firestore.createId());

    this.subirFotoPerfil(documento.ref.id, 'Especialistas', this.imgFile1);
    
    documento.set(
    {
      id: documento.ref.id,
      Nombre : this.especialista.nombre,
      Apellido : this.especialista.apellido,
      Edad : this.especialista.edad,
      DNI : this.especialista.dni,
      Mail : this.especialista.mail,
      Password : this.especialista.password,
      ImagenPerfil : 'empty',
      Especialidades : this.especialista.especialidades,
    });

    this.validarDatoGuardado(documento.ref.id, 'Especialistas');
  }

  guardarPaciente()
  {
    const documento = this.firestore.doc('Pacientes/' + this.firestore.createId());

    this.subirFotoPerfil(documento.ref.id, 'Pacientes', this.imgFile1);
    this.subirFotoPerfil(documento.ref.id, 'Pacientes', this.imgFile2);
    
    documento.set(
    {
      id: documento.ref.id,
      Nombre : this.paciente.nombre,
      Apellido : this.paciente.apellido,
      Edad : this.paciente.edad,
      DNI : this.paciente.dni,
      Mail : this.paciente.mail,
      Password : this.paciente.password,
      ImagenPerfil : 'empty',
      ImagenAdicional : 'empty',
      ObraSocial : this.paciente.obraSocial,
    });

    this.validarDatoGuardado(documento.ref.id, 'Pacientes');
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
          this.reestablecerDatos();
        }
      });

      if(exito == false)
      {
        console.log("ERROR - No se pudo guardar la información en la base de datos");//llamar funcion sweetalert
      }
    });
  }

  atraparEspecialidades(especialidad : string)
  {
    this.especialidad = especialidad;
  }

  onFileChange1($event : any) //Para foto (paciente y especialista)
  {
    this.imgFile1 = $event.target.files[0];
  }

  onFileChange2($event : any) //Para foto adicional (paciente)
  {
    this.imgFile2 = $event.target.files[0];
  }
  
  async subirFotoPerfil(id : string, directorio : string, file : any)
  {
    if(file)
    {
      let extension : string = file.name.slice(file.name.indexOf('.'));

      if(file === this.imgFile1)
      {
        const path = directorio + '/' + id + '/' + this.nombre + extension; //Este es el path de Firebase Storage.
        const uploadTask = await this.firestorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();                  //Esta URL es un link directo a la imágen.

        const documento = this.firestore.doc(directorio + '/' + id);
        documento.update({
          ImagenPerfil : url
        });
      }
      else
      {
        if(file === this.imgFile2)
        {
          const path = directorio + '/' + id + '/' + this.nombre + '_2' + extension; 
          const uploadTask = await this.firestorage.upload(path, file);
          const url = await uploadTask.ref.getDownloadURL(); 

          const documento = this.firestore.doc(directorio + '/' + id);
          documento.update({
            ImagenAdicional : url
          });
        }
      }
    }
  }

  cambiarEstado()
  {
    this.condition = !this.condition;
    this.reestablecerDatos();
  }

  reestablecerDatos()
  {
    this.nombre = '';
    this.apellido = '';
    this.edad = 0;
    this.dni = 0;
    this.mail = '';
    this.password = '';
    this.imgPerfil1 = '';
    this.especialidad = '';
    this.imgPerfil2 = '';
    this.obraSocial = '';
    this.imgFile1 = null;
    this.imgFile2 = null;
  }

  //#region getImages()
  //SOLO PRUEBA, tengo que moverlo a otro componente. Y probar que funcione
  getImages()
  {
    const imagesref = this.firestorage.ref('pacientes'); //Referencia a la carpeta de FireStorage
    const ii = imagesref.listAll().subscribe((next : any) => 
    {
      let result : Array<any> = next;
      console.log(result);
      //limpiar el array de imagenes[].
      next.items.forEach((item : string) => {
        const ee = this.firestorage.storage.refFromURL(item);
        const url = ee.getDownloadURL();
        console.log(url);
        //Guardar cada url en un array de imagenes[].
      });
    });
  }
  //#endregion
}