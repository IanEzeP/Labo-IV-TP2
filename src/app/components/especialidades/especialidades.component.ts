import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertasService } from 'src/app/servicios/alerta.service';

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
  especialidad : string = '';

  formEspecialidad : FormGroup;
  
  constructor(private firestore: AngularFirestore, public formBuilder: FormBuilder, private alerta: AlertasService) 
  {
    this.formEspecialidad = formBuilder.group({
      especialidad: [this.especialidad, [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern("[a-zA-Zá-úÁ-Ú ]*")]]
    });
  }

  seleccionarEspecialidad(obj : string)
  {
    this.especialidad = obj;
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
    if(this.formEspecialidad.controls['especialidad'].valid)
    {
      this.especialidad = nuevaEspecialidad;
      const documento = this.firestore.doc('Especialidades/' + this.firestore.createId());
      documento.set(
      {
        nombreEspecialidad: nuevaEspecialidad,
      });
      
      this.addEspecialidad = false;
    }
    else
    {
      this.alerta.failureAlert("La especialidad ingresada es inválida.");
    }
  }
}