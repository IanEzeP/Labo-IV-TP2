import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {

@Input() listaEspecialidades : Array<any> = [];
@Output() especialidadSeleccionadaEvent = new EventEmitter<string>();

especialidadesCargadas : Array<string> = [];
addEspecialidad : boolean = false;

seleccionarEspecialidad(obj : string)
{
  this.especialidadSeleccionadaEvent.emit(obj);
  console.log("Especialidad seleccionada");
}
/*
seleccionarEspecialidades(obj : string)
{
  this.especialidadesCargadas.push(obj);
  this.especialidadesSeleccionadasEvent.emit(this.especialidadesCargadas);
}
*/
agregarEspecialidad()
{
  this.addEspecialidad = true;
}

registrarEspecialidad(nuevaEspecialidad : string)
{
  this.listaEspecialidades.push(nuevaEspecialidad);
}
}