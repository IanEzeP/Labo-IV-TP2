import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore, private firestorage: AngularFireStorage) { }

  validarDatoGuardado(id : string, coleccion : string)
  {
    //let retorno : boolean = false;
    const col = this.firestore.firestore.collection(coleccion);
    console.log(id);
    let retorno = col.get().then((next : any) =>
    {
      let result : Array<any> = next;
      let exito : boolean = false;
      result.forEach(obj =>
      {
        if(id == obj.id)
        {
          exito = true;
        }
      });
      return exito;
    });
    return retorno;
  }
/*
      for (let i = 0; i < result.length; i++)
      {
        if(result[i].id == id)
        {
          retorno = true;
          break;
        }
      }*/
  traerUnDato(coleccion: string, id: string)
  {
    const documento = this.firestore.doc(coleccion + '/' + id);
    return documento.get();
  }
}
