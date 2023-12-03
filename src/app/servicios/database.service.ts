import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Usuario } from '../classes/usuario';
import { Pacientes } from '../classes/pacientes';
import { Especialistas } from '../classes/especialistas';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService implements OnInit{

  constructor(private firestore: AngularFirestore, private firestorage: AngularFireStorage) { }
  
  ngOnInit(): void 
  {
  }

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
  traerUnDocumento(coleccion: string, id: string)
  {
    const documento = this.firestore.doc(coleccion + '/' + id);
    return documento.get();
  }

  getCollectionObservable(coleccion : string)
  {
    return this.firestore.collection(coleccion).valueChanges();
  }

  async traerRol(email : string)
  {
    let rol : string = 'NF';

    const col = this.firestore.collection('Administradores');
    col.valueChanges().subscribe((docs : any) => {
      let arrayAdmin : Array<any> = docs;
      arrayAdmin.forEach(element => {
        if(email == element.Mail)
        {
          console.log("Coincidencia en Administradores");
          rol = 'administrador';
        }
      });
    });
    if(rol == 'NF')
    {
      const col = this.firestore.collection('Pacientes');
      col.valueChanges().subscribe((docs : any) => {
        let arrayAdmin : Array<any> = docs;
        arrayAdmin.forEach(element => {
          if(email == element.Mail)
          {
          console.log("Coincidencia en Pacientes");

            rol = 'paciente';
          }
        });
      });
    }
    if(rol == 'NF')
    {
        const col = this.firestore.collection('Especialistas');
        col.valueChanges().subscribe((docs : any) => {
        let arrayAdmin : Array<any> = docs;
        arrayAdmin.forEach(element => {
          if(email == element.Mail)
          {
            rol = 'especialista';
          console.log(rol);
          }
        });
      });
    }
    console.log(rol);

    return rol;
  }
  /**
   * Bueno Ian, esto no funciona porque subscribe se ejecuta asincronicamente pero no hace caso al 'await'
   * Tenemos que encontrar la vuelta para sacar el rol de quien se esta intentando loguear.
   * Añadir el rol a cada documento no le veo el sentido hoy.
   */
}
