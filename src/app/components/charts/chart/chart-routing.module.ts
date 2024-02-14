import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { TurnosDiaComponent } from './turnos-dia/turnos-dia.component';
import { TurnosEspecialiadadComponent } from './turnos-especialiadad/turnos-especialiadad.component';
import { TurnosSolicitadosComponent } from './turnos-solicitados/turnos-solicitados.component';
import { TurnosFinalizadosComponent } from './turnos-finalizados/turnos-finalizados.component';

const routes : Routes = [
  {
    path: '',
    children: [
      { path: 'logs', component: LogsComponent },
      { path: 't-dias', component: TurnosDiaComponent },
      { path: 't-especialidad', component: TurnosEspecialiadadComponent },
      { path: 't-solicitados', component: TurnosSolicitadosComponent },
      { path: 't-finalizados', component: TurnosFinalizadosComponent },
      { path: '**', redirectTo: 'logs' }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ChartRoutingModule { }
