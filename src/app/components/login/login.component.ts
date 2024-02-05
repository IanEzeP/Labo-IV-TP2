import { Component, OnInit, OnDestroy} from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendEmailVerification } from '@angular/fire/auth';
import { slideInAnimation } from 'src/app/animation/animation.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [slideInAnimation]
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
    this.cargarArrayUsuario();
  }

  ngOnDestroy(): void 
  {
    this.observableControl.unsubscribe();
  }

  cargarArrayUsuario()
  {
    let arrayUsuarios = this.arrayTodosUsuarios.concat(this.data.adminsDB, this.data.pacDB, this.data.especDB);
    arrayUsuarios.forEach(usuario => {
      if(usuario.id == "yjgmXjNiKczD6FQm9EAS" || usuario.id == "ZyBUdgjqPvQxiKeOZ1Ku" || 
        usuario.id == "mwh0vqwlYJGGWqxio7un" || usuario.id == "7Lbf58mlBOKfqsooNnRG" || usuario.id == "OKMsZX5dTkqWFQ6lG7KT")
        {
          this.arrayTodosUsuarios.push(usuario);
        }
    });
  }

  inicioRapido(usuario : Usuario)
  {
    this.formLog.controls['email'].setValue(usuario.email);
    this.formLog.controls['password'].setValue(usuario.password);
  }

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
          let coleccion : string = '';

          if(rol != 'NF' && rol != '')
          {
            this.auth.rol = rol;
            this.auth.email = res!.user.email || '';

            if(rol == 'ESPECIALISTA')
            {
              this.auth.logueado = false;
              this.router.navigateByUrl("/verificando-acceso");
            }
            else
            {
              switch(rol)
              {
                case 'PACIENTE':
                  this.auth.idUser = this.data.getIdByEmail(formValues.email, 'Pacientes');
                  coleccion = 'Pacientes';
                  break;
                case 'ADMINISTRADOR':
                  this.auth.idUser = this.data.getIdByEmail(formValues.email, 'Administradores');
                  coleccion = 'Administradores';
                  break;
              }
              this.alertas.successToast("Sesion iniciada correctamente!");
              let log = { 
                User: this.data.getNameById(this.auth.idUser, coleccion), 
                Date: new Date()
              };
              this.data.saveLog(log);
              this.router.navigateByUrl('/home');
            }
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
}
