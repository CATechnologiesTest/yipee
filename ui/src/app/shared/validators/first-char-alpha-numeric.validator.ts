import { AbstractControl, ValidatorFn } from '@angular/forms';

export function firstCharAlphaNumericValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    let forbidden;
    if (control.value === null || control.value === undefined) {

    } else {
      forbidden = (/[^a-z0-9]+/i.test(control.value[0]));
    }
    return forbidden ? {'firstCharAlphaNumeric': {value: control.value}} : null;
  };
}
