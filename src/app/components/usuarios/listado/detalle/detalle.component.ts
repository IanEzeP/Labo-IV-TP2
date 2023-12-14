import { Component, Input } from '@angular/core';
import { Especialistas } from 'src/app/classes/especialistas';
import { Pacientes } from 'src/app/classes/pacientes';
import { Usuario } from 'src/app/classes/usuario';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {

  @Input() paciente : Pacientes = Pacientes.inicializar();
  @Input() admin : Usuario = Usuario.inicializar();
  @Input() especialista : Especialistas = Especialistas.inicializar();
  @Input() condition : boolean = false;

  @Input() detalle = 1; //switch_expression

  datosPaciente = 1; //match_expression
  datosAdmin = 2;
  datosEspecialista = 3;
  
  constructor(private auth: AuthService, private router: Router) {}

  consultarHistoriaClinica()
  {
    this.auth.idHistoria = this.paciente.id;
    this.router.navigateByUrl("historial-clinico");
  }
}
