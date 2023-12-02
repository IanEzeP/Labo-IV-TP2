import { Component, OnInit} from '@angular/core';
import { Usuario } from 'src/app/classes/usuario';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../servicios/auth.service';
import { AlertasService } from 'src/app/servicios/alerta.service';

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

  constructor(private firestore : AngularFirestore, private router: Router, private auth: AuthService, private alertas: AlertasService) { }

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

  cargarArrayUsuario(array : Array<any>)
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

  iniciarSesion()
  {
    if(this.validarSesion())
    {
      this.alertas.successToast("Sesion iniciada correctamente!");
      this.router.navigateByUrl('/home');
    }
    else
    {
      this.alertas.failureAlert("Datos de inicio de sesion incorrectos.");
    }
  }

  validarSesion() : boolean
  {
    let result : boolean = false;

    for (let i = 0; i < this.arrayUsuario.length; i++) 
    {
      if((this.email === this.arrayUsuario[i].mail) && (this.password === this.arrayUsuario[i].password))
      {
        result = true;
        this.login(this.arrayUsuario[i]);
        break;
      }
    }

    return result;
  }

  login(usuario : Usuario)
  {
    this.auth.logIn(usuario.mail, usuario.password);
  }
}
