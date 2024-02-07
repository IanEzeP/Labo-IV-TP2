import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { GenerateFilesService } from 'src/app/servicios/generate-files.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  usuarios : Array<any> = [];

  constructor(private data: DatabaseService, private file: GenerateFilesService)
  {
    this.usuarios = this.usuarios.concat(this.data.pacDB, this.data.especDB, this.data.adminsDB);
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
