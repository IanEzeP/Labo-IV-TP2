import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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

import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { NavigatorComponent } from './components/navigator/navigator.component';

import { AlertasService } from './servicios/alerta.service';
import { DatabaseService } from './servicios/database.service';
import { AuthService } from './servicios/auth.service';
import { AccessUsersComponent } from './components/login/access-users/access-users.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    RegistroComponent,
    LoginComponent,
    ErrorComponent,
    EspecialidadesComponent,
    NavigatorComponent,
    AccessUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],//"locationId":"us-central"
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    AlertasService,
    DatabaseService,
    AuthService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
