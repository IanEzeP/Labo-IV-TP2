import { Component, OnInit, OnDestroy} from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendEmailVerification } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  arrayTodosUsuarios : Array<Usuario> = [];
  observableControl : Subscription = Subscription.EMPTY;
  

  formLog : FormGroup;

  constructor(private router: Router, private auth: AuthService, private alertas: AlertasService, 
    private data: DatabaseService, public formBuilder : FormBuilder)
  { 
    this.formLog = this.formBuilder.group({ email: ['', Validators.required], password: ['', Validators.required] });
  }

  ngOnInit(): void 
  {
    //this.traerUsuarios();
    this.cargarArrayUsuario();
  }

  ngOnDestroy(): void 
  {
    this.observableControl.unsubscribe();
  }

  cargarArrayUsuario() //Revisitar... para el login no lo veo necesario, pero puede ayudar para el inicio rápido
  {
    let arrayUsuarios = this.arrayTodosUsuarios.concat(this.data.adminsDB, this.data.pacDB, this.data.especDB);
    arrayUsuarios.forEach(usuario => {
      if(usuario.id == "yjgmXjNiKczD6FQm9EAS" || usuario.id == "ZyBUdgjqPvQxiKeOZ1Ku" || 
        usuario.id == "mwh0vqwlYJGGWqxio7un" || usuario.id == "7Lbf58mlBOKfqsooNnRG" || usuario.id == "OKMsZX5dTkqWFQ6lG7KT")
        {
          this.arrayTodosUsuarios.push(usuario);
        }
    });
    console.log(this.arrayTodosUsuarios);
  }

  inicioRapido(usuario : Usuario)
  {
    this.formLog.controls['email'].setValue(usuario.email);
    this.formLog.controls['password'].setValue(usuario.password);
  }
/*
  traerUsuarios()
  {
    this.observableControl = this.data.getCollectionObservable('Administradores').subscribe((next : any) => {
      this.cargarArrayUsuario(next);
    });
  }

  cargarArrayUsuario(array : Array<any>) //Revisitar... para el login no lo veo necesario, pero puede ayudar para el inicio rápido
  {
    this.arrayUsuario = [];
    array.forEach(obj => {
      let usuario : Usuario = new Usuario(obj.id, obj.Nombre, obj.Apellido, obj.Edad, obj.DNI, obj.Mail, obj.Password, obj.ImagenPerfil);
      this.arrayUsuario.push(usuario);
    });
  }*/

  async validarSesion()
  {
    if(this.formLog.valid)
    {
      let formValues = this.formLog.value;
      await this.auth.logIn(formValues.email, formValues.password).then(res =>
      {
        if(res!.user.emailVerified == true)
        {
          let rol = this.data.traerRol(res!.user.email || '');
          if(rol != 'NF' && rol != '')
          {
            this.auth.rol = rol;
            this.auth.userName = res!.user.displayName || '';

            if(rol == 'ESPECIALISTA')
            {
              //Lo mandamos a esperar.
              console.log("redirigiendo a componente de espera");
            }
            this.alertas.successToast("Sesion iniciada correctamente!");
            this.router.navigateByUrl('/home');
          }
          else
          {
            this.auth.logOut();
            this.alertas.failureAlert("No se encontró el Rol del usuario, INVESTIGAR.");
          }
        }
        else
        {
          this.alertas.failureAlert("Debe verificar su email para iniciar sesión.");
          sendEmailVerification(res!.user);
          this.auth.logOut();
        }  
      })
      .catch(() => {
        this.auth.logOut();
        this.alertas.failureAlert("Datos de inicio de sesion incorrectos.");
      });
    }
    else
    {
      this.alertas.failureAlert("Debe llenar los campos para iniciar sesión");
    }
  }
/*
  login(usuario : Usuario) //Por el momento es innecesaria
  {
    return this.auth.logIn(usuario.email, usuario.password);
  }
*/
}
