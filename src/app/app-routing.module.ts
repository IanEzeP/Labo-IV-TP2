import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ErrorComponent } from './components/error/error.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VerificacionAccesoComponent } from './components/login/verificacion-acceso/verificacion-acceso.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { PedirTurnoComponent } from './components/pedir-turno/pedir-turno.component';
import { TurnosPacientesComponent } from './components/turnos-pacientes/turnos-pacientes.component';
import { TurnosEspecialistasComponent } from './components/turnos-especialistas/turnos-especialistas.component';
import { TurnosClinicaComponent } from './components/turnos-clinica/turnos-clinica.component';
import { HistorialComponent } from './components/historial/historial.component';
import { VerPacientesComponent } from './components/ver-pacientes/ver-pacientes.component';
import { ListadoComponent } from './components/usuarios/listado/listado.component';
import { ManejarAccesoComponent } from './components/usuarios/manejar-acceso/manejar-acceso.component';
import { RegistrarComponent } from './components/usuarios/registrar/registrar.component';
import { especVerificationGuard } from './guards/espec-verification.guard';

const routes: Routes = [
  { path: 'home', component: BienvenidaComponent, data: { animation: 'HomePage' }},
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage'}},
  { path: 'registro', component: RegistroComponent, data: { animation: 'RegisterPage'},
    loadChildren: () => import('./components/register/register.module').then( m => m.RegisterModule)
  },
  { path: 'usuarios', component: UsuariosComponent, 
  children: [
    { path: 'listado', component: ListadoComponent },
    { path: 'acceso-espec', component: ManejarAccesoComponent },
    { path: 'registrar-admin', component: RegistrarComponent },
    { path: '', redirectTo: 'listado', pathMatch:'full'},
  ]},
  { path: 'pacientes', component: VerPacientesComponent}, 
  { path: 'verificando-acceso', component: VerificacionAccesoComponent, canDeactivate: [especVerificationGuard]},  
  { path: 'perfil', component: MiPerfilComponent},
  { path: 'pedir-turno', component: PedirTurnoComponent},
  { path: 'turnos-pacientes', component: TurnosPacientesComponent},
  { path: 'turnos-especialistas', component: TurnosEspecialistasComponent},
  { path: 'turnos-admins', component: TurnosClinicaComponent},
  { path: 'historial-clinico', component: HistorialComponent},
  { path: '**', component: ErrorComponent},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
