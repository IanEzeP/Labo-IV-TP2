import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PacienteComponent } from './paciente/paciente.component';
import { EspecialistaComponent } from './especialista/especialista.component';
import { EspecialidadesComponent } from '../especialidades/especialidades.component';

@NgModule({
  declarations: [
    PacienteComponent,
    EspecialistaComponent,
    EspecialidadesComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    NgxCaptchaModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})

export class RegisterModule { }
