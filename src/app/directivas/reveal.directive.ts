import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[reveal]'
})
export class RevealDirective {

  constructor(private element: ElementRef) {
    this.element.nativeElement.style.color = '#ffffff';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.element.nativeElement.style.color = '#000';
  }

  @HostListener('mouseleave') onMouseExit() {
    this.element.nativeElement.style.color = '#ffffff';
  }
}
