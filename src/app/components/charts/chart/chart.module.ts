import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartRoutingModule } from './chart-routing.module';

import { LogsComponent } from './logs/logs.component';

@NgModule({
  declarations: [
    LogsComponent,
    LogsComponent,
  ],
  imports: [
    CommonModule,
    ChartRoutingModule
  ]
})
export class ChartModule { }
