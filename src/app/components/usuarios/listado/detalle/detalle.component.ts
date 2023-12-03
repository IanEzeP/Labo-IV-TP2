import { Component, Input } from '@angular/core';
import { Pacientes } from 'src/app/classes/pacientes';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent 
{
  @Input() paciente : Pacientes = new Pacientes();
  @Input() condition : boolean = false;

}
