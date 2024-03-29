import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verificacion-acceso',
  templateUrl: './verificacion-acceso.component.html',
  styleUrls: ['./verificacion-acceso.component.css']
})
export class VerificacionAccesoComponent implements OnInit, OnDestroy {

  tieneAcceso : boolean = true;
  observableControl : Subscription = Subscription.EMPTY;

  constructor(private auth: AuthService, private data: DatabaseService, private router: Router, private alerta: AlertasService) {}

  ngOnInit(): void 
  {
    let refEmail = this.auth.email;
    let coleccion : string = '';
    
    coleccion = this.data.getCollectionByRol(this.auth.rol);
    
    this.observableControl = this.data.getCollectionObservable(coleccion).subscribe((next : any) =>
    {
      let result : Array<any> = next;
      result.forEach(document => {
        if(document.Mail == refEmail)
        {
          if(document.autorizado)
          {
            this.auth.logueado = true;
            this.auth.especAutorizado = true;
            this.tieneAcceso = true;
            this.auth.idUser = this.data.getIdByEmail(document.Mail, 'Especialistas');
            this.alerta.successToast("Sesion iniciada correctamente!");
            let log = { 
              User: this.data.getNameById(this.auth.idUser, coleccion), 
              Date: new Date()
            };
            this.data.saveLog(log);
            this.router.navigateByUrl('/home');
          }
          else
          {
            this.tieneAcceso = false;
          }
        }
      });
    });
  }

  ngOnDestroy(): void 
  {
    this.observableControl.unsubscribe();
  }
}
