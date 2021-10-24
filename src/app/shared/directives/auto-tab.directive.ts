import { Directive, Input, HostListener  } from '@angular/core';

@Directive({
  selector: '[appAutoTab]'
})
export class AutoTabDirective {
// tslint:disable-next-line: no-input-rename
@Input ('appAutoTab') appAutoTab;
@HostListener('input', ['$event.target']) onInput(input) {
  const length  = input.value.length;
  const maxLength = input.attributes.maxLength.value;
  let newValue = input.value;
  newValue = newValue.replace(/[^0-9]*/g, '');
  if (length >= maxLength && newValue !== '') {
    this.appAutoTab.focus();
  }
}
  constructor() { }

}
