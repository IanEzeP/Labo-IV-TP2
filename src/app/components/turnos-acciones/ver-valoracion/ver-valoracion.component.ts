import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ver-valoracion',
  templateUrl: './ver-valoracion.component.html',
  styleUrls: ['./ver-valoracion.component.css']
})
export class VerValoracionComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  constructor() {}

  public onDismiss()
  {
    this.close.emit();
  }
}
