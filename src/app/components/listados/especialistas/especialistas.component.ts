import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Especialistas } from 'src/app/classes/especialistas';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})
export class EspecialistasComponent {

  @Input() listaEspecialistas : Array<Especialistas> = [];
  @Output() EspecialistaSeleccionadoEvent = new EventEmitter<Especialistas>();

  seleccionarEspecialista(espec : Especialistas)
  {
    this.EspecialistaSeleccionadoEvent.emit(espec);
  }
}
