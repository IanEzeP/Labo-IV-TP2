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

  public logueado : boolean = false;
  public email : string = "";
  public rol : string = "";
  public especAutorizado : boolean = false;
  public idUser : string = "";

  constructor(private auth: Auth, private loading: LoadingService) { }

  public async logIn(email: string, password: string) 
  {
    try {
      const credential = signInWithEmailAndPassword(this.auth, email, password);
      //console.log(credential);
      this.logueado = true;

      return credential;
    } catch (error) {
      return null;
    }
  }

  public async logOut()
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

  public async register(email : string, password : string)
  {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.logIn(email, password);
      const user = userCredential.user;

      if(user != null)
      {
        await sendEmailVerification(user);
      }
  }
  
  public get usuarioActual() : User | null
  {
    return this.auth.currentUser
  }
  
  public cambiarUsuarioActual(usuario : User | null)
  {
    return this.auth.updateCurrentUser(usuario)
  }
}
