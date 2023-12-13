import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.development';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { NgxCaptchaModule } from 'ngx-captcha';

import { AlertasService } from './servicios/alerta.service';
import { DatabaseService } from './servicios/database.service';
import { AuthService } from './servicios/auth.service';
import { LoadingService } from './servicios/loading.service';
import { GenerateFilesService } from './servicios/generate-files.service';

import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { AccessUsersComponent } from './components/login/access-users/access-users.component';
import { LoadingComponent } from './components/loading/loading.component';
import { VerificarComponent } from './components/registro/verificar/verificar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ListadoComponent } from './components/usuarios/listado/listado.component';
import { ManejarAccesoComponent } from './components/usuarios/manejar-acceso/manejar-acceso.component';
import { RegistrarComponent } from './components/usuarios/registrar/registrar.component';
import { AdministradoresComponent } from './components/listados/administradores/administradores.component';
import { EspecialistasComponent } from './components/listados/especialistas/especialistas.component';
import { PacientesComponent } from './components/listados/pacientes/pacientes.component';
import { DetalleComponent } from './components/usuarios/listado/detalle/detalle.component';
import { VerificacionAccesoComponent } from './components/login/verificacion-acceso/verificacion-acceso.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { PedirTurnoComponent } from './components/pedir-turno/pedir-turno.component';
import { TurnosPacientesComponent } from './components/turnos-pacientes/turnos-pacientes.component';
import { TurnosEspecialistasComponent } from './components/turnos-especialistas/turnos-especialistas.component';
import { TurnosClinicaComponent } from './components/turnos-clinica/turnos-clinica.component';
import { HistorialComponent } from './components/historial/historial.component';
import { CancelarComponent } from './components/turnos-acciones/cancelar/cancelar.component';
import { EncuestaComponent } from './components/turnos-acciones/encuesta/encuesta.component';
import { FinalizarComponent } from './components/turnos-acciones/finalizar/finalizar.component';
import { ValorarComponent } from './components/turnos-acciones/valorar/valorar.component';
import { RechazarComponent } from './components/turnos-acciones/rechazar/rechazar.component';
import { VerValoracionComponent } from './components/turnos-acciones/ver-valoracion/ver-valoracion.component';
import { VerHistorialComponent } from './components/turnos-acciones/ver-historial/ver-historial.component';
import { VerPacientesComponent } from './components/ver-pacientes/ver-pacientes.component';
import { PacienteCardComponent } from './components/paciente-card/paciente-card.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    RegistroComponent,
    LoginComponent,
    ErrorComponent,
    EspecialidadesComponent,
    NavigatorComponent,
    AccessUsersComponent,
    LoadingComponent,
    VerificarComponent,
    UsuariosComponent,
    ListadoComponent,
    ManejarAccesoComponent,
    RegistrarComponent,
    AdministradoresComponent,
    EspecialistasComponent,
    PacientesComponent,
    DetalleComponent,
    VerificacionAccesoComponent,
    MiPerfilComponent,
    PedirTurnoComponent,
    TurnosPacientesComponent,
    TurnosEspecialistasComponent,
    TurnosClinicaComponent,
    HistorialComponent,
    CancelarComponent,
    EncuestaComponent,
    FinalizarComponent,
    ValorarComponent,
    RechazarComponent,
    VerValoracionComponent,
    VerHistorialComponent,
    VerPacientesComponent,
    PacienteCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    NgxCaptchaModule,
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    AlertasService,
    DatabaseService,
    AuthService,
    LoadingService,
    GenerateFilesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
