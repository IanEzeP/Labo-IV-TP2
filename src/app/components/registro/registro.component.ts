import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  animations: [
    trigger('slideInBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(":leave", [
        animate('500ms ease-out', style({ transform: 'translateY(100%)' })),
      ])
    ])
  ],
})
export class RegistroComponent {

  imageVisible = true;

  toggleImage() {
    this.imageVisible == false ? this.imageVisible = true : this.imageVisible = false
  }

  condition = true;

  constructor() { }

  cambiarEstado()
  {
    this.condition = !this.condition;
  }

  /*SOLO PRUEBA, tengo que moverlo a otro componente. Y probar que funcione
  getImages()
  {
    const imagesref = this.firestorage.ref('pacientes'); //Referencia a la carpeta de FireStorage
    const ii = imagesref.listAll().subscribe((next : any) => 
    {
      let result : Array<any> = next;
      console.log(result);
      //limpiar el array de imagenes[].
      next.items.forEach((item : string) => {
        const ee = this.firestorage.storage.refFromURL(item);
        const url = ee.getDownloadURL();
        console.log(url);
        //Guardar cada url en un array de imagenes[].
      });
    });
  }*/
}