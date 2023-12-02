import { Injectable } from '@angular/core';
import { Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  sendEmailVerification, 
  authState,
  } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public logueado : boolean = false;
  public userName : string = "";
  public rol : string = "";
  public validationState : boolean | null = null;

  constructor(private auth: Auth) { }

  public async logIn(email: string, password: string) 
  {
    try {
      const credential = signInWithEmailAndPassword(this.auth, email, password);
      //const uid = await this.getUserUid() || '';
      //this.userName = await this.data.getUserNameByUID(uid);
      //this.validationState = await this.data.getValidationStateByUID(uid);
      //this.rol = await this.data.getUserRolByEmailOrUserName(emailOrUsername);
      console.log(credential);
      this.logueado = true;

      return credential;
    } catch (error) {
      return null;
    }
  }

  public async logOut()
  {
    this.logueado = false;
    //this.userName = '';
    this.rol = "";
    this.validationState = false;
    return await signOut(this.auth);
  }

  public async register(email : string, password : string)
  {
    //const userExist = await this.data.userExist(userData['UserName']);
    //if(!userExist)
    //{
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.logIn(email, password);
      const user = userCredential.user;
      //const userUID = await this.getUserUid() || '';
      if(user != null)
      {
        await sendEmailVerification(user);
      }
      //await this.data.SaveUser(userUID, userData);
      /*return true;
    //}
    return false;*/
  }
  
  public get usuarioActual() : User | null
  {
    return this.auth.currentUser
  }
  
  public cambiarUsuarioActual(usuario : User | null)
  {
    return this.auth.updateCurrentUser(usuario)
  }
/*
  public async getUserUid()
  {
    return new Promise<string | null>((resolve, reject) => 
    {
      this.ngFireAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null); 
        }
      });
    });
  }
*//*
  public async reLogin() 
  {
    const uid = await this.getUserUid() || '';
    this.userName = await this.data.getUserNameByUID(uid);
    this.logueado = true;
    this.validationState = await this.data.getValidationStateByUID(uid);
    this.rol = await this.data.getUserRolByEmailOrUserName(this.userName);
  }*/
}
