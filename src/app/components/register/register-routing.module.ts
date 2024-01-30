import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './paciente/paciente.component';
import { EspecialistaComponent } from './especialista/especialista.component';

const routes : Routes = [
  {
    path: '',
    children: [
      { path: 'paciente', component: PacienteComponent },
      { path: 'especialista', component: EspecialistaComponent },
      { path: '**', redirectTo: 'paciente' }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})

export class RegisterRoutingModule { }
