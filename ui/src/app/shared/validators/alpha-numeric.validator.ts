import { AbstractControl, ValidatorFn } from '@angular/forms';

export function alphaNumericValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = (/[^a-z0-9_-]+/i.test(control.value));
    return forbidden ? {'alphaNumeric': {value: control.value}} : null;
  };
}
