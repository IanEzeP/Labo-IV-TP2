import { Component, OnInit, OnDestroy } from '@angular/core';
import { Especialistas } from 'src/app/classes/especialistas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.component.html',
  styleUrls: ['./especialista.component.css'],
  animations: [
    trigger('slideInBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(":leave", [
        animate('500ms ease-out', style({ transform: 'translateY(100%)' })),
      ])
    ])
  ],
})
export class EspecialistaComponent implements OnInit, OnDestroy {
  
  especialista : Especialistas = Especialistas.inicializar();

  observableEspecialidades = Subscription.EMPTY;
  
  condition = true;
  imgPerfil1 = '';

  storageEspecialidades : Array<any> = [];
  especialidad : string = '';

  imgFile1 : any;

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
      email: ['', [Validators.minLength(6), Validators.maxLength(42), Validators.required, this.emailValidator, this.spaceValidator]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25), Validators.required, this.spaceValidator]],
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
        this.storageEspecialidades.push(especialidad);
      }
      );
    });
  }

  onRegistrar()
  {
    if(this.formRegistro.valid)
    {
      if(this.especialidad != '' && this.imgFile1)
      {
        this.registrarEspecialista();
      }
      else
      {
        this.alertas.failureAlert("ERROR - Hay campos vacíos o incorrectos");
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

  onFileChange1($event : any)
  {
    this.imgFile1 = $event.target.files[0];
  }
  
  async subirFotoPerfil(id : string, directorio : string, file : any)
  {
    if(file)
    {
      let extension : string = file.name.slice(file.name.indexOf('.'));

      if(extension == '.jpg' || extension == '.jpeg' || extension == '.png' || extension == '.jfif')
      {
        //if(file === this.imgFile1)
        
        const path = directorio + '/' + id + '/' + this.formRegistro.controls['nombre'].value + extension;
        const uploadTask = await this.firestorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();

        const documento = this.firestore.doc(directorio + '/' + id);
        documento.update({ ImagenPerfil : url });
      
      }
      else
      {
        this.alertas.infoToast("El formato del archivo seleccionado no es compatible.");
      }
    }
  }

  reestablecerDatos()
  {
    this.imgPerfil1 = '';
    this.especialidad = '';
    this.imgFile1 = null;
    this.formRegistro.reset({ nombre: '', apellido: '', edad: 0, dni: 0, email: '', password: ''});
  }
}
