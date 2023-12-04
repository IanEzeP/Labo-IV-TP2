import { Component, OnInit, OnDestroy} from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
/*
  Temporary quick login:
  Especialista: groproyebaucri-9657@yopmail.com ,, Ceres0k12 
  Paciente: jitroujozoudou-4558@yopmail.com ,, wick2222
  Administrador: rasabruqueido-6421@yopmail.com ,, allselec738
  */
  
  arrayUsuario : Array<Usuario> = [];

  formLog : FormGroup;

  observableControl : Subscription = Subscription.EMPTY;

  constructor(private firestore : AngularFirestore, private router: Router, private auth: AuthService, private alertas: AlertasService, 
    private data: DatabaseService, public formBuilder : FormBuilder)
  { 
    this.formLog = this.formBuilder.group({ email: ['', Validators.required], password: ['', Validators.required] });
  }

  ngOnInit(): void 
  {
    this.traerUsuarios();
  }

  ngOnDestroy(): void 
  {
    console.log("Me desubscribo");

    this.observableControl.unsubscribe();
  }

  traerUsuarios()
  {
    this.observableControl = this.data.getCollectionObservable('Administradores').subscribe((next : any) => {
      this.cargarArrayUsuario(next);
    })
  }

  cargarArrayUsuario(array : Array<any>) //Revisitar... para el login no lo veo necesario, pero puede ayudar para el inicio rápido
  {
    this.arrayUsuario = [];
    array.forEach(obj => {
      let usuario : Usuario = new Usuario(obj.id, obj.Nombre, obj.Apellido, obj.Edad, obj.DNI, obj.Mail, obj.Password, obj.ImagenPerfil);
      this.arrayUsuario.push(usuario);
    });
  }

  async validarSesion()
  {
    if(this.formLog.valid)
    {
      let formValues = this.formLog.value;
      await this.auth.logIn(formValues.email, formValues.password).then(res => {
      
        if(res!.user.emailVerified)
        {
          this.alertas.successToast("Sesion iniciada correctamente!");
          this.router.navigateByUrl('/home');
        }
        else
        {
          this.alertas.failureAlert("Debe verificar su email para iniciar sesión.");
        }  
        
        /*
        const result = this.data.traerRol(res!.user.email || '');
  
        result.then(rol => {
          if(rol != 'NF' && rol != '')
          {
            if(res!.user.emailVerified)
            {
              this.auth.rol = rol; 
              if(rol == 'especialista')
              {
                //Espera permiso de ingreso.
                this.alertas.successToast("Acceso concedido. Sesion iniciada correctamente!");
                this.router.navigateByUrl('/home');
              }
              else
              {
                this.alertas.successToast("Sesion iniciada correctamente!");
                this.router.navigateByUrl('/home');
              }
            }
            else
            {
              this.alertas.failureAlert("Debe verificar su email para iniciar sesión.");
            }
          }
          else
          {
            this.alertas.failureAlert("Traer Rol devolvió NF o nada... chequear");
          }
        })*/
      })
      .catch(error => {
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
