import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../servicios/translate.service';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  titulo = 'WELCOME_TITLE';
  subtitulo = 'WELCOME_SUBTITLE';
  cuerpo = 'WELCOME_BODY';

  constructor (private translator : TranslateService, private data : DatabaseService) {}

  ngOnInit(): void 
  {
  }
}
