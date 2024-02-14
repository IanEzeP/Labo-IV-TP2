import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  @Input() appHighlight = '';

  constructor(private element: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.element.nativeElement.style.color = this.appHighlight || 'blue';
  }

  @HostListener('mouseleave') onMouseExit() {
    this.element.nativeElement.style.color = '#000';
  }
}