import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartRoutingModule } from './chart-routing.module';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { LogsComponent } from './logs/logs.component';
import { TurnosEspecialiadadComponent } from './turnos-especialiadad/turnos-especialiadad.component';
import { TurnosDiaComponent } from './turnos-dia/turnos-dia.component';
import { TurnosSolicitadosComponent } from './turnos-solicitados/turnos-solicitados.component';
import { TurnosFinalizadosComponent } from './turnos-finalizados/turnos-finalizados.component';
@NgModule({
  declarations: [
    LogsComponent,
    LogsComponent,
    TurnosEspecialiadadComponent,
    TurnosDiaComponent,
    TurnosSolicitadosComponent,
    TurnosFinalizadosComponent,
  ],
  imports: [
    CommonModule,
    ChartRoutingModule,
    CanvasJSAngularChartsModule,
  ]
})
export class ChartModule { }
