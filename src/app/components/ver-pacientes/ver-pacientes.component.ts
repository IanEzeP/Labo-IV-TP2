import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ver-pacientes',
  templateUrl: './ver-pacientes.component.html',
  styleUrls: ['./ver-pacientes.component.css']
})
export class VerPacientesComponent implements OnInit, OnDestroy{

  idPac : Array<string> = [];
  pacientes : Array<any> = [];
  turnos : Array<any> = [];
  contador : number = 0;

  observableTurnos = Subscription.EMPTY;
  pacienteSeleccionado : any;

  constructor(private data : DatabaseService, private auth : AuthService) {}

  ngOnInit() 
  {
    this.observableTurnos = this.data.getCollectionObservable("Turnos").subscribe((next : any) => 
    {
      this.turnos = [];
      let result : Array<any> = next;

      result.forEach(turno =>
      {
        this.turnos.push(turno);
        if(this.auth.idUser == turno.idEspecialista && turno.Estado == 'Finalizado')
        {
          if(this.idPac.find((id) => {return id == turno.idPaciente; }) === undefined)
          {
            this.idPac.push(turno.idPaciente);
          }
        }
      });
      
      this.idPac.forEach(id => {
        this.data.traerUnDocumento('Pacientes', id).then(doc => 
        {
          this.pacientes.push(doc.data());
        });
      });
      this.turnos.sort((a, b) => b.Fecha - a.Fecha);
    });
    
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
  }

  mostrarHistorial(id : any)
  {
    let idHistorial = id;
    
    //Mostrar Historial del paciente
    /*
    this.modalRef = this.modalService.open(UserHistoriaClinicaComponent, {
      data: { paciente: pacienteInfo },
      modalClass: 'modal-xl'
    });*/
  }
}
