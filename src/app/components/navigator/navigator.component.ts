import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { TranslateService } from '../../servicios/translate.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  langArray: any[] = [
    { idioma: 'Español', lang: 'es' },
    { idioma: 'Inglés', lang: 'en' },
    { idioma: 'Portugués', lang: 'br' }
  ];

  constructor(private router: Router, public auth: AuthService, public loading: LoadingService, private translator : TranslateService) {}

  ngOnInit(): void 
  {
    this.translator.use("es");
  }

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

  setLang(lang: any) 
  {
    this.translator.use(lang.target.value);
  }
}
