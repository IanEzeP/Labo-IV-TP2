import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  sendEmailVerification
  } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  logueado : boolean = false;
  email : string = "";
  rol : string = "";
  especAutorizado : boolean = false;
  idUser : string = "";
  idHistoria : string = "";

  constructor(private auth: Auth, private loading: LoadingService) { }

  async logIn(email: string, password: string) 
  {
    try 
    {
      const credential = signInWithEmailAndPassword(this.auth, email, password);
      this.logueado = true;

      return credential;
    } catch (error) 
    {
      return null;
    }
  }

  async logOut()
  {
    this.loading.load();
    this.logueado = false;
    this.email = '';
    this.rol = "";
    this.especAutorizado = false;
    setTimeout(() => {
      this.loading.stop();
    }, 1000);
    
    return await signOut(this.auth);
  }

  async register(email : string, password : string)
  {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.logIn(email, password);
      const user = userCredential.user;

      if(user != null)
      {
        await sendEmailVerification(user);
        this.logueado = false;
      }
  }
  
  get usuarioActual() : User | null
  {
    return this.auth.currentUser
  }
  
  cambiarUsuarioActual(usuario : User | null)
  {
    return this.auth.updateCurrentUser(usuario)
  }
}
