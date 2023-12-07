import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pacientes } from 'src/app/classes/pacientes';
import { Especialistas } from 'src/app/classes/especialistas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy{

  paciente : Pacientes = Pacientes.inicializar();
  especialista : Especialistas = Especialistas.inicializar();

  observableEspecialidades = Subscription.EMPTY;
  
  condition = true;
  imgPerfil1 = '';

  //Para especialista
  storageEspecialidades : Array<string> = [];
  especialidad : string = '';

  //Para paciente
  imgPerfil2 = '';

  //Image files
  imgFile1 : any;
  imgFile2 : any;

  siteKey : string = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  formRegistro : FormGroup;

  constructor(private firestore: AngularFirestore, private firestorage: AngularFireStorage, private data: DatabaseService,
    private alertas: AlertasService, private auth: AuthService, public formBuilder : FormBuilder, private router: Router)
  {
    this.formRegistro = this.formBuilder.group(
    {
      nombre: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern("[a-zA-Zá-úÁ-Ú ]*")]],
      apellido: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern("[a-zA-Zá-úÁ-Ú ]*")]],
      edad: [0, [Validators.min(9), Validators.max(99), Validators.required, this.noDecimalValidator]],
      dni: [0, [Validators.min(10000000), Validators.max(99999999), Validators.required, this.noDecimalValidator]],
      email: ['', [Validators.minLength(6), Validators.maxLength(30), Validators.required, this.emailValidator, this.spaceValidator]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25), Validators.required, this.spaceValidator]],
      obraSocial: ['', [Validators.minLength(4), Validators.maxLength(20), Validators.pattern("[a-zA-Z ]*")]],
      recaptcha: ['', Validators.required]
    });
  }

  //#region custom validators
  private noDecimalValidator(control: AbstractControl) : null | object
  {
    const valor : string = control.value != null? control.value.toString() : '';

    let retorno : object | null;

    if(valor.includes(',') || valor.includes('.'))
    {
      retorno = {noDecimalValidator : true};
    }
    else
    {
      retorno = null
    }

    return retorno;
  }

  private emailValidator(control : AbstractControl) : null | object
  { 
    const value = <string>control.value;
    const arroba = value.includes('@');
    //Si el registrar de auth rechaza formato, intentar validar formato '.com' o '.es'
    if(!arroba)
    {
      return { formatoInvalido: true };
    }
    else
    {
      return null;
    }
  }

  private spaceValidator(control : AbstractControl) : null | object
  { 
    const value = <string>control.value;
    const espacios = value.includes(' ');
    //Si el registrar de auth rechaza formato, intentar validar formato '.com' o '.es'
    if(espacios)
    {
      return { contieneEspacios: true };
    }
    else
    {
      return null;
    }
  }
  //#endregion

  ngOnInit(): void 
  {
    this.traerEspecialidades();
  }

  ngOnDestroy(): void 
  {
    this.observableEspecialidades.unsubscribe();
  }

  traerEspecialidades()
  {
    this.observableEspecialidades = this.data.getCollectionObservable('Especialidades').subscribe((next : any) =>
    {
      this.storageEspecialidades = [];
      let result : Array<any> = next;

      result.forEach(especialidad =>
      {
        this.storageEspecialidades.push(especialidad.nombreEspecialidad);
      }
      );
    });
  }

  registrar()
  {
    if(this.formRegistro.valid)
    {
      if(this.condition && this.especialidad != '' && this.imgFile1)
      {
        this.registrarEspecialista();
      }
      else
      {
        if(this.condition == false && this.imgFile1 && this.imgFile2 && this.formRegistro.controls['obraSocial'].valid)
        {
          this.registrarPaciente();
        }
        else
        {
          this.alertas.failureAlert("ERROR - Hay campos vacíos o incorrectos");
        }
      }
    }
    else
    {
      this.alertas.failureAlert("ERROR - Hay campos vacíos o incorrectos");
    }
  }

  registrarEspecialista()
  {
    let formValues = this.formRegistro.value;

    this.especialista = new Especialistas('', formValues.nombre, formValues.apellido, formValues.edad,
      formValues.dni, formValues.email, formValues.password, 'empty', [], false);
    
    this.especialista.cargarEspecialidad(this.especialidad);

    this.guardarEspecialista();
  }

  registrarPaciente()
  {
    let formValues = this.formRegistro.value;

    this.paciente = new Pacientes('', formValues.nombre, formValues.apellido, formValues.edad,
      formValues.dni, formValues.email, formValues.password, 'empty', 'empty', formValues.obraSocial);

    this.guardarPaciente();
  }

  guardarEspecialista()
  {
    let coleccion = 'Especialistas';

    this.auth.register(this.especialista.email, this.especialista.password).then(result =>
    {
      const documento = this.firestore.doc(coleccion + '/' + this.firestore.createId());
      this.subirFotoPerfil(documento.ref.id, coleccion, this.imgFile1);
      
      documento.set(
      {
        id: documento.ref.id,
        Nombre : this.especialista.nombre,
        Apellido : this.especialista.apellido,
        Edad : this.especialista.edad,
        DNI : this.especialista.dni,
        Mail : this.especialista.email,
        Password : this.especialista.password,
        ImagenPerfil : this.especialista.imagenPerfil,
        Especialidades : this.especialista.especialidades,
        autorizado: false,
      });

      this.validarDatoGuardado(documento.ref.id, coleccion);
    }).catch(error => 
    {
      console.log(error);
      let excepcion : string = error.toString();
      if(excepcion.includes("(auth/email-already-in-use)"))
      {
        this.alertas.failureAlert("ERROR - El correo electónico ya se encuentra en uso.");
      }
    });
    
  }

  guardarPaciente()
  {
    let coleccion = 'Pacientes';

    this.auth.register(this.paciente.email, this.paciente.password).then(result => 
    {
      const documento = this.firestore.doc(coleccion + '/' + this.firestore.createId());
      this.subirFotoPerfil(documento.ref.id, coleccion, this.imgFile1);
      this.subirFotoPerfil(documento.ref.id, coleccion, this.imgFile2);
      
      documento.set(
      {
        id: documento.ref.id,
        Nombre : this.paciente.nombre,
        Apellido : this.paciente.apellido,
        Edad : this.paciente.edad,
        DNI : this.paciente.dni,
        Mail : this.paciente.email,
        Password : this.paciente.password,
        ImagenPerfil : this.paciente.imagenPerfil,
        ImagenAdicional : this.paciente.imagenAdicional,
        ObraSocial : this.paciente.obraSocial,
      });

      this.validarDatoGuardado(documento.ref.id, coleccion);
    }).catch(error => 
    {
      console.log(error);
      let excepcion : string = error.toString();
      if(excepcion.includes("(auth/email-already-in-use)"))
      {
        this.alertas.failureAlert("ERROR - El correo electónico ya se encuentra en uso.");
      }
    });
    
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
          this.alertas.sweetAlert("Registro exitoso",
           "Hemos enviado un mail de verificación a tu correo electrónico. Es necesario verificarlo antes de que puedas iniciar sesión.",
           'success').then(res => this.router.navigateByUrl('login'));
          this.reestablecerDatos();
        }
      });

      if(exito == false)
      {
        this.alertas.failureAlert("ERROR - No se pudo registrar su perfil");
      }
    }).catch(error => { this.alertas.failureAlert("ERROR en Promise de firestore collection"); console.log(error);});
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

      if(extension == '.jpg' || extension == '.jpeg' || extension == '.png' || extension == '.jfif')
      {
        if(file === this.imgFile1)
        {
          const path = directorio + '/' + id + '/' + this.formRegistro.controls['nombre'].value + extension; //Este es el path de Firebase Storage.
          const uploadTask = await this.firestorage.upload(path, file);
          const url = await uploadTask.ref.getDownloadURL();  //Esta URL es un link directo a la imágen.

          const documento = this.firestore.doc(directorio + '/' + id);
          documento.update({ ImagenPerfil : url });
        }
        else
        {
          if(file === this.imgFile2)
          {
            const path = directorio + '/' + id + '/' + this.formRegistro.controls['nombre'].value + '_2' + extension; 
            const uploadTask = await this.firestorage.upload(path, file);
            const url = await uploadTask.ref.getDownloadURL(); 

            const documento = this.firestore.doc(directorio + '/' + id);
            documento.update({ ImagenAdicional : url });
          }
        }
      }
      else
      {
        this.alertas.infoToast("El formato del archivo seleccionado no es compatible.");
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
    this.imgPerfil1 = '';
    this.especialidad = '';
    this.imgPerfil2 = '';
    this.imgFile1 = null;
    this.imgFile2 = null;
    this.formRegistro.reset({ nombre: '', apellido: '', edad: 0, dni: 0, email: '', password: '', obraSocial: ''});
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