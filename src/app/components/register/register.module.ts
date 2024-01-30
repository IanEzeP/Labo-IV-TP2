import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PacienteComponent } from './paciente/paciente.component';
import { EspecialistaComponent } from './especialista/especialista.component';

@NgModule({
  declarations: [
    PacienteComponent,
    EspecialistaComponent
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
