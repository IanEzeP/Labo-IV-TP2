import { Component, OnInit} from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  /*
  Temporary quick login:
  Especialista: groproyebaucri-9657@yopmail.com ,, Ceres0k12 
  Paciente: jitroujozoudou-4558@yopmail.com ,, wick2222
  Administrador: rasabruqueido-6421@yopmail.com ,, allselec738
  */
  arrayUsuario : Array<Usuario> = [];

  constructor(private firestore : AngularFirestore, private router: Router, private auth: AuthService, private alertas: AlertasService, private data: DatabaseService) { }

  ngOnInit(): void 
  {
    this.traerUsuarios();
  }

  traerUsuarios()
  {
    const col = this.firestore.collection('Administradores');
    col.valueChanges().subscribe((next : any) => {
      this.cargarArrayUsuario(next);
    })
  }

  cargarArrayUsuario(array : Array<any>) //Revisitar... para el login no lo veo necesario, pero puede ayudar para el inicio rápido
  {
    this.arrayUsuario = [];
    array.forEach(obj => {
      let usuario : Usuario = new Usuario();
      usuario.id = obj.id;
      usuario.nombre = obj.Nombre;
      usuario.password = obj.Password;
      usuario.mail = obj.Mail;
      usuario.apellido = obj.Apellido;
      usuario.dni = obj.DNI;
      usuario.edad = obj.Edad;
      usuario.imagenPerfil = obj.ImagenPerfil;
      this.arrayUsuario.push(usuario);
    });
  }

  async validarSesion()
  {
    let usuario : Usuario = new Usuario();
    usuario.mail = this.email;
    usuario.password = this.password;

    await this.login(usuario).then(res => {
      
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

  login(usuario : Usuario) //Por el momento es innecesaria
  {
    return this.auth.logIn(usuario.mail, usuario.password);
  }
}
