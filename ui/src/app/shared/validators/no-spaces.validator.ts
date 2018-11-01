import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noSpacesValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'noSpaces': {value: control.value}} : null;
  };
}
