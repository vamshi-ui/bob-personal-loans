import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyCharacters]'
})
export class OnlyCharactersDirective {

  private el: NgControl;

  constructor(private ngControl: NgControl) {
    this.el = ngControl;
  }
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.el.control.patchValue(value.replace(/[^a-zA-Z]/g, ''));
  }
}
