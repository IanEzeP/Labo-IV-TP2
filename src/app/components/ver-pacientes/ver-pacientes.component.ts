import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/servicios/loading.service';
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
  turnosHistorial : Array<any> = [];

  observableTurnos = Subscription.EMPTY;

  constructor(private data : DatabaseService, private auth : AuthService, private router: Router, 
    private loading : LoadingService) {}

  ngOnInit() 
  {
    this.loading.load();
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
      setTimeout(() => {
        this.loading.stop();
      }, 500);
    });
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
  }

  mostrarHistorial(id : any)
  {
    this.auth.idHistoria = id;
    this.router.navigateByUrl("historial-clinico");
  }
}
