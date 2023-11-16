import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.development';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    RegistroComponent,
    LoginComponent,
    ErrorComponent,
    EspecialidadesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({"projectId":"hostingclinicatp","appId":"1:49391722655:web:72ce4561ca8998cb29c2aa","storageBucket":"hostingclinicatp.appspot.com","apiKey":"AIzaSyB9vAWYRT-QyORlCo40_9SNl44pUnyjIU0","authDomain":"hostingclinicatp.firebaseapp.com","messagingSenderId":"49391722655"})),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: {"projectId":"hostingclinicatp","appId":"1:49391722655:web:72ce4561ca8998cb29c2aa","storageBucket":"hostingclinicatp.appspot.com","apiKey":"AIzaSyB9vAWYRT-QyORlCo40_9SNl44pUnyjIU0","authDomain":"hostingclinicatp.firebaseapp.com","messagingSenderId":"49391722655"} }],
  //providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent]
})
export class AppModule { }