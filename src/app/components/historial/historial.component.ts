import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit, OnDestroy{

  turnos : Array<any> = [];
  paciente : any;
  observableTurnos = Subscription.EMPTY;

  constructor(public data : DatabaseService, private auth : AuthService, private loading : LoadingService) {}

  ngOnInit() 
  {
    this.observableTurnos = this.data.getCollectionObservable("Turnos").subscribe((next : any) => 
    {
      this.loading.load();
      this.turnos = [];
      let result : Array<any> = next;
      if(this.auth.rol == 'PACIENTE')
      {
        this.data.traerUnDocumento('Pacientes', this.auth.idUser).then(doc => this.paciente = doc.data());
        result.forEach(turno =>
        {
          if(this.auth.idUser == turno.idPaciente && turno.Historia != null)
          {
            this.turnos.push(turno);
          }
        });
      }
      else
      {
        this.data.traerUnDocumento('Pacientes', this.auth.idHistoria).then(doc => this.paciente = doc.data());
        result.forEach(turno =>
        {
          if(this.auth.idHistoria == turno.idPaciente && turno.Historia != null)
          {
            this.turnos.push(turno);
          }
        });
      }
      setTimeout(() => {
        this.loading.stop();
      }, 500);
    });
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
  }
  
}
