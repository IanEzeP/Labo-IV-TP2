import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../servicios/translate.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  lang = 'es';
  titulo = 'WELCOME_TITLE';
  subtitulo = 'WELCOME_SUBTITLE';
  cuerpo = 'WELCOME_BODY';

  constructor (private translator : TranslateService) {}

  ngOnInit(): void 
  {
    this.translator.use("es").then(() => {
      console.log(this.translator.data);
    });
  }

  setLang(lang: string) {
    this.translator.use(lang);
  }
}
