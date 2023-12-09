import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Usuario } from '../classes/usuario';
import { Pacientes } from '../classes/pacientes';
import { Especialistas } from '../classes/especialistas';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService{

  adminsDB : Array<Usuario> = []; 
  especDB : Array<Especialistas> = []; 
  pacDB : Array<Pacientes> = []; 

  constructor(private firestore: AngularFirestore, private firestorage: AngularFireStorage) 
  { 
    console.log("Utilizo servicio DatabaseService");
    this.getCollectionObservable("Administradores").subscribe((next : any) => 
    {
      let result : Array<any>  = next;
      this.adminsDB = [];
      result.forEach(obj => {
        this.adminsDB.push(new Usuario(obj.id, obj.Nombre, obj.Apellido, obj.Edad, obj.DNI, obj.Mail, obj.Password, obj.ImagenPerfil));
      });
    });

    this.getCollectionObservable("Pacientes").subscribe((next : any) => 
    {
      let result : Array<any>  = next;
      this.pacDB = [];
      result.forEach(obj => {
        this.pacDB.push(new Pacientes(obj.id, obj.Nombre, obj.Apellido, obj.Edad, obj.DNI, obj.Mail, obj.Password, obj.ImagenPerfil, obj.ImagenAdicional, obj.ObraSocial));
      });
    });

    this.getCollectionObservable("Especialistas").subscribe((next : any) => 
    {
      let result : Array<any>  = next;
      this.especDB = [];
      result.forEach(obj => {
        this.especDB.push(new Especialistas(obj.id, obj.Nombre, obj.Apellido, obj.Edad, obj.DNI, obj.Mail, obj.Password, obj.ImagenPerfil, obj.Especialidades, obj.autorizado));
      });
    });
  }

  validarDatoGuardado(id : string, coleccion : string)
  {
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

  traerUnDocumento(coleccion: string, id: string)
  {
    return this.firestore.firestore.doc(coleccion + '/' + id).get();
  }

  traerDocumentoObservable(coleccion: string, id: string)
  {
    return this.firestore.doc(coleccion + '/' + id).get();
  }

  getCollectionObservable(coleccion : string)
  {
    return this.firestore.collection(coleccion).valueChanges();
  }

  getCollectionPromise(coleccion : string)
  {
    return this.firestore.firestore.collection(coleccion).get();
  }

  getCollectionByRol(rol : string)
  {
    let coleccion : string = '';
    switch (rol)
    {
      case "ADMINISTRADOR":
        coleccion = "Administradores";
        break;
      case "ESPECIALISTA":
        coleccion = "Especialistas";
        break;
      case "PACIENTE":
        coleccion = "Pacientes";
        break;
    }

    return coleccion;
  }
  
  traerRol(email : string) : string
  {
    let rol = 'NF';

    this.adminsDB.forEach(admin => {
      if(admin.email == email)
      {
        rol = 'ADMINISTRADOR';
      }
    });

    if(rol == 'NF')
    {
      this.pacDB.forEach(paciente => {
        if(paciente.email == email)
        {
          rol = 'PACIENTE';
        }
      });

      if(rol == 'NF')
      {
        this.especDB.forEach(especialista => {
          if(especialista.email == email)
          {
            rol = 'ESPECIALISTA';
          }
        });
      }
    }

    return rol;
  }

  getIdByEmail(email : string, coleccion : string)
  {
    let id : string = '';

    switch(coleccion)
    {
      case "Administradores":
        this.adminsDB.forEach(admin => {
          if(admin.email == email)
          {
            id = admin.id;
          }
        });
        break;
      case "Pacientes":
        this.pacDB.forEach(pac => {
          if(pac.email == email)
          {
            id = pac.id;
          }
        });
        break;
      case "Especialistas":
        this.especDB.forEach(espec => {
          if(espec.email == email)
          {
            id = espec.id;
          }
        });
        break;
    }

    return id;
  }

  actualizarHorarios(id : string, horario : any)
  {
    const espec = this.firestore.doc('Especialistas/' + id);
    espec.update({
      TurnoMañana : horario.TurnoMañana,
      TurnoTarde: horario.TurnoTarde
    }).catch(error => 
    {
      console.log(error);
    });
  }

/*
  getIdByMail(email : string, coleccion : string)
  {
    return this.getCollectionObservable(coleccion).subscribe((next : any) =>
    {
      let result : Array<any> = next;
      result.forEach(documento => {
        if(documento.Mail == email)
      });
    })
  }*/

/**
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

   * Bueno Ian, esto no funciona porque subscribe se ejecuta asincronicamente pero no hace caso al 'await'
   * Tenemos que encontrar la vuelta para sacar el rol de quien se esta intentando loguear.
   * Añadir el rol a cada documento no le veo el sentido hoy. Hoy 5/12 tampoco le veo el sentido
   */
  /**
  async traerRol2(email : string)
  {
    let rol : string = 'NF';
    let i : number = 0;
    let coleccion : string = 'Administradores';
    let rolEsperado : string = 'Administrador';

    while(i < 3)
    {
      if(i == 1)
      {
        coleccion = 'Pacientes';
        rolEsperado = 'Paciente';
      }
      else if(i == 2)
      {
        coleccion = 'Especialistas';
        rolEsperado = 'Especialista';
      }
      console.log("Antes del await");
      await this.getCollectionPromise(coleccion).then((next : any) =>
      {
        console.log("Dentro del await");

        let result : Array<any> = next;

        result.forEach(qSnapshot => {
          console.log("Iteracion");
          //Intentando usar un array con todos los admins cargados se me ocurrio otra forma de hacer esto.

          this.traerUnDocumento(coleccion, qSnapshot.id).then((next : any) =>
          {
            console.log("Comparacion");

            if(email == next.data().Mail)
            {
              console.log("Coincidencia");
              rol = rolEsperado;
            }
          });
        });
      });
      console.log("Fuera del await");

      if(rol != 'NF') {
        break;
      }
      
      i++;
    }
    console.log(rol);

    return rol;
  }

   * Esto tampoco funciona porque el flujo del while continua a pesar del 'await'
   */

  
}
