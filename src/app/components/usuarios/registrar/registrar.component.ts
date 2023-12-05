import { Component } from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {

  imgPerfil = '';
  imgFile : any;
  
  administrador : Usuario = Usuario.inicializar();

  public formRegistro : FormGroup;

  constructor(private firestore: AngularFirestore, private firestorage: AngularFireStorage,
    private alertas: AlertasService, private auth: AuthService, public formBuilder : FormBuilder)
  {
    this.formRegistro = this.formBuilder.group(
    {
      nombre: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern("[a-zA-Zá-úÁ-Ú ]*")]],
      apellido: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern("[a-zA-Zá-úÁ-Ú ]*")]],
      edad: [0, [Validators.min(9), Validators.max(99), Validators.required, this.noDecimalValidator]],
      dni: [0, [Validators.min(10000000), Validators.max(99999999), Validators.required, this.noDecimalValidator]],
      email: ['', [Validators.minLength(6), Validators.maxLength(30), Validators.required, this.emailValidator, this.spaceValidator]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25), Validators.required, this.spaceValidator]],
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

  registrar()
  {
    if(this.formRegistro.valid && this.imgFile)
    {
      let formValues = this.formRegistro.value;

      this.administrador = new Usuario('', formValues.nombre, formValues.apellido, formValues.edad,
        formValues.dni, formValues.email, formValues.password, 'empty');

      this.guardarUsuario();
    }
    else
    {
      this.alertas.failureAlert("ERROR - Hay campos vacíos o incorrectos");
    }
  }

  guardarUsuario()
  {
    let coleccion = 'Administradores';

    this.auth.register(this.administrador.email, this.administrador.password).then(result =>
    {
      const documento = this.firestore.doc(coleccion + '/' + this.firestore.createId());
      this.subirFotoPerfil(documento.ref.id, coleccion, this.imgFile);
      
      documento.set(
      {
        id: documento.ref.id,
        Nombre : this.administrador.nombre,
        Apellido : this.administrador.apellido,
        Edad : this.administrador.edad,
        DNI : this.administrador.dni,
        Mail : this.administrador.email,
        Password : this.administrador.password,
        ImagenPerfil : this.administrador.imagenPerfil,
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
          this.alertas.sweetAlert("Usuario registrado con exito",
           "Hemos enviado un mail de verificación al correo electrónico ingresado. Es necesario verificarlo antes de que pueda iniciar sesión.",
           'success');
          this.reestablecerDatos();
        }
      });

      if(exito == false)
      {
        this.alertas.failureAlert("ERROR - No se pudo registrar el nuevo usuario");
      }
    }).catch(error => { this.alertas.failureAlert("ERROR en Promise de firestore collection"); console.log(error);});
  }

  onFileChange($event : any)
  {
    this.imgFile = $event.target.files[0];
  }

  async subirFotoPerfil(id : string, directorio : string, file : any)
  {
    if(file)
    {
      let extension : string = file.name.slice(file.name.indexOf('.'));

      if(extension == '.jpg' || extension == '.jpeg' || extension == '.png' || extension == '.jfif')
      {
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
    this.imgPerfil = '';
    this.imgFile = null;
    this.formRegistro.reset({ nombre: '', apellido: '', edad: 0, dni: 0, email: '', password: ''});
  }
}
