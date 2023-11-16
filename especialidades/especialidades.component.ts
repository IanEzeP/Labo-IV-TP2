import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {

@Input() listaEspecialidades : Array<any> = [];
@Output() especialidadesSeleccionadasEvent = new EventEmitter<Array<string>>();
especialidadesCargadas : Array<string> = [];

/*
@Output() especialidadSeleccionadaEvent = new EventEmitter<string>();
seleccionarEspecialidad(obj : string)
{
  this.especialidadSeleccionadaEvent.emit(obj);
  console.log("Especialidad seleccionada");
}*/

seleccionarEspecialidades(obj : string)
{
  this.especialidadesCargadas.push(obj);
  this.especialidadesSeleccionadasEvent.emit(this.especialidadesCargadas);
}
//Como seguir? Esta bien hacer dos output?? O debería hacer un Output y desde el padre ver que hago con la info?

agregarEspecialidad()
{

}

}
