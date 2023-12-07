import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { LoadingService } from 'src/app/servicios/loading.service';
@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent {
  constructor(private router: Router, public auth: AuthService, public loading: LoadingService) {}

  public onTurnosClick()
  {
    switch(this.auth.rol)
    {
      case 'ESPECIALISTA':
        this.router.navigateByUrl('turnos-especialistas');
        break;
      case 'ADMINISTRADOR':
        this.router.navigateByUrl('turnos-admins');
        break;
      default:
        this.router.navigateByUrl('turnos-pacientes');
        break;
    }
  }
}
