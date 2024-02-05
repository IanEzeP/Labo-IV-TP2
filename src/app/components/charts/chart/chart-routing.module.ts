import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs/logs.component';

const routes : Routes = [
  {
    path: '',
    children: [
      { path: 'logs', component: LogsComponent },
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
