import { Directive, ElementRef, AfterViewInit  } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    this.element.nativeElement.focus();
  }
}
