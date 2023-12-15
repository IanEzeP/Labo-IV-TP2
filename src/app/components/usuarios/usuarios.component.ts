import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { GenerateFilesService } from 'src/app/servicios/generate-files.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  showListado : boolean = true;
  showAcceso : boolean = false;
  showRegistro : boolean = false;

  usuarios : Array<any> = [];

  constructor(private auth: AuthService, private data: DatabaseService, private file: GenerateFilesService)
  {
    this.usuarios = this.usuarios.concat(this.data.pacDB, this.data.especDB, this.data.adminsDB);
  }

  onConsultarClick()
  {
    this.showListado = true;
    this.showAcceso= false;
    this.showRegistro = false;
  }

  onHabilitarClick()
  {
    this.showListado = false;
    this.showAcceso= true;
    this.showRegistro = false;
  }

  onRegistrarClick()
  {
    this.showListado = false;
    this.showAcceso= false;
    this.showRegistro = true;
  }

  onDescargarClick()
  {
    let dataArray = this.usuarios.map((usuario : any) =>
    {
      let data: { [clave: string]: any } = {};

      for (let clave in usuario) 
      {
        if(clave != 'password')
        {
          data[clave] = usuario[clave];
        }
      }
      
      return {
        ...data,
      }
    });
    
    this.file.datosUsuariosToExcel(dataArray);
  }
}
