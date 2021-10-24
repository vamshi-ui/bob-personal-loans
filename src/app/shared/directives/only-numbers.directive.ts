import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  private el: NgControl;

  constructor(private ngControl: NgControl) {
    this.el = ngControl;
  }
  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this.el.control.patchValue(value.replace(/[^0-9]/g, ''));
  }
}
