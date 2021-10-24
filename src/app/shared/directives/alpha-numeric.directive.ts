import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {

  private el: NgControl;

  constructor(private ngControl: NgControl) {
    this.el = ngControl;
  }
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.el.control.patchValue(value.replace(/[^0-9A-Za-z]/g, ''));
  }

}
