import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;

  constructor() {
    // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
  }

  transform(value: number | string, fractionSize: number = 0, negativeAllowed: boolean = false): string {
    let [integer, fraction = ''] = (value || '').toString().split(this.DECIMAL_SEPARATOR);


    let negativeExists = false;
    if (negativeAllowed) {
      if (integer.indexOf('-') === 0) {
        negativeExists = true; }
    }

    integer = integer.replace(/^0(0+)?/g, '0');
    integer = integer.replace(/\D/g, '');

    integer = integer.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + this.THOUSANDS_SEPARATOR);


    fraction = fraction.replace(/\D/g, '');

    fraction = fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : '';

    const final = integer ? integer + fraction : integer;
    return negativeExists ? '-' + final : final;
  }

  parse(value: string, fractionSize: number = 2): string {
    let [integer, fraction = ''] = (value || '').toString().split(this.DECIMAL_SEPARATOR);

    integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : '';

    return integer ? integer + fraction : integer;
  }

}
